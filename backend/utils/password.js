const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the number of salt rounds as needed

// Hashing a password
async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    console.log('Hashed password:', hash);
    return hash; // Store this hash in the database
  } catch (error) {
    console.error(error);
  }
}

// Verifying a password
async function verifyPassword(plainPassword, hash) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hash);
    console.log('Do the passwords match?', isMatch);
    return isMatch;
  } catch (error) {
    console.error(error);
  }
}

// Example usage
const plainPassword = 'your_password_here';
hashPassword(plainPassword).then((hash) => {
  // Verify the hashed password later on
  verifyPassword(plainPassword, hash).then((isMatch) => {
    console.log('Password verification result:', isMatch);
  });
});

module.exports = {hashPassword,verifyPassword}