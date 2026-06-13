import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  Card,
  Space,
  message,
  Typography,
  Breadcrumb,
  Spin,
  Row,
  Col
} from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../services/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RecordingForm = () => {
  const { id } = useParams(); // Holds ID if in Edit mode
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Fetch recording details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchRecording = async () => {
        setFetchingData(true);
        try {
          const res = await api.get(`/recordings/${id}`);
          const recording = res.data;
          
          form.setFieldsValue({
            clientName: recording.clientName,
            consultantName: recording.consultantName,
            title: recording.title,
            consultationDate: dayjs(recording.consultationDate),
            duration: recording.duration,
            status: recording.status,
            notes: recording.notes
          });
          
          // Seed the upload file list indicator (non-editable, just to show file exists)
          setFileList([
            {
              uid: '-1',
              name: recording.audioFile,
              status: 'done',
              url: `/uploads/${recording.audioFile}`
            }
          ]);
        } catch (err) {
          console.error('Error fetching recording data:', err);
          message.error('Failed to load recording metadata for editing.');
          navigate('/recordings');
        } finally {
          setFetchingData(false);
        }
      };
      
      fetchRecording();
    }
  }, [id, isEditMode, form, navigate]);

  // Handle form submission
  const onFinish = async (values) => {
    // If creating, require an audio file
    if (!isEditMode && fileList.length === 0) {
      message.error('Please upload an audio file (MP3 or WAV).');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('clientName', values.clientName);
      formData.append('consultantName', values.consultantName);
      formData.append('title', values.title);
      formData.append('consultationDate', values.consultationDate.toISOString());
      formData.append('duration', Number(values.duration));
      formData.append('status', values.status);
      formData.append('notes', values.notes || '');

      // Only append new file if the user uploaded one
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('audio', fileList[0].originFileObj);
      }

      // Configure multi-part headers
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (isEditMode) {
        await api.put(`/recordings/${id}`, formData, config);
        message.success('Recording updated successfully!');
      } else {
        await api.post('/recordings', formData, config);
        message.success('Recording created successfully!');
      }

      navigate('/recordings');
    } catch (err) {
      console.error('Error saving recording:', err);
      message.error(err.response?.data?.message || 'Server error while saving recording.');
    } finally {
      setLoading(false);
    }
  };

  // Upload configuration
 const uploadProps = {
  onRemove: () => {
    setFileList([]);
  },

  beforeUpload: (file) => {
    const fileName = file.name.toLowerCase();

    
    const isLt50M = file.size / 1024 / 1024 < 50;

    if (!isLt50M) {
      message.error('Audio file must be smaller than 50MB.');
      return Upload.LIST_IGNORE;
    }

    setFileList([
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file
      }
    ]);

    return false;
  },

  fileList
};

  if (fetchingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Loading session recording details..." />
      </div>
    );
  }

  return (
    <div className="fade-in-el">
      {/* Breadcrumbs */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/recordings">Recordings</Breadcrumb.Item>
        <Breadcrumb.Item>{isEditMode ? 'Edit Recording' : 'Add Recording'}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/recordings')} 
          style={{ borderRadius: 6 }} 
        />
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {isEditMode ? 'Edit Consultation Recording' : 'Add Consultation Recording'}
          </Title>
          <Paragraph className="page-description" style={{ margin: 0 }}>
            {isEditMode 
              ? 'Update the details and upload a new audio file if needed.' 
              : 'Fill in client-consultant session details and upload the audio file.'
            }
          </Paragraph>
        </div>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', maxWidth: 800, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'Pending',
            duration: 30
          }}
          requiredMark={true}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="clientName"
                label="Client Name"
                rules={[{ required: true, message: 'Please enter the client name' }]}
              >
                <Input placeholder="e.g. Acme Corp / Jane Doe" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="consultantName"
                label="Consultant Name"
                rules={[{ required: true, message: 'Please enter the consultant name' }]}
              >
                <Input placeholder="e.g. Dr. Emily Smith" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Recording / Session Title"
                rules={[{ required: true, message: 'Please enter the recording title' }]}
              >
                <Input placeholder="e.g. Q2 Strategy Sync" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="consultationDate"
                label="Consultation Date"
                rules={[{ required: true, message: 'Please select the consultation date' }]}
              >
                <DatePicker style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="duration"
                label="Duration (in minutes)"
                rules={[
                  { required: true, message: 'Please enter session duration' },
                  { 
                    validator: (_, value) => {
                      if (value && Number(value) <= 0) {
                        return Promise.reject(new Error('Duration must be greater than 0'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" suffix="minutes" placeholder="e.g. 45" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select the status' }]}
              >
                <Select size="large">
                  <Option value="Pending">Pending</Option>
                  <Option value="Reviewed">Reviewed</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Consultation Notes & Transcript Summary"
          >
            <TextArea 
              rows={5} 
              placeholder="Enter notes, key action items, or bullet points discussed during the consultation..." 
            />
          </Form.Item>

          <Form.Item
            label="Audio Session File (MP3 / WAV)"
            required={!isEditMode}
            extra={isEditMode ? "Leave empty to keep the current audio file." : "Select an audio recording (MP3 or WAV) to upload."}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} size="large" disabled={fileList.length >= 1}>
                Choose Audio File
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ margin: '24px 0 0 0', textAlign: 'right' }}>
            <Space>
              <Button size="large" onClick={() => navigate('/recordings')}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<SaveOutlined />}
                style={{ background: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              >
                {isEditMode ? 'Update Session' : 'Save Session'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RecordingForm;
