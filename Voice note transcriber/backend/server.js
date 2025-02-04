const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());

// Transcribe audio file
app.post('/transcribe', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

  
  const transcription = 'This is a transcribed text from the audio file.'; 

  // Clean up uploaded file
  fs.unlinkSync(filePath);

  // Send the transcription back
  res.json({ transcription });
});

// Summarize transcribed text
app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  
  const summary = 'This is a summary of the transcribed text.'; 

  res.json({ summary });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
