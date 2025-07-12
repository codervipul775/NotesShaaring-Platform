const summarizer = require('../utils/summarizer');

const createNote = async (req, res) => {
  try {
    const { title, subject, description } = req.body;
    const fileUrl = req.file.path;

    let summary = '';
    if (fileUrl.endsWith('.pdf')) {
      summary = await summarizer(fileUrl);
      console.log('Generated summary:', summary);
    }

    const newNote = new Note({
      title,
      subject,
      description,
      fileUrl,
      uploadedBy: req.user.id,
      summary
    });

    await newNote.save();
    res.status(201).json({ success: true, note: newNote });

  } catch (error) {
  console.error('Upload Error Stack:', error.stack);
  console.error(' Upload Error Full:', error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
}

};
