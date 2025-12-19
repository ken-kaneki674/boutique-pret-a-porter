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
    // New Card Style: rounded-2xl, smoother shadow, group for hover effects
    card.className = 'group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1';
    
    // Image Section with Zoom Effect
    const imageHTML = `
      <div class="relative overflow-hidden h-64 bg-gray-100">
        <img src="${a.image}" alt="${a.nom}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" onerror="this.src='images/article1.jpg'">
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        <button class="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 p-2 rounded-full shadow-sm hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
           ♥
        </button>
        <span class="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
          ${a.categorie || 'Nouveauté'}
        </span>
      </div>
    `;

    // Content Section
    const contentHTML = `
      <div class="p-6 flex-1 flex flex-col">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1" title="${a.nom}">${a.nom}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 mt-1">${a.description || 'Description courte du produit...'}</p>
        </div>
        
        <div class="mt-auto flex items-center justify-between">
          <span class="text-2xl font-bold text-gray-900">${a.prix} €</span>
          <button 
            data-id="${a.id}" 
            data-name="${a.nom}" 
            data-price="${a.prix}" 
            data-image="${a.image || 'images/article1.jpg'}" 
            class="add-to-cart btn-ajouter bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2">
            <span>Ajouter</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>
    `;

    card.innerHTML = imageHTML + contentHTML;
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
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('bg-blue-500', 'text-white'));
    e.target.classList.add('bg-blue-500', 'text-white');
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
