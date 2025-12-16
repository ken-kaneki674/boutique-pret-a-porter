const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du projet (frontend)
app.use(express.static(path.join(__dirname)));

// Endpoints Articles using JSON db
app.get('/api/articles', (req, res) => {
  const rows = db.getAllArticles();
  res.json(rows);
});

app.get('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  const row = db.getArticleById(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

app.post('/api/articles', (req, res) => {
  const { nom, description, prix, image, categorie } = req.body;
  const created = db.createArticle({ nom, description, prix, image, categorie });
  res.status(201).json(created);
});

app.put('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  const { nom, description, prix, image, categorie } = req.body;
  const updated = db.updateArticle(id, { nom, description, prix, image, categorie });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

app.delete('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  const ok = db.deleteArticle(id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// Endpoints commandes
app.post('/api/orders', (req, res) => {
  const created = db.createOrder(req.body);
  res.status(201).json(created);
});

app.get('/api/orders', (req, res) => {
  const rows = db.getAllOrders();
  res.json(rows);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
