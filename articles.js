const articlesGrid = document.getElementById('articles-grid');

// Initialiser le panier depuis localStorage
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Fonction pour sauvegarder le panier
function sauvegarderPanier() {
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Fonction pour afficher dynamiquement tous les articles
function afficherArticles() {
  articlesGrid.innerHTML = '';

  for (let i = 1; i <= 78; i++) {
    const articleCard = document.createElement('div');
    articleCard.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition transform hover:scale-105 hover:shadow-lg';

    articleCard.innerHTML = `
      <img src="images/article${i}.jpg" alt="Article ${i}" class="w-full h-48 object-cover">
      <div class="p-4 flex-1 flex flex-col justify-between">
        <h3 class="text-lg font-semibold mb-2">Article ${i}</h3>
        <p class="text-blue-500 font-bold text-xl mb-4">${20 + i} FCFA</p>
        <button data-id="${i}" data-name="Article ${i}" data-price="${20 + i}" data-image="images/article${i}.jpg"
          class="ajouter-panier bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded mt-auto transition-colors duration-300">
          Ajouter au Panier
        </button>
      </div>
    `;

    articlesGrid.appendChild(articleCard);
  }
}

// Gestion du clic "Ajouter au Panier"
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

    // Vérifier si l'article existe déjà dans le panier
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

// Loader (effet au chargement)
window.addEventListener('load', () => {
  if (document.getElementById('loader')) {
    document.getElementById('loader').style.display = 'none';
  }
  document.body.classList.remove('opacity-0');
  document.body.classList.add('opacity-100');
});

// Lancer l'affichage des articles
afficherArticles();
