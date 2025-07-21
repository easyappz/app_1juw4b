import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Button, Card, Col, Row, Statistic, Switch, message, Spin, Empty } from 'antd';
import { ManOutlined, WomanOutlined, CalendarOutlined } from '@ant-design/icons';
import '../styles/MyPhotosPage.css';

const MyPhotosPage = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch user's photos
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myPhotos'],
    queryFn: async () => {
      const response = await instance.get('/api/photos/my-photos');
      return response.data.photos;
    },
  });

  // Fetch user's profile for balance check
  const { data: userData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await instance.get('/api/users/profile');
      return response.data.user;
    },
  });

  // Mutation to toggle photo active status
  const toggleActiveMutation = useMutation({
    mutationFn: async (photoId) => {
      const response = await instance.put(`/api/photos/toggle-active/${photoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myPhotos']);
      messageApi.success('Статус фотографии обновлен');
    },
    onError: (error) => {
      messageApi.error(error.response?.data?.message || 'Ошибка при обновлении статуса');
    },
  });

  const handleToggleActive = (photoId, currentStatus, userPoints) => {
    if (!currentStatus && userPoints <= 0) {
      messageApi.warning('Недостаточно баллов для активации фотографии');
      return;
    }
    toggleActiveMutation.mutate(photoId);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <Empty description={`Ошибка: ${error.message}`} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-container">
        <Empty description="У вас нет загруженных фотографий" />
      </div>
    );
  }

  return (
    <div className="my-photos-container">
      {contextHolder}
      <h1>Мои фотографии</h1>
      <Row gutter={[16, 16]}>
        {data.map((photo) => (
          <Col xs={24} sm={12} md={8} lg={6} key={photo._id}>
            <Card
              hoverable
              cover={<img alt="Фото" src={photo.url} className="photo-image" />}
              actions={[
                <Switch
                  checked={photo.isActive}
                  onChange={() => handleToggleActive(photo._id, photo.isActive, userData?.points || 0)}
                  checkedChildren="Активно"
                  unCheckedChildren="Неактивно"
                />,
              ]}
            >
              <Statistic title="Количество оценок" value={photo.ratings.length} />
              <Row gutter={8} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Statistic
                    title="Мужчины"
                    value={photo.genderStats?.male || 0}
                    prefix={<ManOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Женщины"
                    value={photo.genderStats?.female || 0}
                    prefix={<WomanOutlined />}
                  />
                </Col>
              </Row>
              <Statistic
                title="Средний возраст"
                value={photo.ageStats?.average || 0}
                prefix={<CalendarOutlined />}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MyPhotosPage;
