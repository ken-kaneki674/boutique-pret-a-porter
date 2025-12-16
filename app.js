// app.js - utilitaires globaux (badge panier, gestion loader)

// Met à jour le badge du panier présent dans la navbar
window.updatePanierBadge = function () {
  try {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const count = panier.reduce((total, article) => total + (article.quantite || 0), 0);
    const badge = document.getElementById('panier-count');
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.textContent = '';
        badge.classList.add('hidden');
      }
    }
  } catch (e) {
    // ignore
  }
};

// Au chargement, retirer loader si présent et afficher le body
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
  document.body.classList.remove('opacity-0');
  document.body.classList.add('opacity-100');
  // Mettre à jour badge lors du load
  window.updatePanierBadge();
});

// Réagir aux changements du localStorage (autres onglets)
window.addEventListener('storage', () => {
  window.updatePanierBadge();
});

// Gestion Menu Mobile
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
});