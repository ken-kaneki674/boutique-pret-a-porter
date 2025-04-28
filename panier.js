// Récupérer panier depuis localStorage
let panier = JSON.parse(localStorage.getItem('panier')) || [];

const panierContainer = document.getElementById('panier-container');
const totalPrix = document.getElementById('total-prix');

// Afficher les articles du panier
function afficherPanier() {
  panierContainer.innerHTML = "";

  if (panier.length === 0) {
    panierContainer.innerHTML = "<p class='text-center col-span-3'>Votre panier est vide.</p>";
    totalPrix.textContent = "";
    return;
  }

  let total = 0;

  panier.forEach(article => {
    total += article.prix * article.quantite;

    const articleCard = document.createElement('div');
    articleCard.className = "bg-white rounded-lg shadow-md overflow-hidden";

    articleCard.innerHTML = `
      <img src="${article.image}" alt="${article.nom}" class="w-full h-64 object-cover">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">${article.nom}</h3>
        <p class="text-gray-700 mb-2">Prix : ${article.prix}€</p>
        <p class="text-gray-700 mb-4">Quantité : ${article.quantite}</p>
        <button data-id="${article.id}" class="supprimer-article bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Supprimer</button>
      </div>
    `;

    panierContainer.appendChild(articleCard);
  });

  totalPrix.textContent = `Total : ${total}€`;
}

// Supprimer un article du panier
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('supprimer-article')) {
    const id = event.target.dataset.id;
    panier = panier.filter(article => article.id !== id);
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
  }
});

// Vider tout le panier
document.getElementById('vider-panier').addEventListener('click', function() {
  panier = [];
  localStorage.removeItem('panier');
  afficherPanier();
});

// Afficher panier au chargement
afficherPanier();

// Passer commande
document.getElementById('passer-commande').addEventListener('click', function() {
    if (panier.length === 0) {
      alert("Votre panier est vide !");
      return;
    }
  
    alert("✅ Commande passée avec succès ! Merci pour votre achat 🛍️");
    panier = [];
    localStorage.removeItem('panier');
    afficherPanier();
    updatePanierBadge();
  });
  