import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Select, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { instance } from '../../api/axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.post('/api/auth/register', {
        email: values.email,
        password: values.password,
        name: values.name,
        gender: values.gender,
        birthDate: values.birthDate.format('YYYY-MM-DD'),
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/photos');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Регистрация
        </Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Имя" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Электронная почта"
            rules={[{ required: true, message: 'Пожалуйста, введите email!' }, { type: 'email', message: 'Введите корректный email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }, { min: 6, message: 'Пароль должен содержать минимум 6 символов!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Пожалуйста, подтвердите пароль!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Пол"
            rules={[{ required: true, message: 'Пожалуйста, выберите пол!' }]}
          >
            <Select placeholder="Выберите пол">
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="birthDate"
            label="Дата рождения"
            rules={[{ required: true, message: 'Пожалуйста, выберите дату рождения!' }]}
          >
            <DatePicker 
              placeholder="Выберите дату" 
              style={{ width: '100%' }} 
              disabledDate={(current) => current && current > moment().endOf('day')} 
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Зарегистрироваться
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text>Уже есть аккаунт? <Link to="/login">Войдите</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
