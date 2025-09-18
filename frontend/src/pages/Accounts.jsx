import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button,
  Form,
  Alert, 
  Spinner,
  Navbar,
  Nav,
  InputGroup
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { bankerAPI } from '../services/api';

const Accounts = () => {
  const [customers, setCustomers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersRes, dashboardRes] = await Promise.all([
        bankerAPI.getAllCustomers(),
        bankerAPI.getDashboard()
      ]);

      if (customersRes.data.success) {
        setCustomers(customersRes.data.data.customers);
      }

      if (dashboardRes.data.success) {
        setDashboardStats(dashboardRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await bankerAPI.searchCustomers(query.trim());
      if (response.data.success) {
        setSearchResults(response.data.data.customers);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
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

  const viewCustomerTransactions = (customerId) => {
    navigate(`/banker/customer/${customerId}`);
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
      day: 'numeric'
    });
  };

  const displayCustomers = searchQuery.length >= 2 ? searchResults : customers;

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading customer accounts...</p>
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
                <i className="fas fa-users me-1"></i>
                Customer Accounts
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
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Dashboard Stats */}
        {dashboardStats && (
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-primary">
                  <i className="fas fa-users"></i>
                </div>
                <h3>{dashboardStats.overview.total_customers}</h3>
                <p className="text-muted mb-0">Total Customers</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-success">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <h3>{formatCurrency(dashboardStats.overview.total_system_balance)}</h3>
                <p className="text-muted mb-0">System Balance</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-info">
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <h3>{dashboardStats.overview.total_transactions}</h3>
                <p className="text-muted mb-0">Total Transactions</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <div className="stats-icon text-warning">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>{formatCurrency(dashboardStats.overview.average_balance)}</h3>
                <p className="text-muted mb-0">Average Balance</p>
              </div>
            </Col>
          </Row>
        )}

        {/* Search */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searching && (
                <InputGroup.Text>
                  <Spinner size="sm" />
                </InputGroup.Text>
              )}
            </InputGroup>
            {searchQuery.length >= 2 && (
              <small className="text-muted">
                Found {searchResults.length} customer(s)
              </small>
            )}
          </Col>
        </Row>

        {/* Customer List */}
        <Row>
          <Col>
            <Card className="table-banking">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-users me-2"></i>
                  {searchQuery.length >= 2 ? 'Search Results' : 'All Customers'}
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {displayCustomers.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">
                      {searchQuery.length >= 2 ? 'No customers found' : 'No customers yet'}
                    </h5>
                    <p className="text-muted">
                      {searchQuery.length >= 2 
                        ? 'Try a different search term' 
                        : 'Customer accounts will appear here when they register'
                      }
                    </p>
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Current Balance</th>
                        <th>Transactions</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
                                <i className="fas fa-user"></i>
                              </div>
                              <div>
                                <strong>{customer.name}</strong>
                              </div>
                            </div>
                          </td>
                          <td>{customer.email}</td>
                          <td>
                            <span className={`fw-bold ${customer.current_balance > 0 ? 'text-success' : 'text-muted'}`}>
                              {formatCurrency(customer.current_balance)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {customer.transaction_count || 0}
                            </span>
                          </td>
                          <td>{formatDate(customer.user_created_at)}</td>
                          <td>
                            <Button
                              size="sm"
                              className="btn-banking"
                              onClick={() => viewCustomerTransactions(customer.id)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Top Customers */}
        {dashboardStats && dashboardStats.top_customers && dashboardStats.top_customers.length > 0 && (
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-trophy me-2"></i>
                    Top Customers by Balance
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {dashboardStats.top_customers.slice(0, 5).map((customer, index) => (
                      <Col md={6} lg={4} key={customer.id} className="mb-3">
                        <div className="customer-card p-3">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '30px', height: '30px', fontSize: '0.8rem'}}>
                              #{index + 1}
                            </div>
                            <strong>{customer.name}</strong>
                          </div>
                          <p className="text-muted mb-1 small">{customer.email}</p>
                          <p className="text-success fw-bold mb-0">
                            {formatCurrency(customer.current_balance)}
                          </p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Accounts;
