const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' },
  company: String,
  role: String,
  description: String,
  techUsed: [String],
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  type: { type: String, enum: ['work', 'education', 'freelance'], default: 'work' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experience', ExperienceSchema);
