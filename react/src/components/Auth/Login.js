import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { instance } from '../../api/axios';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.post('/api/auth/login', {
        email: values.email,
        password: values.password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/photos');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при входе. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Вход
        </Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Электронная почта"
            rules={[{ required: true, message: 'Пожалуйста, введите email!' }, { type: 'email', message: 'Введите корректный email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Войти
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></Text>
            <br />
            <Text><Link to="/forgot-password">Забыли пароль?</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
