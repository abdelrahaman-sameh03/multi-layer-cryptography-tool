# 🔐 Web-Based Multi-Layer Encryption & Decryption Tool

This is a web-based cryptography tool developed as part of an academic course project. It allows users to **encrypt and decrypt text using multiple classical cryptographic algorithms**, stacked in any desired order. The tool is fully interactive, responsive, and built with HTML, CSS, and JavaScript — no backend required.

---

## 📌 Features

- 🧩 **Multi-layer encryption and decryption**
- 🔐 Supports the following classical algorithms:
  - Caesar Cipher
  - Monoalphabetic Cipher
  - Vigenère Cipher
  - Playfair Cipher
  - Rail Fence Cipher
  - Row Column Transposition
  - Simplified DES (with binary-level steps)
- 🔑 Custom key input for each layer
- 🔁 Encryption order is preserved and fully reversible
- 📋 Copy-to-clipboard functionality
- 💡 Responsive neon-themed UI
- 🚫 No backend or external logic libraries — all in vanilla JavaScript

---


## 📂 Project Structure

├── index.html # Main HTML layout

├── styles.css # UI styling and animations

├── script.js # Cipher logic and interactivity


---

## 💻 Technologies Used

- HTML5
- CSS3 (with custom animations and layout)
- JavaScript (Vanilla)

---

## 🧠 How It Works

1. Input your plaintext (or ciphertext).
2. Click **Add Layer** to stack one or more ciphers.
3. Choose a cipher and input a valid key.
4. Click **Encrypt** or **Decrypt** to process.
5. View and copy the result instantly.

---

## 🧪 Algorithms Included

| Cipher                  | Key Format                      | Description                                 |
|-------------------------|----------------------------------|---------------------------------------------|
| Caesar Cipher           | Number (1–25)                   | Classic shift cipher                        |
| Monoalphabetic Cipher   | 26-letter substitution string   | Fixed permutation of alphabet               |
| Vigenère Cipher         | Word or phrase                  | Repeating keyword cipher                    |
| Playfair Cipher         | Keyword (letters only)          | 5x5 grid, 'j' replaced with 'i'             |
| Rail Fence Cipher       | Number ≥ 2                      | Zigzag transposition                        |
| Row Column Transposition| Word (column ordering key)      | Matrix-based rearrangement                  |
| Simplified DES (SDES)   | 2 ASCII chars (10-bit binary key) | Full binary steps shown                     |


