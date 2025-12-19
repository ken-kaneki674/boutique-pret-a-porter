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
    articleCard.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow";

    articleCard.innerHTML = `
      <div class="relative h-48">
          <img src="${article.image}" alt="${article.nom}" class="w-full h-full object-cover">
          <div class="absolute top-2 right-2">
             <span class="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">x${article.quantite}</span>
          </div>
      </div>
      <div class="p-5 flex-1 flex flex-col">
        <h3 class="text-lg font-bold text-gray-900 mb-1">${article.nom}</h3>
        <p class="text-indigo-600 font-bold text-xl mb-4">${article.prix} €/unité</p>
        
        <div class="mt-auto">
            <button data-id="${article.id}" class="supprimer-article w-full bg-red-50 text-red-600 hover:bg-red-100 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Supprimer
            </button>
        </div>
      </div>
    `;

    panierContainer.appendChild(articleCard);
  });

  totalPrix.textContent = `Total : ${total}€`;
}

// Supprimer un article du panier
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('supprimer-article')) {
    const id = event.target.dataset.id;
    panier = panier.filter(article => article.id !== id);
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
  }
});

// Vider tout le panier
document.getElementById('vider-panier').addEventListener('click', function () {
  panier = [];
  localStorage.removeItem('panier');
  afficherPanier();
});

// Afficher panier au chargement
afficherPanier();

// Passer commande -> Redirige vers WhatsApp
document.getElementById('passer-commande').addEventListener('click', function () {
  if (panier.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // Redirection WhatsApp
  window.open("https://wa.me/message/GM4TR23RZTU7J1", "_blank");
});

