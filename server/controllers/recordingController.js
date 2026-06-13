const fs = require('fs');
const path = require('path');
const Recording = require('../models/Recording');

// @desc    Get all recordings (with search, status filter, sorting, limit)
// @route   GET /api/recordings
// @access  Private
const getRecordings = async (req, res) => {
  try {
    const { search, status, limit, sort } = req.query;
    let queryObj = {};

    // Apply status filter if provided
    if (status && status !== 'All') {
      queryObj.status = status;
    }

    // Apply search query (covers clientName, consultantName, and title)
    if (search) {
      queryObj.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { consultantName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Build the query
    let query = Recording.find(queryObj);

    // Apply sorting
    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort('-createdAt'); // Default: newest first
    }

    // Apply limit (e.g. for dashboard recent table)
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const recordings = await query;
    res.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error.message);
    res.status(500).json({ message: 'Server error while fetching recordings' });
  }
};

// @desc    Get single recording details by ID
// @route   GET /api/recordings/:id
// @access  Private
const getRecordingById = async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    res.json(recording);
  } catch (error) {
    console.error('Error fetching recording details:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recording not found' });
    }
    res.status(500).json({ message: 'Server error while fetching recording details' });
  }
};

// @desc    Create a new recording
// @route   POST /api/recordings
// @access  Private
const createRecording = async (req, res) => {
  try {
    const { clientName, consultantName, title, consultationDate, duration, notes, status } = req.body;

    // Validate textual data
    if (!clientName || !consultantName || !title || !consultationDate || !duration) {
      // Remove uploaded file if metadata validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Please fill out all required fields' });
    }

    // Ensure audio file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an audio file (MP3 or WAV)' });
    }

    const recording = new Recording({
      clientName,
      consultantName,
      title,
      consultationDate,
      duration: Number(duration),
      notes: notes || '',
      status: status || 'Pending',
      audioFile: req.file.filename
    });

    const savedRecording = await recording.save();
    res.status(201).json(savedRecording);
  } catch (error) {
    console.error('Error creating recording:', error.message);
    // Cleanup physical file on database failure
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error while creating recording' });
  }
};

// @desc    Update an existing recording
// @route   PUT /api/recordings/:id
// @access  Private
const updateRecording = async (req, res) => {
  try {
    const { clientName, consultantName, title, consultationDate, duration, notes, status } = req.body;
    
    let recording = await Recording.findById(req.params.id);
    if (!recording) {
      // Remove newly uploaded file if the recording doesn't exist
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Recording not found' });
    }

    // Update text fields
    recording.clientName = clientName || recording.clientName;
    recording.consultantName = consultantName || recording.consultantName;
    recording.title = title || recording.title;
    recording.consultationDate = consultationDate || recording.consultationDate;
    recording.duration = duration ? Number(duration) : recording.duration;
    recording.notes = notes !== undefined ? notes : recording.notes;
    recording.status = status || recording.status;

    // Handle new audio file upload
    if (req.file) {
      // Delete older audio file from physical storage
      const oldFilePath = path.join(__dirname, '../uploads', recording.audioFile);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error('Failed to delete old physical file:', err.message);
        }
      }
      
      // Store the new audio filename
      recording.audioFile = req.file.filename;
    }

    const updatedRecording = await recording.save();
    res.json(updatedRecording);
  } catch (error) {
    console.error('Error updating recording:', error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error while updating recording' });
  }
};

// @desc    Delete a recording
// @route   DELETE /api/recordings/:id
// @access  Private
const deleteRecording = async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    // Delete associated physical audio file
    const filePath = path.join(__dirname, '../uploads', recording.audioFile);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete physical file during removal:', err.message);
      }
    }

    // Delete from database
    await Recording.deleteOne({ _id: req.params.id });

    res.json({ message: 'Recording and associated file deleted successfully' });
  } catch (error) {
    console.error('Error deleting recording:', error.message);
    res.status(500).json({ message: 'Server error while deleting recording' });
  }
};

module.exports = {
  getRecordings,
  getRecordingById,
  createRecording,
  updateRecording,
  deleteRecording
};
