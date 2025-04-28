const articlesGrid = document.getElementById('articles-grid');

// Initialiser le panier depuis localStorage
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Fonction pour sauvegarder le panier
function sauvegarderPanier() {
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Générer les articles
for (let i = 1; i <= 68; i++) {
  const article = document.createElement('div');
  article.className = 'bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300';

  article.innerHTML = `
    <img src="images/article${i}.jpg" alt="Article ${i}" class="w-full h-64 object-cover">
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">Article ${i}</h3>
      <p class="text-gray-700 mb-4">Prix : ${20 + i}FCFA</p>
      <button data-id="${i}" data-name="Article ${i}" data-price="${20 + i}" data-image="images/article${i}.jpg" class="ajouter-panier bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full transition-colors duration-300">Ajouter</button>
    </div>
  `;

  articlesGrid.appendChild(article);
}

// Gérer le clic sur "Ajouter"
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('ajouter-panier')) {
    const button = event.target;
    const nouvelArticle = {
      id: button.dataset.id,
      nom: button.dataset.name,
      prix: button.dataset.price,
      image: button.dataset.image,
      quantite: 1
    };

    // Vérifier si l'article est déjà dans le panier
    const existant = panier.find(item => item.id === nouvelArticle.id);
    if (existant) {
      existant.quantite += 1;
    } else {
      panier.push(nouvelArticle);
    }

    sauvegarderPanier();
    alert('Article ajouté au panier !');
  }
});
