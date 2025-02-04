const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  searchSnippets,
} = require('../controllers/snippetController');

router.route('/')
  .post(protect, createSnippet)
  .get(protect, getSnippets);

router.route('/search')
  .post(protect, searchSnippets);

router.route('/:id')
  .get(protect, getSnippetById)
  .put(protect, updateSnippet)
  .delete(protect, deleteSnippet);

module.exports = router; 