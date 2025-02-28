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

app.post('/generateDiagram', upload.single('audio'), async (req, res) => {
  const DIAGRAM_PROMPT =
    'Pick the best Mermaid diagram (Flowchart, Sequence, Class, State, ERD, User Journey, Gantt, Pie, Quadrant, Requirement, Gitgraph, Mindmap, Timeline) or plain text pseudocode to organize the following text. Note: mermaid diagrams use only indentation to represent hierarchy. Include explanations if needed. Respond in a single markdown string with `\\n` for new lines. Text: ';

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const audioFile = new File([file.buffer], 'audio.webm', {
      type: file.mimetype,
    });

    res.set('Content-Type', 'text/markdown');

    // Comment out below to enable transcription and completion
    return res.send(
      "```mermaid\nmindmap\n  root((Rubber Ducky Project))\n    MVP\n      Record audio\n      Transcribe audio with OpenAI API\n      Generate Mermaid diagram from text\n      Frontend: Vue.js\n      Backend: Single endpoint\n    Post-MVP Ideas\n      Tech Enhancements\n        Incorporate TypeScript\n        Use Tailwind CSS\n      Monetization\n        Implement payment systems\n        Cost management with API usage\n      User Features\n        User authentication\n        Database for authentication\n        Save historical messages\n      Publishing & Deployment\n        Publish product\n        Consider pros/cons of public release\n      Codebase Improvements\n        Scalability\n        Error handling\n        Enhancements for hiring appeal\n      Infrastructure\n        Use context or a store for state management\n      Resume & Portfolio\n        Add project to resume\n        Write README for GitHub\n        Consider hiring manager appeal\n```\n\n**Explanation:**\n\nThis mind map helps organize your thoughts and potential next steps for the Rubber Ducky project. Here's a breakdown of the structure:\n\n- **MVP**: Lists the completed features of the Minimum Viable Product, specifying the backend and frontend technologies used.\n- **Post-MVP Ideas**: Outlines different categories for potential improvements and developments after the MVP:\n  - **Tech Enhancements**: Considerations for adding TypeScript and Tailwind CSS to showcase expertise.\n  - **Monetization**: Ideas for implementing payment systems and cost management strategies for API utilization.\n  - **User Features**: Enhancements for user-related functionalities such as authentication and message history.\n  - **Publishing & Deployment**: Decisions surrounding the publication and potential consequences of making the project public.\n  - **Codebase Improvements**: Suggestions for scalability, error handling, and aspects that could appeal to hiring managers.\n  - **Infrastructure**: Ideas related to state management solutions, specifically mentioning a Vue.js store.\n  - **Resume & Portfolio**: Plans for showcasing the project as part of a professional portfolio.\n\nThis visualization aims to guide your decision-making process regarding the project's future direction."
    );
    // eslint-disable-next-line
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    if (!transcription.text) {
      new Error({ message: 'No words detected from audio' });
    }

    console.log('transcription: ', transcription.text);

    const fullPrompt = `${DIAGRAM_PROMPT}${transcription.text}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'developer', content: fullPrompt }],
      model: 'gpt-4o-mini',
      store: true,
    });

    console.log('completion: ', completion.usage.total_tokens);

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
