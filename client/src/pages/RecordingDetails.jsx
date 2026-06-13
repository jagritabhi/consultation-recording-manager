import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, Typography, Space, Breadcrumb, Spin, Alert, Popconfirm, message } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  AudioOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

const RecordingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch recording details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/recordings/${id}`);
        setRecording(res.data);
      } catch (err) {
        console.error('Error fetching recording details:', err);
        setError(err.response?.data?.message || 'Recording not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    try {
      await api.delete(`/recordings/${id}`);
      message.success('Recording deleted successfully');
      navigate('/recordings');
    } catch (err) {
      console.error('Error deleting recording:', err);
      message.error(err.response?.data?.message || 'Failed to delete recording');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Loading consultation recording details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '24px auto' }}>
        <Alert
          message="Error Loading Details"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => navigate('/recordings')}>
              Back to Recordings
            </Button>
          }
        />
      </div>
    );
  }

  // Determine tag color based on status
  let statusColor = 'gold';
  if (recording.status === 'Reviewed') statusColor = 'blue';
  if (recording.status === 'Completed') statusColor = 'green';

  const audioUrl = `/uploads/${recording.audioFile}`;

  return (
    <div className="fade-in-el">
      {/* Breadcrumbs */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/recordings">Recordings</Breadcrumb.Item>
        <Breadcrumb.Item>Recording Details</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header and Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/recordings')} 
            style={{ borderRadius: 6 }}
          />
          <div>
            <Title level={2} style={{ margin: 0 }}>{recording.title}</Title>
            <Text type="secondary">Session ID: {recording._id}</Text>
          </div>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/recordings/edit/${recording._id}`)}
            style={{ borderRadius: 6 }}
          >
            Edit Recording
          </Button>
          <Popconfirm
            title="Delete Recording"
            description="Are you sure you want to delete this recording? This will also remove the uploaded audio file."
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: 6 }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Metadata Details Card */}
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
          <Descriptions title="Consultation Information" bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label={<span><UserOutlined /> Client Name</span>}>
              <Text strong>{recording.clientName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<span><UserOutlined /> Consultant</span>}>
              {recording.consultantName}
            </Descriptions.Item>
            <Descriptions.Item label={<span><CalendarOutlined /> Consultation Date</span>}>
              {new Date(recording.consultationDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Descriptions.Item>
            <Descriptions.Item label={<span><ClockCircleOutlined /> Duration</span>}>
              {recording.duration} minutes
            </Descriptions.Item>
            <Descriptions.Item label={<span><TagOutlined /> Status</span>}>
              <Tag color={statusColor} style={{ borderRadius: 4, fontWeight: 500, fontSize: 13, padding: '4px 12px' }}>
                {recording.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<span><CalendarOutlined /> Upload Date</span>}>
              {new Date(recording.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Audio Player Card */}
        <Card 
          title={<span><AudioOutlined style={{ color: '#4f46e5', marginRight: 8 }} /> Audio Session Playback</span>} 
          style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}
        >
          <div className="audio-player-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PlayCircleOutlined style={{ fontSize: 36, color: '#4f46e5' }} />
              <div>
                <Text strong style={{ fontSize: 16 }}>{recording.audioFile}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>Format: MP3 / WAV (Direct Local Audio File)</Text>
              </div>
            </div>
            
            <audio 
              controls 
              src={audioUrl} 
              className="custom-audio-player" 
              style={{ marginTop: 12 }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </Card>

        {/* Notes Card */}
        <Card 
          title="Consultation Notes & Transcript Summary" 
          style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0', minHeight: 200 }}
        >
          {recording.notes ? (
            <Paragraph style={{ whiteSpace: 'pre-line', fontSize: 15, color: '#334155', lineHeight: 1.6 }}>
              {recording.notes}
            </Paragraph>
          ) : (
            <Text type="secondary">No notes or transcript summaries were added for this consultation session.</Text>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecordingDetails;
