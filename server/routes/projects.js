const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

router.get('/:id', projectController.getById);
router.post('/', protect, projectController.create);
router.put('/:id', protect, projectController.update);
router.delete('/:id', protect, projectController.delete);
router.post('/:id/click/:type', projectController.trackClick);
router.post('/:id/screenshots', protect, upload.array('screenshots', 30), async (req, res) => {
  try {
    const project = await require('../models/Project').findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const newScreenshots = req.files.map(f => `/uploads/${f.filename}`);
    project.screenshots = [...project.screenshots, ...newScreenshots];
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
