import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup
} from 'react-bootstrap';
import { authAPI } from '../services/api';

const Signup = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    // Basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email';
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    if (!['customer', 'banker'].includes(role)) return 'Invalid role selected';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setSubmitting(true);
      const res = await authAPI.register(name.trim(), email.trim(), password, role);
      if (res.data?.success) {
        setSuccess('Account created successfully! You can now log in.');
        setTimeout(() => {
          navigate(role === 'customer' ? '/login/customer' : '/login/banker');
        }, 1200);
      } else {
        setError(res.data?.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={7}>
            <Card className="login-card border-0 shadow">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="mb-2">
                    <i className="fas fa-university me-2"></i>
                    Create Your Account
                  </h1>
                  <p className="text-muted mb-0">Join our secure and modern banking platform</p>
                </div>

                {error && (
                  <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Label>Registering as</Form.Label>
                      <div className="d-flex gap-2">
                        <Button
                          type="button"
                          variant={role === 'customer' ? 'primary' : 'outline-primary'}
                          onClick={() => setRole('customer')}
                        >
                          <i className="fas fa-user me-2"></i>
                          Customer
                        </Button>
                        <Button
                          type="button"
                          variant={role === 'banker' ? 'success' : 'outline-success'}
                          onClick={() => setRole('banker')}
                        >
                          <i className="fas fa-briefcase me-2"></i>
                          Banker
                        </Button>
                      </div>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="fas fa-user"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="fas fa-envelope"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitting}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="fas fa-lock"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="fas fa-check"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={submitting}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="pt-2">
                      <Button
                        className="btn-banking w-100"
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Creating account...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus me-2"></i>
                            Create Account
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Already have an account?{' '}
                    {role === 'banker' ? (
                      <Link to="/login/banker">Log in as Banker</Link>
                    ) : (
                      <Link to="/login/customer">Log in as Customer</Link>
                    )}
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

export default Signup;


