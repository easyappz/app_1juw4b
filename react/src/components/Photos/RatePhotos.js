import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Rate, Select, Slider, message, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios';

const { Title, Text } = Typography;
const { Option } = Select;

const RatePhotos = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ gender: '', ageRange: [18, 50] });
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhoto();
  }, [filters]);

  const fetchPhoto = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/api/photos/random', {
        params: {
          gender: filters.gender || undefined,
          minAge: filters.ageRange[0],
          maxAge: filters.ageRange[1],
        },
      });
      if (response.data.photo) {
        setPhoto(response.data.photo);
        setRating(0);
      } else {
        setPhoto(null);
        setError('Фотографии по заданным фильтрам не найдены. Попробуйте изменить параметры.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке фотографии. Попробуйте снова.');
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!photo || rating === 0) {
      message.error('Пожалуйста, оцените фотографию!');
      return;
    }

    try {
      await instance.post(`/api/photos/${photo._id}/rate`, { rating });
      message.success('Оценка сохранена!');
      fetchPhoto();
    } catch (err) {
      message.error(err.response?.data?.message || 'Ошибка при сохранении оценки.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Оценка фотографий
      </Title>
      <Card style={{ marginBottom: 24, padding: 16, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={4}>Фильтры</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Text>Пол:</Text>
            <Select
              value={filters.gender}
              onChange={(value) => handleFilterChange('gender', value)}
              style={{ width: '100%' }}
              placeholder="Любой"
            >
              <Option value="">Любой</Option>
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
            </Select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Text>Возраст:</Text>
            <Slider
              range
              value={filters.ageRange}
              onChange={(value) => handleFilterChange('ageRange', value)}
              min={18}
              max={100}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Card>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
          <Text>Загрузка фотографии...</Text>
        </div>
      ) : photo ? (
        <Card
          hoverable
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          cover={<img alt="Фото для оценки" src={`/uploads/${photo.filename}`} style={{ height: 400, objectFit: 'contain' }} />}
        >
          <Card.Meta
            title={`Оцените эту фотографию`}
            description={`Автор: ${photo.userId.name || 'Аноним'}`}
          />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Rate value={rating} onChange={setRating} style={{ fontSize: 30 }} />
            <Button
              type="primary"
              onClick={submitRating}
              style={{ marginTop: 16, width: '100%' }}
              disabled={rating === 0}
            >
              Отправить оценку
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text>Фотографии не найдены. Попробуйте изменить фильтры.</Text>
        </div>
      )}
      <Button
        onClick={() => navigate('/my-photos')}
        style={{ display: 'block', margin: '20px auto' }}
      >
        Вернуться к моим фотографиям
      </Button>
    </div>
  );
};

export default RatePhotos;
