const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  title: String,
  bio: String,
  profileImage: String,
  skills: [{ name: String, level: Number }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  theme: { type: String, default: 'dark' },
  isPublic: { type: Boolean, default: true },
  slug: { type: String, unique: true },
  views: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
