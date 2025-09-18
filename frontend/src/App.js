import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import LoginCustomer from './pages/LoginCustomer';
import LoginBanker from './pages/LoginBanker';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import CustomerTransactions from './pages/CustomerTransactions';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Home/Landing Page */}
            <Route path="/" element={<Home />} />
            
            {/* Login Routes */}
            <Route path="/login/customer" element={<LoginCustomer />} />
            <Route path="/login/banker" element={<LoginBanker />} />
            
            {/* Customer Routes */}
            <Route 
              path="/customer/transactions" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <Transactions />
                </ProtectedRoute>
              } 
            />
            
            {/* Banker Routes */}
            <Route 
              path="/banker/accounts" 
              element={
                <ProtectedRoute requiredRole="banker">
                  <Accounts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/banker/customer/:customerId" 
              element={
                <ProtectedRoute requiredRole="banker">
                  <CustomerTransactions />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
