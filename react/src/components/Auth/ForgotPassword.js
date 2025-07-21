import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { instance } from '../../api/axios';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await instance.post('/api/auth/forgot-password', {
        email: values.email,
      });
      setSuccess(true);
      message.success('Инструкции по восстановлению пароля отправлены на ваш email.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отправке запроса. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Восстановление пароля
        </Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        {success && <Alert message="Инструкции отправлены на ваш email!" type="success" showIcon style={{ marginBottom: 16 }} />}
        {!success && (
          <Form
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Электронная почта"
              rules={[{ required: true, message: 'Пожалуйста, введите email!' }, { type: 'email', message: 'Введите корректный email!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                Отправить инструкции
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text>Вспомнили пароль? <Link to="/login">Войдите</Link></Text>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
