const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  consultantName: {
    type: String,
    required: [true, 'Consultant name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Recording title is required'],
    trim: true
  },
  consultationDate: {
    type: Date,
    required: [true, 'Consultation date is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: [0, 'Duration cannot be negative']
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Completed'],
    default: 'Pending'
  },
  audioFile: {
    type: String,
    required: [true, 'Audio file is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recording', recordingSchema);
