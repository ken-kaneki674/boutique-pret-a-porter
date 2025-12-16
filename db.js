// db.js — simple JSON-based persistence for dev (no native deps)
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = { articles: [], orders: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading data file', e);
    return { articles: [], orders: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Ensure seed
const data = readData();
if (!Array.isArray(data.articles) || data.articles.length === 0) {
  data.articles = [
    { id: 1, nom: 'T-shirt Bleu', description: 'T-shirt confortable en coton.', prix: 20, image: 'images/article1.jpg', categorie: 'hommes' },
    { id: 2, nom: 'Jeans Noir', description: 'Jean coupe droite, matière résistante.', prix: 40, image: 'images/article2.jpg', categorie: 'hommes' },
    { id: 3, nom: 'Robe Rouge', description: 'Robe élégante pour toutes occasions.', prix: 35, image: 'images/article3.jpg', categorie: 'femmes' },
    { id: 4, nom: 'Sac à main', description: 'Sac à main en imitation cuir.', prix: 50, image: 'images/article4.jpg', categorie: 'accessoires' }
  ];
  writeData(data);
}

function getAllArticles() {
  return readData().articles;
}

function getArticleById(id) {
  const d = readData();
  return d.articles.find(a => a.id === Number(id));
}

function createArticle(payload) {
  const d = readData();
  const nextId = d.articles.reduce((max, a) => Math.max(max, a.id || 0), 0) + 1;
  const article = Object.assign({}, payload, { id: nextId });
  d.articles.push(article);
  writeData(d);
  return article;
}

function updateArticle(id, payload) {
  const d = readData();
  const idx = d.articles.findIndex(a => a.id === Number(id));
  if (idx === -1) return null;
  d.articles[idx] = Object.assign({}, d.articles[idx], payload, { id: Number(id) });
  writeData(d);
  return d.articles[idx];
}

function deleteArticle(id) {
  const d = readData();
  const before = d.articles.length;
  d.articles = d.articles.filter(a => a.id !== Number(id));
  writeData(d);
  return d.articles.length < before;
}

function createOrder(payload) {
  const d = readData();
  const nextId = d.orders.reduce((max, o) => Math.max(max, o.id || 0), 0) + 1;
  const order = { id: nextId, data: payload, created_at: new Date().toISOString() };
  d.orders.push(order);
  writeData(d);
  return order;
}

function getAllOrders() {
  return readData().orders;
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  createOrder,
  getAllOrders
};
