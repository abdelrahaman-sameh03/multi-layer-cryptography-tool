
// DOM Elements
const plainTextInput = document.getElementById('plainText');
const addLayerBtn = document.getElementById('addLayerBtn');
const removeLayerBtn = document.getElementById('removeLayerBtn');
const layersList = document.getElementById('layersList');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const clearBtn = document.getElementById('clearBtn');
const resultDiv = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');
const layerTemplate = document.getElementById('layerTemplate');

let layerCount = 0;

// Add a new encryption layer to the UI
function addLayer() {
    const layer = layerTemplate.content.cloneNode(true);
    const layerItem = layer.querySelector('.layer-item');
    const layerNumber = layer.querySelector('.layer-number');
    const algorithmSelect = layer.querySelector('.algorithm-select');
    const keyGroup = layer.querySelector('.key-group');
    const removeLayerBtn = layer.querySelector('.remove-layer-btn');

    layerCount++;
    layerNumber.textContent = `Layer ${layerCount}`;
    layerItem.dataset.layerId = layerCount;

    // Toggle key input visibility based on selected algorithm
    algorithmSelect.addEventListener('change', () => {
        const selectedAlgorithm = algorithmSelect.value;
        const keyHelp = keyGroup.querySelector('.key-help');
        const keyList = keyGroup.querySelectorAll('.key-list li');
        
        keyList.forEach(li => li.style.display = 'none');
        
        if (selectedAlgorithm) {
            keyGroup.style.display = 'block';
            keyHelp.style.display = 'block';
            
            switch (selectedAlgorithm) {
                case 'caesar':
                    keyGroup.querySelector('.caesar-key').style.display = 'block';
                    break;
                case 'monoalphabetic':
                    keyGroup.querySelector('.mono-key').style.display = 'block';
                    break;
                case 'vigenere':
                    keyGroup.querySelector('.vigenere-key').style.display = 'block';
                    break;
                case 'railfence':
                    keyGroup.querySelector('.rail-key').style.display = 'block';
                    break;
                case 'rowcolumn':
                    keyGroup.querySelector('.row-key').style.display = 'block';
                    break;
                case 'des':
                    keyGroup.querySelector('.des-key').style.display = 'block';
                    break;
                case 'playfair':
                    keyGroup.querySelector('.playfair-key').style.display = 'block';
                    break;
                default:
                    keyHelp.style.display = 'none';
            }
        } else {
            keyGroup.style.display = 'none';
        }
    });

    // Remove a layer from the UI
    removeLayerBtn.addEventListener('click', () => {
        layerItem.remove();
        layerCount--;
        updateLayerNumbers();
        updateRemoveLayerButton();
    });

    layersList.appendChild(layer);
    updateRemoveLayerButton();
}

// Update the numbering of layers in the UI
function updateLayerNumbers() {
    const layers = layersList.querySelectorAll('.layer-item');
    layers.forEach((layer, index) => {
        layer.querySelector('.layer-number').textContent = `Layer ${index + 1}`;
        layer.dataset.layerId = index + 1;
    });
}

// Enable or disable the remove layer button based on layer count
function updateRemoveLayerButton() {
    removeLayerBtn.disabled = layerCount <= 1;
}

// Clear all layers from a list
function clearLayers() {
    layersList.innerHTML = '';
    layerCount = 0;
    updateRemoveLayerButton();
}

// Process text through all encryption/decryption layers
function processText(text, encrypt = true) {
    const layers = layersList.querySelectorAll('.layer-item');
    let result = text;
    let steps = [];

    const processOrder = encrypt ? layers : Array.from(layers).reverse();

    for (const layer of processOrder) {
        const algorithm = layer.querySelector('.algorithm-select').value;
        const key = layer.querySelector('.key-input').value;

        if (!algorithm) continue;

        switch (algorithm) {
            case 'caesar':
                result = caesarCipher(result, key, encrypt);
                break;
            case 'monoalphabetic':
                result = monoalphabeticCipher(result, key, encrypt);
                break;
            case 'vigenere':
                result = vigenereCipher(result, key, encrypt);
                break;
            case 'railfence':
                result = railFenceCipher(result, key, encrypt);
                break;
            case 'rowcolumn':
                result = rowColumnTransposition(result, key, encrypt);
                break;
            case 'des':
                let desResult = sdesCipher(result, key, encrypt);
                result = desResult.binaryResult;
                steps.push(desResult.steps);
                break;
            case 'playfair':
                result = playfairCipher(result, key, encrypt);
                break;
        }
    }

    return { result, steps: steps.join('\n\n') };
}

// Event listener to add a new layer
addLayerBtn.addEventListener('click', addLayer);

// Event listener to remove the last layer
removeLayerBtn.addEventListener('click', () => {
    const lastLayer = layersList.lastElementChild;
    if (lastLayer) {
        lastLayer.remove();
        layerCount--;
        updateLayerNumbers();
        updateRemoveLayerButton();
    }
});

// Event listener to clear all input and layers
clearBtn.addEventListener('click', () => {
    plainTextInput.value = '';
    resultDiv.textContent = '';
    clearLayers();
});

// Event listener to encrypt text
encryptBtn.addEventListener('click', () => {
    const text = plainTextInput.value;
    if (!text || layerCount === 0) {
        alert('Please enter text and add at least one encryption layer');
        return;
    }

    resultDiv.style.opacity = '0';
    setTimeout(() => {
        const { result, steps } = processText(text, true);
        resultDiv.innerHTML = `<div class="result-text">${result}</div>${steps ? `<div class="steps">${steps}</div>` : ''}`;
        resultDiv.style.opacity = '1';
    }, 200);
});

// Event listener to decrypt text
decryptBtn.addEventListener('click', () => {
    const text = plainTextInput.value;
    if (!text || layerCount === 0) {
        alert('Please enter text and add at least one encryption layer');
        return;
    }

    resultDiv.style.opacity = '0';
    setTimeout(() => {
        const { result, steps } = processText(text, false);
        resultDiv.innerHTML = `<div class="result-text">${result}</div>${steps ? `<div class="steps">${steps}</div>` : ''}`;
        resultDiv.style.opacity = '1';
    }, 200);
});

// Event listener to copy result to clipboard
copyBtn.addEventListener('click', () => {
    const text = resultDiv.textContent;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalColor = copyBtn.style.color;
            copyBtn.style.color = '#00b894';
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.style.color = originalColor;
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
});

// Initialize with one layer
addLayer();

// Implement Caesar Cipher
function caesarCipher(text, key, encrypt = true) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const shift = encrypt ? parseInt(key) : -parseInt(key);
            const base = code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        }
        return char;
    }).join('');
}

// Implement Monoalphabetic Cipher
function monoalphabeticCipher(text, key, encrypt = true) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const keyMap = {};
    
    if (encrypt) {
        for (let i = 0; i < alphabet.length; i++) {
            keyMap[alphabet[i]] = key[i % key.length];
        }
    } else {
        for (let i = 0; i < alphabet.length; i++) {
            keyMap[key[i % key.length]] = alphabet[i];
        }
    }

    return text.toLowerCase().split('').map(char => {
        return keyMap[char] || char;
    }).join('');
}

// Implement Vigenere Cipher
function vigenereCipher(text, key, encrypt = true) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        if (alphabet.includes(char)) {
            const textIndex = alphabet.indexOf(char);
            const keyChar = key[keyIndex % key.length].toLowerCase();
            const keyValue = alphabet.indexOf(keyChar);
            
            let newIndex;
            if (encrypt) {
                newIndex = (textIndex + keyValue) % 26;
            } else {
                newIndex = (textIndex - keyValue + 26) % 26;
            }
            
            result += alphabet[newIndex];
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

// Implement Rail Fence Cipher
function railFenceCipher(text, key, encrypt = true) {
    const rails = parseInt(key);
    if (rails <= 1) return text;

    if (encrypt) {
        const matrix = Array(rails).fill().map(() => []);
        let rail = 0;
        let direction = 1;

        for (let char of text) {
            matrix[rail].push(char);
            rail += direction;
            if (rail === rails - 1 || rail === 0) {
                direction *= -1;
            }
        }

        return matrix.flat().join('');
    } else {
        const matrix = Array(rails).fill().map(() => Array(text.length).fill(''));
        let rail = 0;
        let direction = 1;
        let index = 0;

        // Mark positions in matrix
        for (let i = 0; i < text.length; i++) {
            matrix[rail][i] = '*';
            rail += direction;
            if (rail === rails - 1 || rail === 0) {
                direction *= -1;
            }
        }

        // Fill matrix with characters
        for (let i = 0; i < rails; i++) {
            for (let j = 0; j < text.length; j++) {
                if (matrix[i][j] === '*') {
                    matrix[i][j] = text[index++];
                }
            }
        }

        // Read result from matrix
        let result = '';
        rail = 0;
        direction = 1;
        for (let i = 0; i < text.length; i++) {
            result += matrix[rail][i];
            rail += direction;
            if (rail === rails - 1 || rail === 0) {
                direction *= -1;
            }
        }
        return result;
    }
}

// Implement Row-Column Transposition Cipher
function rowColumnTransposition(text, key, encrypt = true) {
    const keyLength = key.length;
    const textLength = text.length;
    const rows = Math.ceil(textLength / keyLength);
    
    const cleanText = text.replace(/[^a-zA-Z]/g, '');

    if (encrypt) {
        const matrix = Array.from({ length: rows }, () => Array(keyLength).fill(''));
        let index = 0;

        // Fill matrix row-wise
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < keyLength; j++) {
                if (index < cleanText.length) {
                    matrix[i][j] = cleanText[index++];
                } else {
                    matrix[i][j] = '';
                }
            }
        }

        // Determine column order based on key
        const keyOrder = key.split('')
            .map((char, i) => ({ char, index: i }))
            .sort((a, b) => a.char.localeCompare(b.char))
            .map(item => item.index);

        // Read columns based on key order
        let result = '';
        for (let col of keyOrder) {
            for (let row = 0; row < rows; row++) {
                if (matrix[row][col] !== '') {
                    result += matrix[row][col];
                }
            }
        }

        return result;
    } else {
        const matrix = Array.from({ length: rows }, () => Array(keyLength).fill(''));
        
        // Determine column order based on key
        const keyOrder = key.split('')
            .map((char, i) => ({ char, index: i }))
            .sort((a, b) => a.char.localeCompare(b.char))
            .map(item => item.index);

        let index = 0;
        const totalFilled = cleanText.length;

        // Fill matrix column-wise by key order
        for (let colIndex of keyOrder) {
            for (let row = 0; row < rows; row++) {
                if ((row * keyLength + colIndex) < totalFilled && index < cleanText.length) {
                    matrix[row][colIndex] = cleanText[index++];
                }
            }
        }

        // Read matrix row-wise
        let result = '';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < keyLength; j++) {
                if (matrix[i][j] !== '') {
                    result += matrix[i][j];
                }
            }
        }

        return result;
    }
}

// Implement Simplified DES Cipher
function sdesCipher(text, key, encrypt = true) {
    const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
    const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
    const P4 = [2, 4, 3, 1];
    const IP = [2, 6, 3, 1, 4, 8, 5, 7];
    const IP_INV = [4, 1, 3, 5, 7, 2, 8, 6];
    const EP = [4, 1, 2, 3, 2, 3, 4, 1];
    const S0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2]
    ];
    const S1 = [
        [0, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3]
    ];

    // Permute bits according to a table
    function permute(bits, table) {
        return table.map(pos => bits[pos - 1]);
    }

    // Perform a left shift on bits
    function leftShift(bits) {
        return bits.slice(1).concat(bits[0]);
    }

    // Perform XOR operation on two bit arrays
    function xor(a, b) {
        return a.map((bit, i) => bit ^ b[i]);
    }

    // Apply S-box transformation
    function sBox(bits, box) {
        const row = parseInt(`${bits[0]}${bits[3]}`, 2);
        const col = parseInt(`${bits[1]}${bits[2]}`, 2);
        const val = box[row][col];
        return [(val >> 1) & 1, val & 1];
    }

    // Convert binary string to bit array
    function binaryToBits(binary) {
        return binary.replace(/\s/g, '').split('').map(bit => parseInt(bit));
    }

    // Convert bit array to binary string
    function bitsToBinary(bits) {
        return bits.join('');
    }

    // Generate subkeys K1 and K2
    function generateKeys(key) {
        let keyBits = binaryToBits(key);
        let steps = [];

        let p10 = permute(keyBits, P10);
        steps.push(`P10 permutation: ${bitsToBinary(p10)}`);

        let left = p10.slice(0, 5);
        let right = p10.slice(5);
        steps.push(`Split: L=${bitsToBinary(left)}, R=${bitsToBinary(right)}`);

        // Generate K1
        left = leftShift(left);
        right = leftShift(right);
        let k1 = permute(left.concat(right), P8);
        steps.push(`K1: ${bitsToBinary(k1)}`);

        // Generate K2
        left = leftShift(leftShift(left));
        right = leftShift(leftShift(right));
        let k2 = permute(left.concat(right), P8);
        steps.push(`K2: ${bitsToBinary(k2)}`);

        return { k1, k2, steps };
    }

    // Apply function fk
    function fk(L, R, subkey) {
        let ep = permute(R, EP);
        let xored = xor(ep, subkey);
        let left = xored.slice(0, 4);
        let right = xored.slice(4);
        let sboxOut = sBox(left, S0).concat(sBox(right, S1));
        let p4 = permute(sboxOut, P4);
        let result = xor(L, p4);
        return result;
    }

    // Process a single block of data
    function processBlock(block, k1, k2, encrypt) {
        let steps = [];
        let ip = permute(block, IP);
        steps.push(`IP: ${bitsToBinary(ip)}`);

        let L = ip.slice(0, 4);
        let R = ip.slice(4);

        if (!encrypt) [k1, k2] = [k2, k1]; // Swap keys for decryption

        let fk1 = fk(L, R, k1);
        steps.push(`After fk1: L=${bitsToBinary(fk1)}, R=${bitsToBinary(R)}`);

        // Switch L and R
        [L, R] = [R, fk1];
        steps.push(`After SW: L=${bitsToBinary(L)}, R=${bitsToBinary(R)}`);

        let fk2 = fk(L, R, k2);
        let preOutput = fk2.concat(R);
        steps.push(`After fk2: ${bitsToBinary(preOutput)}`);

        let final = permute(preOutput, IP_INV);
        steps.push(`IP⁻¹: ${bitsToBinary(final)}`);

        return { result: final, steps };
    }

    let { k1, k2, steps: keySteps } = generateKeys(key);
    let inputBits = binaryToBits(text);
    let { result, steps } = processBlock(inputBits, k1, k2, encrypt);

    return {
        binaryResult: bitsToBinary(result),
        steps: ["Key Generation:"].concat(keySteps, ["\n" + (encrypt ? "Encryption" : "Decryption") + " Steps:"], steps).join('\n')
    };
}

// Implement Playfair Cipher
function playfairCipher(text, key, encrypt = true) {
    const keySquare = generatePlayfairKeySquare(key);
    text = text.toLowerCase().replace(/[^a-z]/g, '').replace(/j/g, 'i');

    // Split text into digraphs
    const digraphs = [];
    let i = 0;
    while (i < text.length) {
        const a = text[i];
        let b = (i + 1 < text.length) ? text[i + 1] : 'x';

        if (a === b) {
            digraphs.push([a, 'x']);
            i++;
        } else {
            digraphs.push([a, b]);
            i += 2;
        }
    }

    if (digraphs.length > 0 && digraphs[digraphs.length - 1][1] === undefined) {
        digraphs[digraphs.length - 1][1] = 'x';
    }

    // Process each digraph
    let result = digraphs.map(([a, b]) => {
        const pos1 = findPositionInKeySquare(a, keySquare);
        const pos2 = findPositionInKeySquare(b, keySquare);
        let res = '';

        if (pos1.row === pos2.row) {
            res += keySquare[pos1.row][(pos1.col + (encrypt ? 1 : 4)) % 5];
            res += keySquare[pos2.row][(pos2.col + (encrypt ? 1 : 4)) % 5];
        } else if (pos1.col === pos2.col) {
            res += keySquare[(pos1.row + (encrypt ? 1 : 4)) % 5][pos1.col];
            res += keySquare[(pos2.row + (encrypt ? 1 : 4)) % 5][pos2.col];
        } else {
            res += keySquare[pos1.row][pos2.col];
            res += keySquare[pos2.row][pos1.col];
        }

        return res;
    }).join('');

    // Clean up padding 'x' characters during decryption
    if (!encrypt) {
        result = result.replace(/([a-z])x(?=[a-z])/g, (match, p1, offset, str) => {
            const nextChar = str[offset + 2];
            return (p1 === nextChar) ? p1 : match;
        });

        if (result.endsWith('x')) result = result.slice(0, -1);
    }

    return result;
}

// Generate the 5x5 key square for Playfair Cipher
function generatePlayfairKeySquare(key) {
    const keySet = new Set();
    const keySquare = Array.from({ length: 5 }, () => Array(5).fill(''));
    key = key.toLowerCase().replace(/[^a-z]/g, '').replace(/j/g, 'i');

    let row = 0, col = 0;
    for (const char of key) {
        if (!keySet.has(char)) {
            keySquare[row][col] = char;
            keySet.add(char);
            col++;
            if (col === 5) { col = 0; row++; }
        }
    }

    // Fill remaining square with alphabet
    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(97 + i);
        if (char === 'j' || keySet.has(char)) continue;
        keySquare[row][col] = char;
        col++;
        if (col === 5) { col = 0; row++; }
    }

    return keySquare;
}

// Find the position of a character in the Playfair key square
function findPositionInKeySquare(char, keySquare) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (keySquare[row][col] === char) return { row, col };
        }
    }
    return null;
}
