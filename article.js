// Script pour afficher dynamiquement le détail d'un article sur article.html
// Utilise l'id passé en paramètre d'URL

// Nommage dédié (ARTICLE_API_URL) pour ne pas entrer en collision avec la
// déclaration `const API_URL` de articles.js, chargé sur la même page.
const ARTICLE_API_URL = (() => {
  const hostname = window.location.hostname;

  // 1. Local Development (File or Localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'http://localhost:3000';
  }

  // 2. GitHub Pages (Demo Mode - Frontend Only)
  if (hostname.includes('github.io')) {
    return null;
  }

  // 3. Production (AlwaysData, Heroku, etc.)
  // If we are here, we assume the backend serves the frontend
  return window.location.origin;
})();

document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('article-detail').innerHTML = '<p class="text-center text-red-500">Article non spécifié.</p>';
    return;
  }

  if (ARTICLE_API_URL === null) {
    document.getElementById('article-detail').innerHTML = '<p class="text-center text-yellow-600">Mode Démo : le détail des articles nécessite le backend, indisponible sur GitHub Pages.</p>';
    return;
  }

  try {
    const res = await fetch(`${ARTICLE_API_URL}/api/articles/${id}`);
    if (!res.ok) throw new Error('Article introuvable');
    const article = await res.json();

    const imgSrc = article.image ? (article.image.startsWith('http') ? article.image : `${ARTICLE_API_URL}/${article.image}`) : `${ARTICLE_API_URL}/images/article1.jpg`;

    const container = document.getElementById('article-detail');
    container.innerHTML = `
      <img src="${imgSrc}" alt="${article.nom}" class="w-full md:w-1/2 h-96 object-cover rounded-2xl mb-6 md:mb-0 shadow-lg" loading="lazy" onerror="this.src='${ARTICLE_API_URL}/images/article1.jpg'">
      <div class="flex-1 flex flex-col justify-center p-6">
        <h2 class="text-4xl font-extrabold mb-4 text-gray-900">${article.nom}</h2>
        <span class="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full w-fit mb-4 font-semibold shadow-sm">
            ${(article.categorie || 'Inconnu').charAt(0).toUpperCase() + (article.categorie || '').slice(1)}
        </span>
        <p class="text-gray-600 mb-6 text-lg leading-relaxed">${article.description || 'Pas de description disponible.'}</p>
        <div class="flex items-end gap-4 mb-8">
             <p class="text-indigo-600 font-bold text-4xl">${article.prix} FCFA</p>
        </div>
        
        <button id="ajouter-panier-detail" class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full md:w-auto">
            Ajouter au Panier 🛒
        </button>
      </div>
    `;

    // Ajout au panier
    document.getElementById('ajouter-panier-detail').addEventListener('click', function () {
      let panier = JSON.parse(localStorage.getItem('panier')) || [];
      const exist = panier.find(a => a.id === article.id);
      if (exist) {
        exist.quantite += 1;
      } else {
        panier.push({
          id: article.id,
          nom: article.nom,
          prix: article.prix,
          image: article.image || 'images/article1.jpg',
          quantite: 1
        });
      }
      localStorage.setItem('panier', JSON.stringify(panier));

      const btn = this;
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Ajouté !';
      btn.classList.add('bg-green-600');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600');
      }, 2000);

      // Mettre à jour le badge panier
      if (window.updatePanierBadge) window.updatePanierBadge();
    });

  } catch (err) {
    console.error(err);
    document.getElementById('article-detail').innerHTML = '<p class="text-center text-red-500 text-xl py-10">Impossible de charger l\'article. Vérifiez que le serveur backend est lancé.</p>';
  }
});
