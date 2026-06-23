const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getMyPortfolio,
  getBySlug,
  create,
  update,
  getPortfolioProjects,
  getPortfolioExperiences
} = require('../controllers/portfolioController');

router.get('/my', protect, getMyPortfolio);
router.get('/:slug', getBySlug);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.post('/:id/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const portfolio = await require('../models/Portfolio').findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { profileImage: `/uploads/${req.file.filename}` },
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:portfolioId/projects', getPortfolioProjects);
router.get('/:portfolioId/experiences', getPortfolioExperiences);

module.exports = router;
