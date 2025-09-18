import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="login-card text-center">
              <Card.Body>
                <h1 className="mb-4">
                  <i className="fas fa-university me-2"></i>
                  Banking System
                </h1>
                <p className="text-muted mb-4">
                  Secure and reliable banking services at your fingertips
                </p>
                
                <Row className="g-3">
                  <Col sm={6}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="d-flex flex-column justify-content-center">
                        <div className="mb-3">
                          <i className="fas fa-user fa-3x text-primary"></i>
                        </div>
                        <h5>Customer Portal</h5>
                        <p className="text-muted small mb-3">
                          Access your account, view transactions, and manage your finances
                        </p>
                        <Link to="/login/customer" className="btn btn-banking w-100">
                          Customer Login
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col sm={6}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="d-flex flex-column justify-content-center">
                        <div className="mb-3">
                          <i className="fas fa-briefcase fa-3x text-success"></i>
                        </div>
                        <h5>Banker Portal</h5>
                        <p className="text-muted small mb-3">
                          Manage customer accounts and oversee banking operations
                        </p>
                        <Link to="/login/banker" className="btn btn-success w-100">
                          Banker Login
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <div className="mt-4 pt-3 border-top">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-1"></i>
                    Your security is our priority. All transactions are encrypted and secure.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
