const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = characters.length;

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

const decode = (str) => {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    const val = characters.indexOf(str[i]);
    decoded = decoded * base + val;
  }
  return decoded;
};

module.exports = { encode, decode };