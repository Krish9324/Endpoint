import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button,
  Alert, 
  Spinner,
  Navbar,
  Nav,
  Badge
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { bankerAPI } from '../services/api';

const CustomerTransactions = () => {
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { customerId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const [detailsRes, transactionsRes] = await Promise.all([
        bankerAPI.getCustomerDetails(customerId),
        bankerAPI.getCustomerTransactions(customerId, 100)
      ]);

      if (detailsRes.data.success) {
        setCustomer(detailsRes.data.data.customer);
        setCustomerStats(detailsRes.data.data.stats);
      }

      if (transactionsRes.data.success) {
        setTransactions(transactionsRes.data.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      if (error.response?.status === 404) {
        setError('Customer not found');
      } else {
        setError('Failed to load customer data');
      }
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
        <p className="mt-2">Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar className="navbar-banking" expand="lg" variant="dark">
          <Container>
            <Navbar.Brand>
              <i className="fas fa-university me-2"></i>
              Banking System
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Container className="py-4">
          <Alert variant="danger">
            <h4>Error</h4>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate('/banker/accounts')}>
              <i className="fas fa-arrow-left me-1"></i>
              Back to Accounts
            </Button>
          </Alert>
        </Container>
      </>
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
              <Nav.Link onClick={() => navigate('/banker/accounts')}>
                <i className="fas fa-users me-1"></i>
                All Customers
              </Nav.Link>
              <Nav.Link active>
                <i className="fas fa-user me-1"></i>
                Customer Details
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Item className="d-flex align-items-center text-white me-3">
                <i className="fas fa-briefcase me-2"></i>
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
        {/* Back Button */}
        <Row className="mb-3">
          <Col>
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/banker/accounts')}
            >
              <i className="fas fa-arrow-left me-1"></i>
              Back to All Customers
            </Button>
          </Col>
        </Row>

        {/* Customer Info */}
        {customer && (
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">
                    <i className="fas fa-user me-2"></i>
                    Customer Information
                  </h4>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Name:</strong>
                        <p className="mb-1">{customer.name}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong>
                        <p className="mb-1">{customer.email}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Customer Since:</strong>
                        <p className="mb-1">{formatDate(customer.created_at)}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      {customerStats && (
                        <>
                          <div className="mb-3">
                            <strong>Current Balance:</strong>
                            <p className={`mb-1 fs-4 fw-bold ${customerStats.current_balance > 0 ? 'text-success' : 'text-muted'}`}>
                              {formatCurrency(customerStats.current_balance)}
                            </p>
                          </div>
                          <div className="mb-3">
                            <strong>Total Transactions:</strong>
                            <p className="mb-1">
                              <Badge bg="info" className="fs-6">
                                {customerStats.total_transactions}
                              </Badge>
                            </p>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Transaction Statistics */}
        {customerStats && (
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-success">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <h4>{formatCurrency(customerStats.total_deposits)}</h4>
                <p className="text-muted mb-0">Total Deposits</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-danger">
                  <i className="fas fa-minus-circle"></i>
                </div>
                <h4>{formatCurrency(customerStats.total_withdrawals)}</h4>
                <p className="text-muted mb-0">Total Withdrawals</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-info">
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <h4>{customerStats.total_transactions}</h4>
                <p className="text-muted mb-0">Total Transactions</p>
              </div>
            </Col>
          </Row>
        )}

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
                    <h5 className="text-muted">No transactions found</h5>
                    <p className="text-muted">This customer hasn't made any transactions yet</p>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Date & Time</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                          <td className="text-muted">{index + 1}</td>
                          <td>{formatDate(transaction.created_at)}</td>
                          <td>
                            <Badge 
                              bg={transaction.transaction_type === 'deposit' ? 'success' : 'danger'}
                              className="px-3 py-2"
                            >
                              <i className={`fas ${transaction.transaction_type === 'deposit' ? 'fa-plus' : 'fa-minus'} me-1`}></i>
                              {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                            </Badge>
                          </td>
                          <td>
                            <span className={`fw-bold ${transaction.transaction_type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                              {transaction.transaction_type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold">
                              {formatCurrency(transaction.balance_after)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
              {transactions.length > 0 && (
                <Card.Footer className="text-muted text-center">
                  <small>
                    Showing {transactions.length} transaction(s) for {customer?.name}
                  </small>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CustomerTransactions;
