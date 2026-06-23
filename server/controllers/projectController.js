const Project = require('../models/Project');
const Portfolio = require('../models/Portfolio');

exports.getById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('portfolio');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.views += 1;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const project = await Project.create({
      ...req.body,
      portfolio: portfolio._id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const portfolio = await Portfolio.findById(project.portfolio);
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const portfolio = await Portfolio.findById(project.portfolio);
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackClick = async (req, res) => {
  try {
    const { type } = req.params;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (type === 'github') project.clicks.github = (project.clicks.github || 0) + 1;
    if (type === 'live') project.clicks.live = (project.clicks.live || 0) + 1;
    if (type === 'youtube') project.clicks.youtube = (project.clicks.youtube || 0) + 1;

    await project.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
