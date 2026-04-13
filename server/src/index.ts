import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const connectionString = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// GET: Fetch Articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json({ data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// POST: Generate Article logic
app.post('/api/generate-article', async (req, res) => {
  try {
    const { topic, word_count, style } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is missing. Please configure OPENAI_API_KEY in your environment.' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!topic || !word_count || !style) {
      return res.status(400).json({ error: 'Missing required parameters (topic, word_count, style)'});
    }

    const prompt = `Write an article about ${topic}. Style: ${style}. Word count: around ${word_count} words. 
Format the response in JSON with two keys: "headline" and "content".`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert AI journalist formatting output in JSON." }, { role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    res.json({ ...result });
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: 'Failed to generate article' });
  }
});

// POST: Add new Article
app.post('/api/articles', async (req, res) => {
  try {
    const { headline, content, summary, category, status } = req.body;
    const article = await prisma.article.create({
      data: {
        headline,
        content,
        summary,
        category: category || "General",
        status: status || "published"
      }
    });
    res.json({ data: article });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// --- Serve the Vite frontend production build ---
// cwd is /app/server (since we cd server before starting), so ../dist = /app/dist
const distPath = path.resolve(process.cwd(), '../dist');
app.use(express.static(distPath));

// SPA fallback: any non-API route serves index.html for client-side routing
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
  console.log(`Serving static files from: ${distPath}`);
});
