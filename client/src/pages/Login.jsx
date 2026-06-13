import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check query params for expired token alert
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  useEffect(() => {
    // If user is already logged in, redirect them to dashboard
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await login(values.email, values.password);
      message.success('Welcome back!');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card fade-in-el">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 48 }}>🎙️</span>
          <Title level={2} style={{ color: '#ffffff', margin: '12px 0 4px 0', fontWeight: 800 }}>
            CRM Login
          </Title>
          <Text style={{ color: 'var(--text-secondary)' }}>
            Consultation Recording Manager
          </Text>
        </div>

        {isExpired && (
          <Alert
            message="Session Expired"
            description="Your login session has expired. Please sign in again."
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {errorMsg && (
          <Alert
            message="Login Failed"
            description={errorMsg}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="e.g. admin@example.com" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                background: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                borderRadius: 8,
                fontWeight: 600
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
              Register here
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
