const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' },
  title: String,
  description: String,
  longDescription: String,
  techStack: [String],
  tags: [String],
  screenshots: [String],
  videoUrl: String,
  liveUrl: String,
  githubUrl: String,
  youtubeUrl: String,
  status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
  featured: { type: Boolean, default: false },
  aiSummary: String,
  views: { type: Number, default: 0 },
  clicks: { github: Number, live: Number, youtube: Number },
  buildTimeline: [{
    step: String,
    description: String,
    date: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
