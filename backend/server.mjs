import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import OpenAI from 'openai';

const app = express();
const port = 3001;
const upload = multer();

dotenv.config();

app.use(cors());
app.use(json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/transcribe', upload.single('audio'), async (req, res) => {

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Call OpenAI API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: file.buffer,
      model: 'whisper-1',
    });

    res.json({ transcription });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
