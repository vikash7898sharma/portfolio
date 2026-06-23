const Analytics = require('../models/Analytics');
const Project = require('../models/Project');
const Portfolio = require('../models/Portfolio');

exports.getAnalytics = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const analytics = await Analytics.find({ portfolio: portfolio._id })
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('project', 'title');

    const stats = {
      totalViews: analytics.filter(a => a.event === 'view').length,
      githubClicks: analytics.filter(a => a.event === 'click_github').length,
      liveClicks: analytics.filter(a => a.event === 'click_live').length,
      youtubeClicks: analytics.filter(a => a.event === 'click_youtube').length,
      aiChats: analytics.filter(a => a.event === 'ai_chat').length,
      resumeDownloads: analytics.filter(a => a.event === 'resume_download').length,
    };

    const topProjects = await Project.find({ portfolio: portfolio._id })
      .sort({ views: -1 })
      .limit(10)
      .select('title views clicks');

    res.json({ events: analytics, stats, topProjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackEvent = async (req, res) => {
  try {
    const { portfolioId, projectId, event } = req.body;

    await Analytics.create({
      portfolio: portfolioId,
      project: projectId,
      event,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
