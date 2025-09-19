import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
  ProgressBar
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

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

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'danger';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="signup-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <Container fluid className="px-4 position-relative">
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col lg={10} xl={8}>
            <Card className={`signup-card ${isLoaded ? 'animate-in' : ''}`}>
              <Card.Body className="p-5">
                {/* Header Section */}
                <div className="text-center mb-5">
                  <div className="signup-icon mb-4">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h1 className="signup-title mb-3">Create Your Account</h1>
                  <p className="signup-subtitle">Join our secure and modern banking platform</p>
                </div>

                {error && (
                  <Alert variant="danger" onClose={() => setError('')} dismissible className="mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" onClose={() => setSuccess('')} dismissible className="mb-4">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Role Selection */}
                  <div className="role-selection mb-5">
                    <h5 className="form-section-title mb-3">Choose Your Role</h5>
                    <div className="role-buttons">
                      <Button
                        type="button"
                        className={`role-btn ${role === 'customer' ? 'active' : ''}`}
                        onClick={() => setRole('customer')}
                      >
                        <div className="role-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="role-content">
                          <h6>Customer</h6>
                          <small>Personal banking services</small>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        className={`role-btn ${role === 'banker' ? 'active' : ''}`}
                        onClick={() => setRole('banker')}
                      >
                        <div className="role-icon">
                          <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="role-content">
                          <h6>Banker</h6>
                          <small>Banking administration</small>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <Row className="g-4">

                    <Col md={6}>
                      <Form.Group className="form-group-modern">
                        <Form.Label className="form-label-modern">
                          <i className="fas fa-user me-2"></i>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={submitting}
                          className="form-control-modern"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="form-group-modern">
                        <Form.Label className="form-label-modern">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={submitting}
                          className="form-control-modern"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="form-group-modern">
                        <Form.Label className="form-label-modern">
                          <i className="fas fa-lock me-2"></i>
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={submitting}
                          className="form-control-modern"
                        />
                        {password && (
                          <div className="password-strength mt-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="text-muted">Password Strength</small>
                              <small className={`text-${getPasswordStrengthColor()}`}>
                                {getPasswordStrengthText()}
                              </small>
                            </div>
                            <ProgressBar
                              now={passwordStrength}
                              variant={getPasswordStrengthColor()}
                              className="password-progress"
                            />
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="form-group-modern">
                        <Form.Label className="form-label-modern">
                          <i className="fas fa-check me-2"></i>
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={submitting}
                          className="form-control-modern"
                        />
                        {confirmPassword && password && (
                          <div className="mt-2">
                            {confirmPassword === password ? (
                              <small className="text-success">
                                <i className="fas fa-check-circle me-1"></i>
                                Passwords match
                              </small>
                            ) : (
                              <small className="text-danger">
                                <i className="fas fa-times-circle me-1"></i>
                                Passwords don't match
                              </small>
                            )}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12} className="pt-3">
                      <Button
                        className="signup-submit-btn w-100"
                        type="submit"
                        disabled={submitting}
                        size="lg"
                      >
                        {submitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Creating your account...
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

                {/* Footer Links */}
                <div className="signup-footer mt-5 pt-4 border-top">
                  <div className="row g-3">
                    <div className="col-md-6 text-center text-md-start">
                      <small className="text-muted">
                        Already have an account?{' '}
                        {role === 'banker' ? (
                          <Link to="/login/banker" className="signup-link">Log in as Banker</Link>
                        ) : (
                          <Link to="/login/customer" className="signup-link">Log in as Customer</Link>
                        )}
                      </small>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                      <Link to="/" className="signup-back-link">
                        <i className="fas fa-arrow-left me-1"></i>
                        Back to Home
                      </Link>
                    </div>
                  </div>
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


