import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Typography, Button, Spin, Empty, Alert } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await api.get('/recordings');
        setRecordings(res.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard statistics. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecordings();
  }, []);

  // Compute metrics
  const total = recordings.length;
  const pending = recordings.filter(r => r.status === 'Pending').length;
  const reviewed = recordings.filter(r => r.status === 'Reviewed').length;
  const completed = recordings.filter(r => r.status === 'Completed').length;

  // Recent recordings table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <Link to={`/recordings/${record._id}`}>{text}</Link>
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName'
    },
    {
      title: 'Consultant',
      dataIndex: 'consultantName',
      key: 'consultantName'
    },
    {
      title: 'Date',
      dataIndex: 'consultationDate',
      key: 'consultationDate',
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gold';
        if (status === 'Reviewed') color = 'blue';
        if (status === 'Completed') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<PlayCircleOutlined />}
          onClick={() => navigate(`/recordings/${record._id}`)}
        >
          Listen / View
        </Button>
      )
    }
  ];

  // Get the latest 5 recordings
  const recentRecordings = [...recordings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Loading stats and recordings..." />
      </div>
    );
  }

  return (
    <div className="fade-in-el">
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Dashboard</Title>
        <Paragraph className="page-description">
          Review consultation recordings status and metrics at a glance.
        </Paragraph>
      </div>

      {error && (
        <Alert
          message="Connection Issue"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Metric Cards Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
            <Statistic
              title="Total Recordings"
              value={total}
              prefix={<FileTextOutlined style={{ color: '#6366f1', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" style={{ borderLeft: '4px solid #fa8c16' }}>
            <Statistic
              title="Pending Recordings"
              value={pending}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic
              title="Reviewed Recordings"
              value={reviewed}
              prefix={<EyeOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title="Completed Recordings"
              value={completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Card
        title="Recent Recordings (Latest 5)"
        extra={
          <Button type="link" onClick={() => navigate('/recordings')} style={{ fontWeight: 600 }}>
            View All Recordings <ArrowRightOutlined />
          </Button>
        }
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}
      >
        {recentRecordings.length > 0 ? (
          <Table
            columns={columns}
            dataSource={recentRecordings}
            rowKey="_id"
            pagination={false}
            responsive={true}
          />
        ) : (
          <Empty description="No recordings uploaded yet." style={{ padding: '32px 0' }}>
            <Button type="primary" onClick={() => navigate('/recordings/new')}>
              Add Your First Recording
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
