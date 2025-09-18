# 🚀 Quick Start Guide

Get the Banking System running in 5 minutes!

## ⚡ Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- Git

## 🏃‍♂️ Quick Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd banking-system
npm install
cd frontend && npm install && cd ..
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE Bank;
exit
```

### 3. Environment Configuration
Create `.env` file in root:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=Bank
NODE_ENV=development
```

### 4. Start the Application
```bash
# Terminal 1: Start Backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

### 5. Create Demo Data
```bash
# In a new terminal
npm run setup
```

## 🎯 Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Demo Accounts
- **Customer:** customer@demo.com / password123
- **Banker:** banker@demo.com / password123

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
sudo service mysql start  # Linux
brew services start mysql # Mac

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend Build Issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## ✅ Success Checklist

- [ ] MySQL running and `Bank` database created
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Demo users created successfully
- [ ] Can login as customer and banker
- [ ] Transactions working properly

**You're all set! 🎉**
