// Script pour afficher dynamiquement le détail d'un article sur article.html
// Utilise l'id passé en paramètre d'URL

// Exemple d'utilisation : article.html?id=1

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;

  // Importer la liste des articles (priorité aux articles admin)
  let articles = Array.from({ length: 78 }, (_, i) => ({
    id: i + 1,
    nom: `Article ${i + 1}`,
    prix: 20 + i + 1,
    image: `images_optimized/article${i + 1}.webp`,
    categorie: i % 3 === 0 ? 'hommes' : i % 3 === 1 ? 'femmes' : 'accessoires'
  }));
  const adminArticles = JSON.parse(localStorage.getItem('admin_articles')) || [];
  if (adminArticles.length > 0) {
    articles = adminArticles.map((a, i) => ({
      id: i + 1,
      nom: a.nom,
      prix: a.prix,
      image: `images_optimized/article${i + 1}.webp`,
      categorie: a.categorie
    }));
  }

  const article = articles.find(a => a.id === id);
  if (!article) return;

  const container = document.getElementById('article-detail');
  container.innerHTML = `
    <img src="${article.image}" alt="${article.nom}" class="w-full md:w-80 h-64 object-cover rounded-lg mb-6 md:mb-0" loading="lazy">
    <div class="flex-1 flex flex-col justify-between">
      <h2 class="text-3xl font-bold mb-4">${article.nom}</h2>
      <span class="text-lg text-gray-600 mb-2">${article.categorie.charAt(0).toUpperCase() + article.categorie.slice(1)}</span>
      <p class="text-blue-500 font-bold text-2xl mb-6">${article.prix} FCFA</p>
      <button id="ajouter-panier-detail" class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300">Ajouter au Panier</button>
    </div>
  `;

  // Ajout au panier
  document.getElementById('ajouter-panier-detail').addEventListener('click', function() {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const exist = panier.find(a => a.id === article.id);
    if (exist) {
      exist.quantite += 1;
    } else {
      panier.push({ ...article, quantite: 1 });
    }
    localStorage.setItem('panier', JSON.stringify(panier));
    alert('Article ajouté au panier !');
    // Mettre à jour le badge panier
    if (window.updatePanierBadge) window.updatePanierBadge();
  });
});
