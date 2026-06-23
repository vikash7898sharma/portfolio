const Portfolio = require('../models/Portfolio');
const Project = require('../models/Project');
const Experience = require('../models/Experience');

exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, isPublic: true });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    portfolio.views += 1;
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const existing = await Portfolio.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Portfolio already exists' });
    }

    const slug = req.body.slug || `portfolio-${req.user._id.toString().slice(-8)}`;
    const portfolio = await Portfolio.create({
      ...req.body,
      user: req.user._id,
      slug
    });
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPortfolioProjects = async (req, res) => {
  try {
    const projects = await Project.find({ portfolio: req.params.portfolioId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPortfolioExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ portfolio: req.params.portfolioId }).sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
