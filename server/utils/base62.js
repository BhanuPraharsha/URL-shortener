const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = characters.length; // 62

// Encodes a unique ID (number) to a Base62 string
const encode = (num) => {
  let encoded = '';
  if (num === 0) return characters[0];
  while (num > 0) {
    const val = num % base;
    encoded = characters[val] + encoded;
    num = Math.floor(num / base);
  }
  return encoded;
};

// Decodes a Base62 string back to a number (if needed later)
const decode = (str) => {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    const val = characters.indexOf(str[i]);
    decoded = decoded * base + val;
  }
  return decoded;
};

module.exports = { encode, decode };