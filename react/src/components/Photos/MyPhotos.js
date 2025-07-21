import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Button, Switch, message, Spin, Alert } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios';

const { Title, Text } = Typography;

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotos();
    fetchUserBalance();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/api/photos/my-photos');
      setPhotos(response.data.photos);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке фотографий. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await instance.get('/api/users/balance');
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Ошибка при получении баланса:', err);
    }
  };

  const togglePhotoStatus = async (photoId, active) => {
    if (!active && balance <= 0) {
      message.error('Недостаточно баллов для включения фотографии на оценку.');
      return;
    }

    try {
      await instance.put(`/api/photos/${photoId}/status`, { active });
      setPhotos(photos.map(photo => 
        photo._id === photoId ? { ...photo, active } : photo
      ));
      if (active) {
        setBalance(balance - 1);
      }
      message.success(active ? 'Фотография включена для оценки' : 'Фотография отключена от оценки');
    } catch (err) {
      message.error(err.response?.data?.message || 'Ошибка при изменении статуса.');
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      await instance.delete(`/api/photos/${photoId}`);
      setPhotos(photos.filter(photo => photo._id !== photoId));
      message.success('Фотография удалена');
    } catch (err) {
      message.error(err.response?.data?.message || 'Ошибка при удалении фотографии.');
    }
  };

  const viewStats = (photoId) => {
    navigate(`/photo-stats/${photoId}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Мои фотографии
      </Title>
      <Text style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
        Текущий баланс: <strong>{balance} баллов</strong>
      </Text>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {balance === 0 && (
        <Alert
          message="У вас недостаточно баллов для включения фотографий на оценку. Оценивайте фотографии других пользователей, чтобы заработать баллы."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
          <Text>Загрузка фотографий...</Text>
        </div>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={photos}
          renderItem={(photo) => (
            <List.Item>
              <Card
                hoverable
                cover={<img alt="Фото" src={`/uploads/${photo.filename}`} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <Switch
                    checked={photo.active}
                    onChange={(checked) => togglePhotoStatus(photo._id, checked)}
                    checkedChildren="Включено"
                    unCheckedChildren="Выключено"
                  />,
                  <Button icon={<EyeOutlined />} onClick={() => viewStats(photo._id)}>
                    Статистика
                  </Button>,
                  <Button icon={<DeleteOutlined />} danger onClick={() => deletePhoto(photo._id)}>
                    Удалить
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={`Средняя оценка: ${photo.averageRating || 'Нет оценок'}`}
                  description={`Оценок: ${photo.ratingCount || 0}`}
                />
              </Card>
            </List.Item>
          )}
          locale={{ emptyText: 'У вас пока нет загруженных фотографий.' }}
        />
      )}
      <Button
        type="primary"
        onClick={() => navigate('/upload')}
        style={{ display: 'block', margin: '20px auto' }}
      >
        Загрузить новую фотографию
      </Button>
    </div>
  );
};

export default MyPhotos;
