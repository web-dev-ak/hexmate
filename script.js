let lengthOfHex = 6;
let colorPreviewBox = document.getElementById('color-preview-box');
let generateBtn = document.getElementById('gen-btn');
let hexValueDisplay = document.getElementById('hex-code');
let rgbValueDisplay = document.getElementById('rgb-code');
let colorNameText = document.getElementById('color-name');

let hexCodeSearchBtn = document.getElementById('hex-code-search-btn');
let rgbCodeSearchBtn = document.getElementById('rgb-code-search-btn');

// UPDATE IN UI
generateBtn.addEventListener('click', async () => {
    let hex = hexCodeGenerator(lengthOfHex);
    let rgb = hexToRgb(hex);
    let [R, G, B] = rgb.split(', ').map(Number);
    let colorName = await getColorName(hex);
    
    colorPreviewBox.style.backgroundColor = `#${hex}`;
    hexValueDisplay.value = `#${hex}`;
    rgbValueDisplay.value = `${rgb}`;
    colorNameText.textContent = `${colorName}`;

    if (getBrightness(R, G, B) > 128) {
        colorNameText.style.color = "rgba(0,0,0,0.5)"; 
    } else {
        colorNameText.style.color = "rgba(255,255,255,0.5)";
    }
});

hexCodeSearchBtn.addEventListener('click', async () => {
    let hex = hexValueDisplay.value.replace('#', '').toUpperCase();

    if (!isValidHex(hex)) {
        customAlert('Invalid Hex Code. Please enter a valid hex value (e.g., #FFFFFF).');
        return;
    }

    let rgb = hexToRgb(hex);
    let [R, G, B] = rgb.split(', ').map(Number);
    let colorName = await getColorName(hex);

    colorPreviewBox.style.backgroundColor = `#${hex}`;
    hexValueDisplay.value = `#${hex}`;
    rgbValueDisplay.value = `${rgb}`;
    colorNameText.textContent = `${colorName}`;

    if (getBrightness(R, G, B) > 128) {
        colorNameText.style.color = "rgba(0,0,0,0.5)";
    } else {
        colorNameText.style.color = "rgba(255,255,255,0.5)";
    }
});

rgbCodeSearchBtn.addEventListener('click', async () => {
    let rgb = rgbValueDisplay.value.trim();

    if (!isValidRgb(rgb)) {
        customAlert('Invalid RGB Code. Please enter a valid RGB value (e.g., 255, 255, 255).');
        return;
    }

    let [R, G, B] = rgb.replace(/\s+/g, '').split(',').map(Number);
    let hex = rgbToHex(R, G, B);
    let colorName = await getColorName(hex);

    colorPreviewBox.style.backgroundColor = `#${hex}`;
    hexValueDisplay.value = `#${hex}`;
    rgbValueDisplay.value = `${R}, ${G}, ${B}`;
    colorNameText.textContent = `${colorName}`;

    if (getBrightness(R, G, B) > 128) {
        colorNameText.style.color = "rgba(0,0,0,0.5)";
    } else {
        colorNameText.style.color = "rgba(255,255,255,0.5)";
    }
});

// HEX CODE VALIDATION
function isValidHex(hex) {
    return /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}

// RGB CODE VALIDATION
function isValidRgb(rgb) {
    const rgbRegex = /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/; // Matches "255, 255, 255" or "255,255,255"
    const match = rgb.trim().replace(/\s+/g, '').match(/^(\d{1,3}),(\d{1,3}),(\d{1,3})$/);
    if (!match) return false;

    return match.slice(1, 4).every(value => Number(value) >= 0 && Number(value) <= 255);
}


// HEX TO RGB CONVERTER
function hexToRgb(hex) {
    let R = parseInt(hex.substring(0, 2), 16);
    let G = parseInt(hex.substring(2, 4), 16);
    let B = parseInt(hex.substring(4, 6), 16);

    return `${R}, ${G}, ${B}`;
}

// RGB TO HEX CONVERTER
function rgbToHex(r, g, b) {
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    let hex = r.toString(16).padStart(2, '0') + 
            g.toString(16).padStart(2, '0') + 
            b.toString(16).padStart(2, '0');
    
    return hex.toUpperCase();
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
let hexCodeCopyBtn = document.getElementById('hex-code-copy-btn');
let rgbCodeCopyBtn = document.getElementById('rgb-code-copy-btn');

hexCodeCopyBtn.addEventListener('click', () => {
    const hexCode = hexValueDisplay.value;
    navigator.clipboard.writeText(hexCode).then(() => {
        customAlert(`${hexCode} is copied to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

rgbCodeCopyBtn.addEventListener('click', () => {
    const rgbCode = rgbValueDisplay.value;
    navigator.clipboard.writeText(rgbCode).then(() => {
        customAlert(`${rgbCode} is copied to clipboard`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

// SHORTCUT KEY MAPPING
document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
        generateBtn.click();
        e.preventDefault();
    }
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
        localStorage.setItem('data-theme', 'dark');
    }
    else {
        darkModeIcon.style.display = 'none';
        lightModeIcon.style.display = 'block';
        document.querySelector("html").setAttribute("data-theme", "light");
        localStorage.setItem('data-theme', 'light');
    }
});

window.onload = function() {
    const savedTheme = localStorage.getItem('data-theme');

    if (savedTheme) {
        document.querySelector("html").setAttribute("data-theme", savedTheme);
        if (savedTheme === "dark") {
            darkModeIcon.style.display = 'block';
            lightModeIcon.style.display = 'none';
        } else {
            darkModeIcon.style.display = 'none';
            lightModeIcon.style.display = 'block';
        }
    }
};


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