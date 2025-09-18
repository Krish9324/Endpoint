# 🏦 Banking System

A full-stack banking application built with Node.js, Express, React, and MySQL. This system provides secure banking operations for customers and administrative features for bankers.

## 🚀 Features

### Customer Features
- **Secure Login** - Token-based authentication
- **Account Dashboard** - View current balance and account overview
- **Transaction History** - Complete history of deposits and withdrawals
- **Deposit Money** - Add funds to account with real-time balance updates
- **Withdraw Money** - Withdraw funds with insufficient funds validation
- **Responsive Design** - Works on desktop and mobile devices

### Banker Features
- **Admin Dashboard** - System-wide statistics and overview
- **Customer Management** - View all customer accounts and balances
- **Transaction Monitoring** - View any customer's transaction history
- **Search Functionality** - Find customers by name or email
- **Real-time Data** - Live updates of customer balances and transactions

### Security Features
- **Password Hashing** - Bcrypt encryption for all passwords
- **JWT-like Tokens** - 36-character alphanumeric access tokens
- **Role-based Access** - Separate customer and banker permissions
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Prepared statements for all queries

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Bootstrap 5** - UI framework
- **Axios** - HTTP client
- **React Bootstrap** - React components for Bootstrap

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd banking-system
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=Bank
NODE_ENV=development
```

#### Database Setup
1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE Bank;
   ```

2. **The application will automatically create the required tables:**
   - `Users` - Stores user accounts (customers and bankers)
   - `Accounts` - Stores transaction records

#### Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🎯 Usage

### First Time Setup

1. **Start both backend and frontend servers**
2. **Create demo accounts** using the registration endpoint:

#### Create Demo Customer Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "customer@demo.com",
    "password": "password123",
    "role": "customer"
  }'
```

#### Create Demo Banker Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "banker@demo.com",
    "password": "password123",
    "role": "banker"
  }'
```

### Access the Application

1. **Homepage:** `http://localhost:3000`
2. **Customer Login:** Use `customer@demo.com` / `password123`
3. **Banker Login:** Use `banker@demo.com` / `password123`

## 📱 Application Flow

### Customer Journey
1. **Login** → Customer dashboard
2. **View Balance** → Current account balance displayed
3. **Make Deposit** → Add funds with confirmation
4. **Make Withdrawal** → Withdraw with balance validation
5. **View History** → Complete transaction history

### Banker Journey
1. **Login** → Banker dashboard with system statistics
2. **View Customers** → List of all customer accounts
3. **Search Customers** → Find specific customers
4. **Customer Details** → View individual customer information
5. **Transaction History** → Monitor customer transactions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Customer Transactions
- `GET /api/transactions/balance` - Get current balance
- `GET /api/transactions/history` - Get transaction history
- `POST /api/transactions/deposit` - Make deposit
- `POST /api/transactions/withdraw` - Make withdrawal
- `GET /api/transactions/stats` - Get transaction statistics

### Banker Operations
- `GET /api/banker/dashboard` - Get system dashboard stats
- `GET /api/banker/customers` - Get all customers
- `GET /api/banker/customers/search?query=term` - Search customers
- `GET /api/banker/customers/:id` - Get customer details
- `GET /api/banker/customers/:id/transactions` - Get customer transactions

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'banker') DEFAULT 'customer',
  access_token VARCHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Accounts Table (Transactions)
```sql
CREATE TABLE Accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_type ENUM('deposit', 'withdraw') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  balance_after DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

## 🔐 Security Considerations

### Authentication
- Passwords are hashed using bcrypt with salt rounds of 12
- Access tokens are 36-character random alphanumeric strings
- Tokens are stored in database and verified on each request

### Authorization
- Role-based middleware protects banker-only endpoints
- Customer data is isolated by user ID
- All database queries use prepared statements

### Input Validation
- Server-side validation for all inputs
- Amount limits for transactions (max deposit: $1M)
- Email format validation
- SQL injection protection

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. **Environment Variables:**
   ```env
   PORT=5000
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=Bank
   NODE_ENV=production
   ```

2. **Build Command:** `npm install`
3. **Start Command:** `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Build the React app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Environment Variables:**
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy the `build` folder**

### Database Deployment

1. **Use a managed MySQL service** (AWS RDS, Google Cloud SQL, PlanetScale)
2. **Update connection settings** in your environment variables
3. **The app will automatically create tables** on first run

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in `.env` file
   - Ensure database `Bank` exists

2. **Frontend Can't Connect to Backend**
   - Verify backend is running on port 5000
   - Check CORS settings in `server.js`
   - Ensure proxy is set in `frontend/package.json`

3. **Authentication Issues**
   - Clear browser localStorage
   - Check token format in API requests
   - Verify user exists in database

### Development Tips

1. **View Database Data:**
   ```sql
   USE Bank;
   SELECT * FROM Users;
   SELECT * FROM Accounts;
   ```

2. **Reset User Token:**
   ```sql
   UPDATE Users SET access_token = NULL WHERE email = 'user@example.com';
   ```

3. **Check Server Logs:**
   - Backend logs appear in terminal
   - Check Network tab in browser dev tools

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check server and browser console logs
4. Create an issue in the repository

---

**Happy Banking! 🏦💰**
