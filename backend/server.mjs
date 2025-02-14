import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;
const upload = multer();

dotenv.config();

app.use(cors());
app.use(json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  let tempFilePath;
  let fileExistsAtPath;

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const tempFileName = `temp_audio_${uuid()}.webm`

    tempFilePath = path.join(__dirname, tempFileName);

    fs.writeFileSync(tempFilePath, file.buffer);

    fileExistsAtPath = tempFilePath && fs.existsSync(tempFilePath);

    return res.json({ transcription: 'remove this line to use the API'});
    
    // Call OpenAI API for transcription only if the file exists at the path
    if (fileExistsAtPath) {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
      });

      res.json({ transcription });
    } else {
      throw new Error({ message: 'File does not exist at that path' })
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });

  } finally {
    if (fileExistsAtPath) fs.unlinkSync(tempFilePath);;
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
