import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Alert, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios';

const { Title, Text } = Typography;

const UploadPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await instance.get('/api/users/balance');
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Ошибка при получении баланса:', err);
    }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Пожалуйста, выберите файл для загрузки!');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', fileList[0]);

    try {
      await instance.post('/api/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Фотография успешно загружена!');
      navigate('/my-photos');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке фотографии. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Ограничить загрузку одним файлом
  };

  const uploadProps = {
    onChange: handleChange,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Можно загружать только изображения!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Размер изображения должен быть меньше 5MB!');
      }
      return isImage && isLt5M;
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 500, padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Загрузка фотографии
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
          Текущий баланс: <strong>{balance} баллов</strong>
        </Text>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        {balance === 0 && (
          <Alert
            message="У вас недостаточно баллов для включения фотографии на оценку."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <Text>Загрузка фотографии...</Text>
          </div>
        ) : (
          <>
            <Upload
              {...uploadProps}
              accept="image/*"
              listType="picture"
              style={{ width: '100%' }}
            >
              <Button icon={<UploadOutlined />}>Выбрать фотографию</Button>
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              style={{ marginTop: 16, width: '100%' }}
              disabled={fileList.length === 0}
            >
              Загрузить
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default UploadPhoto;
