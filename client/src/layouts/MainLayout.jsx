import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography, Drawer } from 'antd';
import {
  DashboardOutlined,
  PlaySquareOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/recordings',
      icon: <PlaySquareOutlined />,
      label: 'Recordings'
    },
    {
      key: '/recordings/new',
      icon: <PlusCircleOutlined />,
      label: 'Add Recording'
    }
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileVisible(false); // Close mobile drawer if open
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentSelectedKey = location.pathname.startsWith('/recordings') 
    ? (location.pathname === '/recordings/new' ? '/recordings/new' : '/recordings') 
    : '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="80"
        trigger={null}
        className="desktop-sider"
        style={{
          display: 'none',
          '@media (min-width: 992px)': { display: 'block' }
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '0 24px',
          background: '#0b0f19',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ fontSize: 24, marginRight: collapsed ? 0 : 8 }}>🎙️</span>
          {!collapsed && (
            <span style={{ 
              fontWeight: 800, 
              color: '#ffffff', 
              fontSize: 16, 
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap'
            }}>
              CRM Admin
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentSelectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 16 }}
        />
      </Sider>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="🎙️ Navigation"
        placement="left"
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        bodyStyle={{ padding: 0, background: '#0f172a' }}
        headerStyle={{ background: '#0b0f19', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentSelectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Drawer>

      <Layout>
        {/* Header */}
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Collapse Trigger for Desktop Sider */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                display: 'none',
                '@media (min-width: 992px)': { display: 'inline-block' }
              }}
              className="sider-trigger"
            />
            {/* Toggle trigger for Mobile */}
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setMobileVisible(true)}
              style={{
                fontSize: '16px',
                width: 48,
                height: 48,
                display: 'inline-block',
                marginRight: 12
              }}
              className="mobile-trigger"
            />
            <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>
              Consultation Recording Manager
            </Title>
          </div>

          <Space size="middle">
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
              title="View Profile"
            >
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <Text strong style={{ color: '#1e293b' }}>{user?.name}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{user?.email}</Text>
              </div>
            </div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ borderRadius: 6 }}
            >
              Logout
            </Button>
          </Space>
        </Header>

        {/* Content Area */}
        <Content style={{ margin: '24px', minHeight: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          Consultation Recording Manager ©2026. Built as a Tech Intern Assessment Project.
        </Footer>
      </Layout>

      {/* Embedded CSS for responsive triggers */}
      <style>{`
        @media (max-width: 991px) {
          .desktop-sider { display: none !important; }
          .sider-trigger { display: none !important; }
          .mobile-trigger { display: inline-block !important; }
        }
        @media (min-width: 992px) {
          .desktop-sider { display: block !important; }
          .sider-trigger { display: inline-block !important; }
          .mobile-trigger { display: none !important; }
        }
      `}</style>
    </Layout>
  );
};

export default MainLayout;
