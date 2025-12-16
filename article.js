// Script pour afficher dynamiquement le détail d'un article sur article.html
// Utilise l'id passé en paramètre d'URL

// Exemple d'utilisation : article.html?id=1

document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('article-detail').innerHTML = '<p class="text-center text-red-500">Article non spécifié.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/articles/${id}`);
    if (!res.ok) throw new Error('Article introuvable');
    const article = await res.json();

    const container = document.getElementById('article-detail');
    container.innerHTML = `
      <img src="${article.image || 'images/article1.jpg'}" alt="${article.nom}" class="w-full md:w-80 h-64 object-cover rounded-lg mb-6 md:mb-0" loading="lazy">
      <div class="flex-1 flex flex-col justify-between">
        <h2 class="text-3xl font-bold mb-4">${article.nom}</h2>
        <span class="text-lg text-gray-600 mb-2">${(article.categorie || 'Inconnu').charAt(0).toUpperCase() + (article.categorie || '').slice(1)}</span>
        <p class="text-gray-700 mb-4">${article.description || 'Pas de description disponible.'}</p>
        <p class="text-blue-500 font-bold text-2xl mb-6">${article.prix} FCFA</p>
        <button id="ajouter-panier-detail" class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300">Ajouter au Panier</button>
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
      alert('Article ajouté au panier !');
      // Mettre à jour le badge panier
      if (window.updatePanierBadge) window.updatePanierBadge();
    });

  } catch (err) {
    console.error(err);
    document.getElementById('article-detail').innerHTML = '<p class="text-center text-red-500">Impossible de charger l\'article.</p>';
  }
});
