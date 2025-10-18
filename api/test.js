import bcrypt from 'bcrypt';

// Function to generate hash
const generateHash = async (plainText) => {
  try {
    const saltRounds = 10; // Number of salt rounds (adjustable)
    const hash = await bcrypt.hash(plainText, saltRounds);
    return hash;
  } catch (error) {
    console.error("Error generating hash:", error);
  }
};

// Example usage
(async () => {
  const password = "benmega";
  const hashedPassword = await generateHash(password);
  console.log("Hashed value:", hashedPassword);
})();
