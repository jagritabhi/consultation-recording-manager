import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Select, Card, Popconfirm, message, Typography, Breadcrumb, Row, Col } from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  HomeOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const RecordingList = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Load recordings from API
  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recordings');
      setRecordings(res.data);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      message.error('Failed to load recordings list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  // Delete recording handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`/recordings/${id}`);
      message.success('Recording deleted successfully');
      // Update local state instead of refetching
      setRecordings(recordings.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting recording:', err);
      message.error(err.response?.data?.message || 'Failed to delete recording');
    }
  };

  // CSV Export utility
  const exportToCSV = () => {
    if (filteredRecordings.length === 0) {
      message.warning('No recordings found to export.');
      return;
    }

    const csvHeaders = [
      'Client Name',
      'Consultant Name',
      'Recording Title',
      'Consultation Date',
      'Duration (Minutes)',
      'Status',
      'Notes',
      'Created At'
    ];

    const csvRows = filteredRecordings.map(r => [
      `"${r.clientName.replace(/"/g, '""')}"`,
      `"${r.consultantName.replace(/"/g, '""')}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${new Date(r.consultationDate).toLocaleDateString()}"`,
      r.duration,
      r.status,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`
    ]);

    const csvString = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `consultations_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`Successfully exported ${filteredRecordings.length} records to CSV!`);
  };

  // Perform client-side filter for real-time responsiveness
  const filteredRecordings = recordings.filter(r => {
    const matchesSearch =
      r.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.consultantName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.title.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => <Link to={`/recordings/${record._id}`}>{text}</Link>
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      sorter: (a, b) => a.clientName.localeCompare(b.clientName)
    },
    {
      title: 'Consultant',
      dataIndex: 'consultantName',
      key: 'consultantName',
      sorter: (a, b) => a.consultantName.localeCompare(b.consultantName)
    },
    {
      title: 'Date',
      dataIndex: 'consultationDate',
      key: 'consultationDate',
      sorter: (a, b) => new Date(a.consultationDate) - new Date(b.consultationDate),
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => a.duration - b.duration,
      render: (duration) => `${duration} mins`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Reviewed', value: 'Reviewed' },
        { text: 'Completed', value: 'Completed' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'gold';
        if (status === 'Reviewed') color = 'blue';
        if (status === 'Completed') color = 'green';
        return <Tag color={color} style={{ borderRadius: 4, fontWeight: 500 }}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<PlayCircleOutlined style={{ color: '#4f46e5' }} />}
            onClick={() => navigate(`/recordings/${record._id}`)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />}
            onClick={() => navigate(`/recordings/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Recording"
            description="Are you sure you want to delete this recording? This will also remove the uploaded audio file."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="fade-in-el">
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Recordings</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Consultation Recordings</Title>
          <Paragraph className="page-description" style={{ margin: 0 }}>
            List, search, filter, and export all recorded client sessions.
          </Paragraph>
        </div>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportToCSV}
            style={{ borderRadius: 6 }}
          >
            Export to CSV
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/recordings/new')}
            style={{ borderRadius: 6, background: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            Add Recording
          </Button>
        </Space>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={14} lg={16}>
            <Input
              placeholder="Search by Client, Consultant, or Recording Title..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              style={{ borderRadius: 6 }}
            />
          </Col>
          <Col xs={24} md={10} lg={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ whiteSpace: 'nowrap', color: '#64748b' }}>Filter by Status:</Text>
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: '100%' }}
                size="large"
                className="custom-select"
              >
                <Option value="All">All Statuses</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Reviewed">Reviewed</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Table Card */}
      <Card style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredRecordings}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
          responsive={true}
        />
      </Card>
    </div>
  );
};

export default RecordingList;
