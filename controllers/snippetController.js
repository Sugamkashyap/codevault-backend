const Snippet = require('../models/Snippet');
const { Configuration, OpenAIApi } = require('openai');

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Create new snippet
const createSnippet = async (req, res) => {
  try {
    const { title, language, content, tags } = req.body;
    const snippet = await Snippet.create({
      title,
      language,
      content,
      tags,
      user: req.user._id,
    });
    res.status(201).json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all snippets for a user
const getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single snippet
const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update snippet
const updateSnippet = async (req, res) => {
  try {
    const { title, language, content, tags } = req.body;
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    snippet.title = title || snippet.title;
    snippet.language = language || snippet.language;
    snippet.content = content || snippet.content;
    snippet.tags = tags || snippet.tags;

    const updatedSnippet = await snippet.save();
    res.json(updatedSnippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete snippet
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await snippet.remove();
    res.json({ message: 'Snippet removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI-powered search
const searchSnippets = async (req, res) => {
  try {
    const { query } = req.body;
    const userSnippets = await Snippet.find({ user: req.user._id });

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Search through these code snippets and return the most relevant ones for the query: "${query}"\n\nSnippets:\n${userSnippets.map(s => `${s.title}: ${s.content}`).join('\n\n')}`,
      max_tokens: 500,
      temperature: 0.7,
    });

    const relevantSnippets = userSnippets.filter(snippet => 
      completion.data.choices[0].text.toLowerCase().includes(snippet.title.toLowerCase())
    );

    res.json(relevantSnippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  searchSnippets,
}; 