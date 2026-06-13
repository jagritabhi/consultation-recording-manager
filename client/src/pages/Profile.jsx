import React from 'react';
import { Card, Descriptions, Avatar, Typography, Breadcrumb, Button, Space } from 'antd';
import { UserOutlined, CalendarOutlined, MailOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph, Text } = Typography;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fade-in-el">
      {/* Breadcrumbs */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')} 
          style={{ borderRadius: 6 }} 
        />
        <div>
          <Title level={2} style={{ margin: 0 }}>My Profile</Title>
          <Paragraph className="page-description" style={{ margin: 0 }}>
            View and manage your account credentials and registration details.
          </Paragraph>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Card 
          style={{ 
            borderRadius: 16, 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)', 
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header Banner */}
          <div style={{ 
            height: 120, 
            background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
            position: 'relative'
          }} />

          {/* User Details Area */}
          <div style={{ padding: '0 32px 32px 32px', marginTop: -48, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
              <Avatar 
                size={96} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#87d068', 
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <div style={{ paddingBottom: 8 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{user?.name}</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>System Administrator / Tech Intern</Text>
              </div>
            </div>

            <Descriptions title="Account Credentials & Information" bordered column={1} labelStyle={{ width: '220px', fontWeight: 600 }}>
              <Descriptions.Item label={<span><UserOutlined style={{ marginRight: 8, color: '#4f46e5' }} /> Full Name</span>}>
                <Text strong>{user?.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<span><MailOutlined style={{ marginRight: 8, color: '#4f46e5' }} /> Email Address</span>}>
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><CalendarOutlined style={{ marginRight: 8, color: '#4f46e5' }} /> Joined On</span>}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Access Role">
                <Text code style={{ color: '#4f46e5', fontWeight: 600 }}>Administrator</Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
