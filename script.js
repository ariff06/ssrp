const imageUpload = document.getElementById('imageUpload');
    const uploadedImage = document.getElementById('uploadedImage');
    const imageContainer = document.getElementById('imageContainer');
    const topTextInput = document.getElementById('topTextInput');
    const bottomTextInput = document.getElementById('bottomTextInput');
    const topTextOverlay = document.getElementById('topText');
    const bottomTextOverlay = document.getElementById('bottomText');
    const saveImageBtn = document.getElementById('saveImage');
    const fontSizeSlider = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const textShadowCheckbox = document.getElementById('textShadow');
    const controls = document.querySelector('.controls');
    const textStrokeCheckbox = document.getElementById('textStroke');
    const strokeColorInput = document.getElementById('strokeColor');
    const strokeWidthInput = document.getElementById('strokeWidth');
    const strokeWidthValue = document.getElementById('strokeWidthValue');
    

    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) { 
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                resetImagePosition();
            }
            reader.readAsDataURL(file);
        }
    });

    function resetImagePosition() {
        currentScale = 1;
        currentX = 0;
        currentY = 0; 
        updateImageTransform();
    }

    function updateImageTransform() {
        uploadedImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
    }

    function updateTextOverlay(input, overlay) {
        const lines = input.value.split('\n').slice(0, 6);
        overlay.innerHTML = '';
        lines.forEach(line => {
            const p = document.createElement('p');
            if (line.startsWith('*')) {
                p.classList.add('special');
                p.textContent = line.substring(1); // Hapus asterisk dari teks yang ditampilkan
            } else {
                p.textContent = line;
            }
            p.style.fontSize = `${fontSizeSlider.value}px`;
            if (textShadowCheckbox.checked) {
                p.style.textShadow = '2px 4px 3px rgba(0,0,0,1)';
            } else {
                p.style.textShadow = 'none';
            }
            if (textStrokeCheckbox.checked) {
                const strokeWidth = parseFloat(strokeWidthInput.value);
                p.style.webkitTextStroke = `${strokeWidth}px ${strokeColorInput.value}`;
                p.style.textStroke = `${strokeWidth}px ${strokeColorInput.value}`;
                // Tambahkan efek text-shadow untuk memperkuat stroke
                p.style.textShadow = `
                    -${strokeWidth}px -${strokeWidth}px 0 ${strokeColorInput.value},
                    ${strokeWidth}px -${strokeWidth}px 0 ${strokeColorInput.value},
                    -${strokeWidth}px ${strokeWidth}px 0 ${strokeColorInput.value},
                    ${strokeWidth}px ${strokeWidth}px 0 ${strokeColorInput.value}
                `;
            } else {
                p.style.webkitTextStroke = 'none';
                p.style.textStroke = 'none';
                p.style.textShadow = 'none';
            }
            overlay.appendChild(p);
        });
    }

    topTextInput.addEventListener('input', () => updateTextOverlay(topTextInput, topTextOverlay));
    bottomTextInput.addEventListener('input', () => updateTextOverlay(bottomTextInput, bottomTextOverlay));

    fontSizeSlider.addEventListener('input', function() {
        fontSizeValue.textContent = `${this.value}px`;
        updateTextOverlay(topTextInput, topTextOverlay);
        updateTextOverlay(bottomTextInput, bottomTextOverlay);
    });

    textShadowCheckbox.addEventListener('change', function() {
        updateTextOverlay(topTextInput, topTextOverlay);
        updateTextOverlay(bottomTextInput, bottomTextOverlay);
    });

    textStrokeCheckbox.addEventListener('change', function() {
        updateTextOverlay(topTextInput, topTextOverlay);
        updateTextOverlay(bottomTextInput, bottomTextOverlay);
    });
    
    strokeColorInput.addEventListener('input', function() {
        updateTextOverlay(topTextInput, topTextOverlay);
        updateTextOverlay(bottomTextInput, bottomTextOverlay);
    });
    
    strokeWidthInput.addEventListener('input', function() {
        strokeWidthValue.textContent = `${this.value}px`;
        updateTextOverlay(topTextInput, topTextOverlay);
        updateTextOverlay(bottomTextInput, bottomTextOverlay);
    });

    document.getElementById('zoomIn').addEventListener('click', () => {
        currentScale = Math.min(3, currentScale + 0.1);
        updateImageTransform();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        currentScale = Math.max(0.5, currentScale - 0.1);
        updateImageTransform();
    });

    document.getElementById('moveUp').addEventListener('click', () => {
        currentY += 10;
        updateImageTransform();
    });

    document.getElementById('moveDown').addEventListener('click', () => {
        currentY -= 10;
        updateImageTransform();
    });

    document.getElementById('moveLeft').addEventListener('click', () => {
        currentX += 10;
        updateImageTransform();
    });

    document.getElementById('moveRight').addEventListener('click', () => {
        currentX -= 10;
        updateImageTransform();
    });

    document.getElementById('resetPosition').addEventListener('click', resetImagePosition);

    saveImageBtn.addEventListener('click', function() {
        controls.style.display = 'none';

        html2canvas(imageContainer, {
        scale: 1
        }).then(canvas => {
            controls.style.display = 'grid';

            const link = document.createElement('a');
            link.download = 'ssrp-gta-samp-image.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
