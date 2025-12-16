// articles.js
// Génère le catalogue, applique les filtres par catégorie et gère l'ajout au panier.

// articles.js — récupère le catalogue depuis l'API (/api/articles) et gère l'affichage + ajout au panier

const articlesGrid = document.getElementById('articles-grid');
const categoryButtons = document.querySelectorAll('.category-btn');

let articles = [];

async function loadArticlesFromApi() {
  try {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    // Adapter champs si nécessaire
    articles = data.map(a => ({ id: a.id, nom: a.nom || a.name || '', prix: a.prix || a.price || 0, image: a.image || 'images/article1.jpg', categorie: a.categorie || 'tous', description: a.description || '' }));
  } catch (err) {
    // fallback minimal si l'API indisponible
    console.warn('Impossible de charger l\'API, affichage des articles par défaut.', err);
    articles = [
      { id: 1, nom: 'T-shirt Bleu', prix: 20, image: 'images/article1.jpg', categorie: 'hommes', description: 'T-shirt confortable en coton.' },
      { id: 2, nom: 'Jeans Noir', prix: 40, image: 'images/article2.jpg', categorie: 'hommes', description: 'Jean coupe droite.' },
      { id: 3, nom: 'Robe Rouge', prix: 35, image: 'images/article3.jpg', categorie: 'femmes', description: 'Robe élégante.' },
    ];
  }
}

function renderArticles(list) {
  if (!articlesGrid) return;
  articlesGrid.innerHTML = '';
  list.forEach(a => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition transform hover:scale-105 hover:shadow-lg';
    card.innerHTML = `
      <a href="article.html?id=${a.id}" class="block">
        <img src="${a.image}" alt="${a.nom}" class="w-full h-48 object-cover" loading="lazy" onerror="this.src='images/article1.jpg'">
      </a>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <a href="article.html?id=${a.id}" class="hover:underline">
            <h3 class="text-lg font-semibold mb-2">${a.nom}</h3>
          </a>
          <span class="text-sm text-gray-600 mb-2">${(a.categorie||'').charAt(0).toUpperCase() + (a.categorie||'').slice(1)}</span>
        </div>
        <p class="text-blue-500 font-bold text-xl mb-4">${a.prix} €</p>
        <button data-id="${a.id}" data-name="${a.nom}" data-price="${a.prix}" data-image="${a.image}" class="add-to-cart btn-ajouter bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded mt-auto transition-colors duration-300">Ajouter au Panier</button>
      </div>
    `;
    articlesGrid.appendChild(card);
  });
  if (document.getElementById('loader')) document.getElementById('loader').style.display = 'none';
  document.body.classList.remove('opacity-0');
  document.body.classList.add('opacity-100');
}

function filterByCategory(cat) {
  if (!cat || cat === 'tous') return articles;
  return articles.filter(a => (a.categorie || 'tous').toLowerCase() === cat.toLowerCase());
}

// Listener catégories
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('category-btn')) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('bg-blue-500','text-white'));
    e.target.classList.add('bg-blue-500','text-white');
    const cat = e.target.dataset.category;
    renderArticles(filterByCategory(cat));
  }
});

// Gestion ajout au panier
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('add-to-cart')) {
    const btn = e.target;
    const nouvelArticle = {
      id: parseInt(btn.dataset.id),
      nom: btn.dataset.name,
      prix: parseFloat(btn.dataset.price),
      image: btn.dataset.image,
      quantite: 1
    };
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const existant = panier.find(item => item.id === nouvelArticle.id);
    if (existant) existant.quantite += 1; else panier.push(nouvelArticle);
    localStorage.setItem('panier', JSON.stringify(panier));
    if (window.updatePanierBadge) window.updatePanierBadge();
    btn.textContent = 'Ajouté';
    setTimeout(() => btn.textContent = 'Ajouter au Panier', 1000);
  }
});

// Initialisation
(async function init() {
  await loadArticlesFromApi();
  renderArticles(articles);
})();
