import React, { useEffect, useState } from 'react';
import { Typography, Button, Card, Statistic, Row, Col, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { instance } from '../api/axios';

const { Title, Text } = Typography;

const Home = () => {
  const [userStats, setUserStats] = useState({ balance: 0, photoCount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const balanceResponse = await instance.get('/api/users/balance');
      const photosResponse = await instance.get('/api/photos/my-photos');
      setUserStats({
        balance: balanceResponse.data.balance,
        photoCount: photosResponse.data.photos.length,
      });
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 16 }}>
        Добро пожаловать в ФотоОценка
      </Title>
      <Text style={{ display: 'block', textAlign: 'center', marginBottom: 32, fontSize: 16 }}>
        Загружайте свои фотографии, получайте оценки от других пользователей и зарабатывайте баллы, оценивая чужие работы.
      </Text>

      {token ? (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
              <Text>Загрузка данных...</Text>
            </div>
          ) : (
            <Row gutter={16} style={{ marginBottom: 32, textAlign: 'center' }}>
              <Col span={12}>
                <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Statistic title="Ваш баланс" value={userStats.balance} suffix="баллов" />
                </Card>
              </Col>
              <Col span={12}>
                <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Statistic title="Ваши фотографии" value={userStats.photoCount} suffix="шт." />
                </Card>
              </Col>
            </Row>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/upload')}
              style={{ minWidth: 200 }}
            >
              Загрузить фотографию
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => navigate('/rate')}
              style={{ minWidth: 200 }}
            >
              Оценить фотографии
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => navigate('/my-photos')}
              style={{ minWidth: 200 }}
            >
              Мои фотографии
            </Button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/login')}
            style={{ marginRight: 16, minWidth: 200 }}
          >
            Войти
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => navigate('/register')}
            style={{ minWidth: 200 }}
          >
            Зарегистрироваться
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
