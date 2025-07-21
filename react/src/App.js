import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import UploadPhoto from './components/Photos/UploadPhoto';
import MyPhotos from './components/Photos/MyPhotos';
import RatePhotos from './components/Photos/RatePhotos';
import PhotoStats from './components/Photos/PhotoStats';

const App = () => {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  const PublicOnlyRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/" /> : children;
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPhoto />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-photos"
            element={
              <PrivateRoute>
                <MyPhotos />
              </PrivateRoute>
            }
          />
          <Route
            path="/rate"
            element={
              <PrivateRoute>
                <RatePhotos />
              </PrivateRoute>
            }
          />
          <Route
            path="/photo-stats/:photoId"
            element={
              <PrivateRoute>
                <PhotoStats />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
