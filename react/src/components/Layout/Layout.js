import React from 'react';
import { Layout as AntLayout, Menu, Button } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, CameraOutlined, StarOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  const menuItems = token ? [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Главная</Link> },
    { key: '/upload', icon: <CameraOutlined />, label: <Link to="/upload">Загрузить фото</Link> },
    { key: '/my-photos', icon: <UserOutlined />, label: <Link to="/my-photos">Мои фото</Link> },
    { key: '/rate', icon: <StarOutlined />, label: <Link to="/rate">Оценить фото</Link> },
  ] : [];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {!isAuthPage && (
        <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <Link to="/">ФотоОценка</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[location.pathname]}
              style={{ flex: 1, minWidth: 0 }}
            />
            {token && (
              <Button
                type="link"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ marginLeft: '16px' }}
              >
                Выйти
              </Button>
            )}
          </div>
        </Header>
      )}
      <Content style={{ padding: isAuthPage ? 0 : '20px', background: '#f0f2f5' }}>
        {children}
      </Content>
      {!isAuthPage && (
        <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #e8e8e8' }}>
          ФотоОценка ©2023
        </Footer>
      )}
    </AntLayout>
  );
};

export default Layout;
