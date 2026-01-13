// articles.js
// Génère le catalogue, applique les filtres par catégorie et gère l'ajout au panier.

// articles.js — récupère le catalogue depuis l'API (/api/articles) et gère l'affichage + ajout au panier

const API_URL = 'http://localhost:3000'; // Make sure backend is running on this port

const articlesGrid = document.getElementById('articles-grid');
const categoryButtons = document.querySelectorAll('.category-btn');

let articles = [];

async function loadArticlesFromApi() {
  try {
    const res = await fetch(`${API_URL}/api/articles`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    // Adapter champs si nécessaire
    articles = data.map(a => ({
      id: a.id,
      nom: a.nom || a.name || '',
      prix: a.prix || a.price || 0,
      image: a.image ? (a.image.startsWith('http') ? a.image : `${API_URL}/${a.image}`) : `${API_URL}/images/article1.jpg`,
      categorie: a.categorie || 'tous',
      description: a.description || ''
    }));
  } catch (err) {
    // fallback minimal si l'API indisponible
    console.warn('Impossible de charger l\'API, affichage des articles par défaut.', err);
    articles = [
      { id: 1, nom: 'Chanel No. 5', prix: 120, image: 'images/article1.jpg', categorie: 'parfums', description: 'Le parfum intemporel et légendaire.' },
      { id: 2, nom: 'Brume Vanille', prix: 25, image: 'images/article2.jpg', categorie: 'brume', description: 'Douceur sucrée.' },
      { id: 3, nom: 'Déodorant Fraîcheur', prix: 15, image: 'images/article3.jpg', categorie: 'deodorants', description: 'Protection 24h.' },
    ];
  }
}

function renderArticles(list) {
  if (!articlesGrid) {
    console.error('Element articles-grid non trouvé');
    return;
  }

  articlesGrid.innerHTML = '';

  if (list.length === 0) {
    articlesGrid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <div class="text-gray-400 mb-4">
          <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
        <p class="text-gray-500">Essayez de changer de catégorie ou rechargez la page.</p>
      </div>
    `;
    return;
  }

  list.forEach(a => {
    const card = document.createElement('div');
    card.className = 'group bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200';

    // Image Section with Zoom Effect
    const imageHTML = `
      <div class="relative overflow-hidden h-72 bg-gradient-to-br from-gray-50 to-gray-100">
        <img src="${a.image}" alt="${a.nom}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onerror="this.src='images/article1.jpg'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <button class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-600 p-3 rounded-full shadow-lg hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 hover:scale-110" title="Ajouter aux favoris">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
        
        <span class="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider">
          ${a.categorie || 'Nouveauté'}
        </span>
      </div>
    `;

    // Content Section
    const contentHTML = `
      <div class="p-6 flex-1 flex flex-col">
        <div class="mb-4 flex-1">
          <h3 class="text-xl font-serif font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1" title="${a.nom}">${a.nom}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">${a.description}</p>
        </div>

        <div class="mt-auto pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">Prix</p>
              <span class="text-3xl font-bold text-gray-900">${window.formatPrice ? window.formatPrice(a.prix) : a.prix + ' €'}</span>
            </div>
          </div>
          
          <button
            data-id="${a.id}"
            data-name="${a.nom}"
            data-price="${a.prix}"
            data-image="${a.image}"
            class="add-to-cart btn-ajouter w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            title="Ajouter au panier">
            <svg class="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>Ajouter au panier</span>
          </button>
        </div>
      </div>
    `;

    card.innerHTML = imageHTML + contentHTML;
    articlesGrid.appendChild(card);
  });

  // Masquer le loader si présent
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';

  // Transition d'opacité du body
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
    document.querySelectorAll('.category-btn').forEach(b => {
      b.classList.remove('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'text-white', 'shadow-lg', 'border-transparent');
      b.classList.add('bg-white', 'text-gray-700', 'border-gray-200');
    });
    e.target.classList.remove('bg-white', 'text-gray-700', 'border-gray-200');
    e.target.classList.add('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'text-white', 'shadow-lg', 'border-transparent');
    const cat = e.target.dataset.category;
    renderArticles(filterByCategory(cat));
  }
});

// Gestion ajout au panier
document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('.add-to-cart')) {
    const btn = e.target.closest('.add-to-cart');
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

    // Sauvegarder le contenu original
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>✓ Ajouté</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1500);
  }
});

// Initialisation
(async function init() {
  await loadArticlesFromApi();
  renderArticles(articles);
})();
