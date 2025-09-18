const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const demoUsers = [
  {
    name: 'John Doe',
    email: 'customer@demo.com',
    password: 'password123',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'banker@demo.com',
    password: 'password123',
    role: 'banker'
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'customer'
  },
  {
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'customer'
  }
];

async function createDemoUsers() {
  console.log('🚀 Creating demo users...\n');

  for (const user of demoUsers) {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, user);
      
      if (response.data.success) {
        console.log(`✅ Created ${user.role}: ${user.name} (${user.email})`);
      } else {
        console.log(`❌ Failed to create ${user.name}: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  User already exists: ${user.name} (${user.email})`);
      } else {
        console.log(`❌ Error creating ${user.name}:`, error.response?.data?.message || error.message);
      }
    }
  }

  console.log('\n🎯 Demo users setup complete!');
  console.log('\n📋 Login credentials:');
  console.log('Customer: customer@demo.com / password123');
  console.log('Banker: banker@demo.com / password123');
  console.log('\n🌐 Access the app at: http://localhost:3000');
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

  await createDemoUsers();
}

main().catch(console.error);
