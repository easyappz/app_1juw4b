import React, { useState, useEffect } from 'react';
import { Button, Card, Image, Row, Col, message, Spin } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { instance } from '../api/axios';

const PhotoRating = ({ filters }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetchPhoto();
    fetchUserProfile();
  }, [filters]);

  const fetchPhoto = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.gender) params.gender = filters.gender;
      if (filters.minAge) params.minAge = filters.minAge;
      if (filters.maxAge) params.maxAge = filters.maxAge;

      const response = await instance.get('/photos/for-rating', { params });
      const photos = response.data.photos;
      if (photos && photos.length > 0) {
        // Select a random photo from the list
        const randomIndex = Math.floor(Math.random() * photos.length);
        setPhoto(photos[randomIndex]);
      } else {
        setPhoto(null);
        message.info('Фотографии по заданным фильтрам не найдены.');
      }
    } catch (error) {
      message.error('Ошибка при загрузке фотографии');
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await instance.get('/users/profile');
      setUserPoints(response.data.user.points || 0);
    } catch (error) {
      message.error('Ошибка при загрузке профиля');
    }
  };

  const handleRate = async (score) => {
    if (!photo) return;
    try {
      await instance.post(`/photos/rate/${photo._id}`, { score });
      message.success(score === 5 ? 'Оценка "Нравится" учтена!' : 'Оценка "Не нравится" учтена!');
      setUserPoints(userPoints + 1); // Increment points after rating
      fetchPhoto(); // Load a new photo
    } catch (error) {
      message.error('Ошибка при отправке оценки');
    }
  };

  return (
    <Card title="Оценка фотографий" style={{ margin: '20px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '16px', fontSize: '16px' }}>
        Ваши баллы: <strong>{userPoints}</strong>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" tip="Загрузка фотографии..." />
        </div>
      ) : photo ? (
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ textAlign: 'center' }}>
            <Image
              src={photo.url}
              alt="Фото для оценки"
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
            <div style={{ marginTop: '10px', fontSize: '16px' }}>
              Возраст: {photo.age || 'Не указан'}, Пол: {photo.gender === 'male' ? 'Мужской' : photo.gender === 'female' ? 'Женский' : 'Не указан'}
            </div>
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<LikeOutlined />}
              onClick={() => handleRate(5)}
              style={{ marginRight: '10px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Нравится
            </Button>
            <Button
              type="default"
              icon={<DislikeOutlined />}
              onClick={() => handleRate(1)}
              style={{ borderColor: '#f5222d', color: '#f5222d' }}
            >
              Не нравится
            </Button>
          </Col>
        </Row>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          Фотографии для оценки отсутствуют. Попробуйте изменить фильтры.
        </div>
      )}
    </Card>
  );
};

export default PhotoRating;
