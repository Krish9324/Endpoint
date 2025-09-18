const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Demo transactions to create realistic data
const demoTransactions = [
  { email: 'customer@demo.com', password: 'password123', transactions: [
    { type: 'deposit', amount: 1000 },
    { type: 'deposit', amount: 500 },
    { type: 'withdraw', amount: 200 },
    { type: 'deposit', amount: 750 },
    { type: 'withdraw', amount: 100 }
  ]},
  { email: 'alice@example.com', password: 'password123', transactions: [
    { type: 'deposit', amount: 2000 },
    { type: 'withdraw', amount: 300 },
    { type: 'deposit', amount: 1200 },
    { type: 'withdraw', amount: 500 }
  ]},
  { email: 'bob@example.com', password: 'password123', transactions: [
    { type: 'deposit', amount: 800 },
    { type: 'deposit', amount: 400 },
    { type: 'withdraw', amount: 150 }
  ]}
];

async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
      role: 'customer'
    });
    
    if (response.data.success) {
      return response.data.data.access_token;
    }
    return null;
  } catch (error) {
    console.log(`❌ Login failed for ${email}:`, error.response?.data?.message);
    return null;
  }
}

async function makeTransaction(token, type, amount) {
  try {
    const response = await axios.post(
      `${API_BASE}/transactions/${type}`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data.success;
  } catch (error) {
    console.log(`❌ ${type} failed:`, error.response?.data?.message);
    return false;
  }
}

async function createDemoTransactions() {
  console.log('💰 Creating demo transactions...\n');

  for (const user of demoTransactions) {
    console.log(`Processing transactions for ${user.email}...`);
    
    // Login user
    const token = await loginUser(user.email, user.password);
    if (!token) {
      console.log(`⚠️  Skipping ${user.email} - login failed\n`);
      continue;
    }

    // Process transactions
    for (const transaction of user.transactions) {
      const success = await makeTransaction(token, transaction.type, transaction.amount);
      if (success) {
        console.log(`  ✅ ${transaction.type}: $${transaction.amount}`);
      } else {
        console.log(`  ❌ Failed ${transaction.type}: $${transaction.amount}`);
      }
      
      // Small delay between transactions
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('');
  }

  console.log('🎯 Demo transactions complete!');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${API_BASE.replace('/api', '')}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Backend server is not running!');
    console.log('Please start the server first: npm run dev');
    process.exit(1);
  }

  await createDemoTransactions();
}

main().catch(console.error);
