import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Alert, Statistic, Row, Col } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios';

const { Title, Text } = Typography;

const PhotoStats = () => {
  const { photoId } = useParams();
  const [photo, setPhoto] = useState(null);
  const [stats, setStats] = useState({ averageRating: 0, ratingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotoStats();
  }, [photoId]);

  const fetchPhotoStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const photoResponse = await instance.get(`/api/photos/${photoId}`);
      const statsResponse = await instance.get(`/api/photos/${photoId}/stats`);
      setPhoto(photoResponse.data.photo);
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке данных. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Статистика фотографии
      </Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
          <Text>Загрузка данных...</Text>
        </div>
      ) : photo ? (
        <>
          <Card
            hoverable
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: 24 }}
            cover={<img alt="Фото" src={`/uploads/${photo.filename}`} style={{ height: 400, objectFit: 'contain' }} />}
          >
            <Card.Meta
              title={`Статус: ${photo.active ? 'Включено для оценки' : 'Отключено от оценки'}`}
            />
          </Card>
          <Row gutter={16} style={{ textAlign: 'center' }}>
            <Col span={12}>
              <Statistic title="Средняя оценка" value={stats.averageRating.toFixed(2)} precision={2} />
            </Col>
            <Col span={12}>
              <Statistic title="Количество оценок" value={stats.ratingCount} />
            </Col>
          </Row>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text>Фотография не найдена.</Text>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button 
          onClick={() => navigate('/my-photos')} 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Вернуться к фотографиям
        </button>
      </div>
    </div>
  );
};

export default PhotoStats;
