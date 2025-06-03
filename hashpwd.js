const bcrypt = require('bcryptjs');

async function run() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);
}

run();