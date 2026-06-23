const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  event: { type: String, enum: ['view', 'click_github', 'click_live', 'click_youtube', 'ai_chat', 'resume_download'] },
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
