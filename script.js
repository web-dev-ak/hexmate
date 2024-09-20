let lengthOfHex = 6;
let colorPreviewBox = document.getElementById('color-preview-box');
let generateBtn = document.getElementById('gen-btn');
let hexValueDisplay = document.getElementById('hex-code');
let rgbValueDisplay = document.getElementById('rgb-code');
let colorNameText = document.getElementById('color-name');

// UPDATE IN UI
generateBtn.addEventListener('click', async () => {
    let hex = hexCodeGenerator(lengthOfHex);
    let rgb = hexToRgb(hex);
    let [R, G, B] = rgb.split(', ').map(Number);
    let colorName = await getColorName(hex);
    
    colorPreviewBox.style.backgroundColor = `#${hex}`;
    hexValueDisplay.textContent = `${hex}`;
    rgbValueDisplay.textContent = `${rgb}`;
    colorNameText.textContent = `${colorName}`;

    if (getBrightness(R, G, B) > 128) {
        colorNameText.style.color = "rgba(0,0,0,0.5)"; 
    } else {
        colorNameText.style.color = "rgba(255,255,255,0.5)";
    }
});

// HEX TO RGB CONVERTER
function hexToRgb(hex) {
    let R = parseInt(hex.substring(0, 2), 16);
    let G = parseInt(hex.substring(2, 4), 16);
    let B = parseInt(hex.substring(4, 6), 16);

    return `${R}, ${G}, ${B}`;
}

// HEX GENERATOR
function hexCodeGenerator(lengthOfHex) {
    const chars = 'ABCDEF0123456789';
    let hex = '';
    for (let i = 0; i < lengthOfHex; i++) {
        hex += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hex;
}

// HEX TO COLOR NAME
async function getColorName(hex) {
    const apiUrl = `https://www.thecolorapi.com/id?hex=${hex}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.name.value; // Return the color name
    } catch (error) {
        console.error('Error fetching color name:', error);
        return 'Unknown'; // Fallback in case of error
    }
}

// COLOR NAME BRIGHTNESS
function getBrightness(R, G, B) {
    return (R * 0.299 + G * 0.587 + B * 0.114);
}

// COPY TO CLIPBOARD
let hexCodeBox = document.getElementById('hex-code-box');
let rgbCodeBox = document.getElementById('rgb-code-box');

hexCodeBox.addEventListener('click', () => {
    const hexCode = hexValueDisplay.textContent;
    navigator.clipboard.writeText(hexCode).then(() => {
        customAlert(`${hexCode} is copied to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

rgbCodeBox.addEventListener('click', () => {
    const rgbCode = rgbValueDisplay.textContent;
    navigator.clipboard.writeText(rgbCode).then(() => {
        customAlert(`${rgbCode} is copied to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});


// THEME SWITCH
let themeSwitchBtn = document.getElementById('theme-switch-btn');
let lightModeIcon = document.getElementById('light-mode-icon');
let darkModeIcon = document.getElementById('dark-mode-icon');

function isVisible(element) {
    return getComputedStyle(element).display !== 'none';
}

themeSwitchBtn.addEventListener('click', () => {
    if (isVisible(lightModeIcon)) {
        darkModeIcon.style.display = 'block';
        lightModeIcon.style.display = 'none';
        document.querySelector("html").setAttribute("data-theme", "dark");
    }
    else {
        darkModeIcon.style.display = 'none';
        lightModeIcon.style.display = 'block';
        document.querySelector("html").setAttribute("data-theme", "light");
    }
});

// ALERT BOX
function customAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    alertMessage.textContent = message;
    alertBox.style.display = 'flex';

    alertOkBtn.addEventListener('click', () => {
        alertBox.style.display = 'none';
    });
}