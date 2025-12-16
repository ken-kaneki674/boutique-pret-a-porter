const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuration de multer pour sauvegarder les images dans le dossier images/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Servir les fichiers statiques du projet (frontend)
app.use(express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'images')));

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

// Création avec upload
app.post('/api/articles', upload.single('image'), (req, res) => {
  const { nom, description, prix, categorie } = req.body;
  // Si fichier uploadé, utiliser son chemin, sinon fallback ou rien
  const imagePath = req.file ? 'images/' + req.file.filename : 'images/article1.jpg';

  const created = db.createArticle({ nom, description, prix: parseFloat(prix), image: imagePath, categorie });
  res.status(201).json(created);
});

// Mise à jour avec upload optionnel
app.put('/api/articles/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const { nom, description, prix, categorie } = req.body;

  const payload = { nom, description, prix: parseFloat(prix), categorie };
  if (req.file) {
    payload.image = 'images/' + req.file.filename;
  }

  const updated = db.updateArticle(id, payload);
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
