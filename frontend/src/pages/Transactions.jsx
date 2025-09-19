import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Modal, 
  Form, 
  Alert, 
  Spinner,
  Navbar,
  Nav
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';

const Transactions = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        transactionAPI.getBalance(),
        transactionAPI.getHistory(50)
      ]);

      if (balanceRes.data.success) {
        setBalance(balanceRes.data.data.balance);
      }

      if (transactionsRes.data.success) {
        setTransactions(transactionsRes.data.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const handleTransaction = async (type) => {
    setTransactionLoading(true);
    setTransactionError('');
    
    const amount = parseFloat(transactionAmount);
    
    if (!amount || amount <= 0) {
      setTransactionError('Please enter a valid amount');
      setTransactionLoading(false);
      return;
    }

    if (type === 'withdraw' && amount > balance) {
      setTransactionError('Insufficient funds');
      setTransactionLoading(false);
      return;
    }

    try {
      const response = type === 'deposit' 
        ? await transactionAPI.deposit(amount)
        : await transactionAPI.withdraw(amount);

      if (response.data.success) {
        setSuccess(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
        setTransactionAmount('');
        setShowDepositModal(false);
        setShowWithdrawModal(false);

        // Optimistically update UI with response transaction
        const tx = response.data?.data?.transaction;
        if (tx) {
          setBalance(tx.balance_after);
          setTransactions(prev => [
            {
              id: tx.id,
              user_id: user?.id,
              transaction_type: tx.type,
              amount: tx.amount,
              balance_after: tx.balance_after,
              created_at: tx.created_at
            },
            ...prev
          ]);
        }

        // Also refetch from server to ensure consistency
        await fetchData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setTransactionError(response.data.message);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setTransactionError(
        error.response?.data?.message || 'Transaction failed. Please try again.'
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your account...</p>
      </div>
    );
  }

  return (
    <>
      {/* Navigation */}
      <Navbar className="navbar-banking" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand>
            <i className="fas fa-university me-2"></i>
            Banking System
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link active>
                <i className="fas fa-credit-card me-1"></i>
                Transactions
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Item className="d-flex align-items-center text-white me-3">
                <i className="fas fa-user me-2"></i>
                Welcome, {user?.name}
              </Nav.Item>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Balance Display */}
        <Row className="mb-4">
          <Col>
            <div className="balance-display">
              <h2 className="mb-1">Current Balance</h2>
              <h1 className="mb-0">{formatCurrency(balance)}</h1>
            </div>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Col sm={6} className="mb-2">
            <Button 
              className="btn-deposit w-100"
              size="lg"
              onClick={() => setShowDepositModal(true)}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Deposit Money
            </Button>
          </Col>
          <Col sm={6} className="mb-2">
            <Button 
              className="btn-withdraw w-100"
              size="lg"
              onClick={() => setShowWithdrawModal(true)}
            >
              <i className="fas fa-minus-circle me-2"></i>
              Withdraw Money
            </Button>
          </Col>
        </Row>

        {/* Transaction History */}
        <Row>
          <Col>
            <Card className="table-banking">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-history me-2"></i>
                  Transaction History
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {transactions.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No transactions yet</h5>
                    <p className="text-muted">Your transaction history will appear here</p>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{formatDate(transaction.created_at)}</td>
                          <td>
                            <span className={`badge ${transaction.transaction_type === 'deposit' ? 'bg-success' : 'bg-danger'}`}>
                              <i className={`fas ${transaction.transaction_type === 'deposit' ? 'fa-plus' : 'fa-minus'} me-1`}></i>
                              {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                            </span>
                          </td>
                          <td className={transaction.transaction_type === 'deposit' ? 'text-success' : 'text-danger'}>
                            {transaction.transaction_type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </td>
                          <td className="fw-bold">{formatCurrency(transaction.balance_after)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Deposit Modal */}
      <Modal 
        show={showDepositModal} 
        onHide={() => !transactionLoading && setShowDepositModal(false)}
        className="modal-banking"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus-circle me-2"></i>
            Deposit Money
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <h5>Current Balance: {formatCurrency(balance)}</h5>
          </div>
          
          {transactionError && (
            <Alert variant="danger">{transactionError}</Alert>
          )}
          
          <Form>
            <Form.Group>
              <Form.Label>Deposit Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                max="1000000"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="Enter amount to deposit"
                disabled={transactionLoading}
              />
              <Form.Text className="text-muted">
                Maximum deposit: $1,000,000
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDepositModal(false)}
            disabled={transactionLoading}
          >
            Cancel
          </Button>
          <Button 
            className="btn-deposit"
            onClick={() => handleTransaction('deposit')}
            disabled={transactionLoading || !transactionAmount}
          >
            {transactionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Deposit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Withdraw Modal */}
      <Modal 
        show={showWithdrawModal} 
        onHide={() => !transactionLoading && setShowWithdrawModal(false)}
        className="modal-banking"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-minus-circle me-2"></i>
            Withdraw Money
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <h5>Current Balance: {formatCurrency(balance)}</h5>
          </div>
          
          {transactionError && (
            <Alert variant="danger">{transactionError}</Alert>
          )}
          
          <Form>
            <Form.Group>
              <Form.Label>Withdrawal Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                max={balance}
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                disabled={transactionLoading}
              />
              <Form.Text className="text-muted">
                Available balance: {formatCurrency(balance)}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowWithdrawModal(false)}
            disabled={transactionLoading}
          >
            Cancel
          </Button>
          <Button 
            className="btn-withdraw"
            onClick={() => handleTransaction('withdraw')}
            disabled={transactionLoading || !transactionAmount}
          >
            {transactionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-minus me-2"></i>
                Withdraw
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Transactions;
