import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="home-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <Container fluid className="px-4">
        {/* Hero Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={8}>
            <div className="text-center text-white mb-5">
              <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                <i className="fas fa-university me-3"></i>
                Modern Banking System
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                Experience secure, reliable, and innovative banking services designed for the digital age
              </p>
              <div className="d-flex justify-content-center gap-4 mb-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-shield-alt me-2"></i>
                  <span>Bank-level Security</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-clock me-2"></i>
                  <span>24/7 Access</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="justify-content-center">
          <Col lg={12} xl={10}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <Card.Body className="p-4">
                {/* Signup CTA */}
                <Row className="mb-4">
                  <Col xs={12}>
                    <div className="text-center">
                      <h3 className="mb-3 text-primary">Get Started Today</h3>
                      <p className="text-muted mb-3">Join thousands of satisfied customers and bankers</p>
                      <Link 
                        to="/signup" 
                        className="btn btn-primary btn-lg px-4 py-2" 
                        style={{
                          borderRadius: '50px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        Create Your Account
                      </Link>
                    </div>
                  </Col>
                </Row>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center">
                    <hr className="flex-grow-1" />
                    <span className="px-3 text-muted">or</span>
                    <hr className="flex-grow-1" />
                  </div>
                </div>

                {/* Login Options */}
                <Row className="g-3 justify-content-center">
                  <Col lg={5} xl={4}>
                    <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                      <Card.Body className="p-3 text-center">
                        <div className="mb-3">
                          <div 
                            className="mx-auto d-flex align-items-center justify-content-center"
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #007bff, #0056b3)',
                              color: 'white',
                              fontSize: '1.8rem'
                            }}
                          >
                            <i className="fas fa-user"></i>
                          </div>
                        </div>
                        <h5 className="mb-2 text-primary">Customer Portal</h5>
                        <p className="text-muted mb-3 small" style={{ lineHeight: '1.5' }}>
                          Access your account, view transactions, and manage your finances
                        </p>
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">
                            <i className="fas fa-check text-success me-1"></i>
                            Real-time balance updates
                          </small>
                          <small className="text-muted d-block mb-1">
                            <i className="fas fa-check text-success me-1"></i>
                            Transaction history
                          </small>
                          <small className="text-muted d-block">
                            <i className="fas fa-check text-success me-1"></i>
                            Secure transfers
                          </small>
                        </div>
                        <Link 
                          to="/login/customer" 
                          className="btn btn-primary w-100 py-2"
                          style={{ borderRadius: '25px', fontWeight: '500' }}
                        >
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Customer Login
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={5} xl={4}>
                    <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                      <Card.Body className="p-3 text-center">
                        <div className="mb-3">
                          <div 
                            className="mx-auto d-flex align-items-center justify-content-center"
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #28a745, #1e7e34)',
                              color: 'white',
                              fontSize: '1.8rem'
                            }}
                          >
                            <i className="fas fa-briefcase"></i>
                          </div>
                        </div>
                        <h5 className="mb-2 text-success">Banker Portal</h5>
                        <p className="text-muted mb-3 small" style={{ lineHeight: '1.5' }}>
                          Manage customer accounts and oversee banking operations
                        </p>
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">
                            <i className="fas fa-check text-success me-1"></i>
                            Customer management
                          </small>
                          <small className="text-muted d-block mb-1">
                            <i className="fas fa-check text-success me-1"></i>
                            Analytics dashboard
                          </small>
                          <small className="text-muted d-block">
                            <i className="fas fa-check text-success me-1"></i>
                            Transaction oversight
                          </small>
                        </div>
                        <Link 
                          to="/login/banker" 
                          className="btn btn-success w-100 py-2"
                          style={{ borderRadius: '25px', fontWeight: '500' }}
                        >
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Banker Login
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                {/* Security Notice */}
                <div className="mt-4 pt-3 border-top text-center">
                  <div className="d-flex justify-content-center align-items-center text-muted">
                    <i className="fas fa-shield-alt me-2 text-success"></i>
                    <span className="me-3">Bank-level encryption</span>
                    <i className="fas fa-lock me-2 text-success"></i>
                    <span className="me-3">SSL secured</span>
                    <i className="fas fa-certificate me-2 text-success"></i>
                    <span>FDIC insured</span>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Your security and privacy are our top priorities. All transactions are encrypted and monitored 24/7.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-5">
          <Col xs={12}>
            <div className="text-center text-white">
              <small style={{ opacity: 0.8 }}>
                © 2024 Modern Banking System. All rights reserved.
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
