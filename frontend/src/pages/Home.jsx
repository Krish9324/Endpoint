import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <Container fluid className="px-4 position-relative">
        {/* Hero Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={8}>
            <div className={`text-center text-dark mb-5 hero-content ${isLoaded ? 'animate-in' : ''}`}>
              <div className="hero-icon mb-4">
                <i className="fas fa-university"></i>
              </div>
              <h1 className="display-3 fw-bold mb-4 hero-title">
                Modern Banking System
              </h1>
              <p className="lead mb-4 hero-subtitle">
                Experience secure, reliable, and innovative banking services designed for the digital age
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Bank-level Security</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Access</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Mobile Ready</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="justify-content-center">
          <Col lg={12} xl={10}>
            <Card className={`main-card ${isLoaded ? 'animate-in' : ''}`}>
              <Card.Body className="p-5">
                {/* Welcome Section */}
                <Row className="mb-5">
                  <Col xs={12}>
                    <div className="text-center welcome-section">
                      <h2 className="mb-3 text-dark fw-bold">Welcome to the Future of Banking</h2>
                      <p className="text-muted mb-4 fs-5">
                        Join thousands of satisfied customers and bankers who trust our platform
                      </p>
                      <div className="stats-row">
                        <div className="stat-item">
                          <div className="stat-number">10K+</div>
                          <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-number">$50M+</div>
                          <div className="stat-label">Transactions</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-number">99.9%</div>
                          <div className="stat-label">Uptime</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Divider */}
                <div className="text-center mb-5">
                  <div className="divider-line">
                    <span className="divider-text">Choose Your Portal</span>
                  </div>
                </div>

                {/* Login Options */}
                <Row className="g-4 justify-content-center">
                  <Col lg={5} xl={4}>
                    <Card className="portal-card customer-card h-100">
                      <Card.Body className="p-4 text-center">
                        <div className="portal-icon customer-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <h4 className="mb-3 text-dark fw-bold">Customer Portal</h4>
                        <p className="text-muted mb-4">
                          Access your account, view transactions, and manage your finances with ease
                        </p>
                        <div className="features-list mb-4">
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Real-time balance updates</span>
                          </div>
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Complete transaction history</span>
                          </div>
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Secure money transfers</span>
                          </div>
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Mobile-friendly interface</span>
                          </div>
                        </div>
                        <Link 
                          to="/login/customer" 
                          className="btn btn-dark btn-lg portal-btn w-100"
                        >
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Customer Login
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={5} xl={4}>
                    <Card className="portal-card banker-card h-100">
                      <Card.Body className="p-4 text-center">
                        <div className="portal-icon banker-icon">
                          <i className="fas fa-briefcase"></i>
                        </div>
                        <h4 className="mb-3 text-dark fw-bold">Banker Portal</h4>
                        <p className="text-muted mb-4">
                          Manage customer accounts and oversee banking operations with powerful tools
                        </p>
                        <div className="features-list mb-4">
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Customer management</span>
                          </div>
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Analytics dashboard</span>
                          </div>
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Transaction oversight</span>
                          </div>
                          <div className="feature-point">
                            <i className="fas fa-check-circle text-success"></i>
                            <span>Advanced reporting</span>
                          </div>
                        </div>
                        <Link 
                          to="/login/banker" 
                          className="btn btn-dark btn-lg portal-btn w-100"
                        >
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Banker Login
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                {/* Security Notice */}
                <div className="security-section mt-5 pt-4">
                  <div className="security-badges">
                    <div className="security-badge">
                      <i className="fas fa-shield-alt"></i>
                      <span>Bank-level encryption</span>
                    </div>
                    <div className="security-badge">
                      <i className="fas fa-lock"></i>
                      <span>SSL secured</span>
                    </div>
                    <div className="security-badge">
                      <i className="fas fa-certificate"></i>
                      <span>FDIC insured</span>
                    </div>
                    <div className="security-badge">
                      <i className="fas fa-user-shield"></i>
                      <span>Privacy protected</span>
                    </div>
                  </div>
                  <p className="security-text text-center mt-3">
                    Your security and privacy are our top priorities. All transactions are encrypted and monitored 24/7 by our advanced security systems.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-5">
          <Col xs={12}>
            <div className="text-center text-dark footer-content">
              <div className="footer-links mb-3">
                <a href="#privacy" className="footer-link">Privacy Policy</a>
                <a href="#terms" className="footer-link">Terms of Service</a>
                <a href="#contact" className="footer-link">Contact Us</a>
                <a href="#support" className="footer-link">Support</a>
              </div>
              <small className="footer-copyright">
                © 2024 Modern Banking System. All rights reserved. | Built with ❤️ for secure banking
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
