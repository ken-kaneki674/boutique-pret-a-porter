// app.js - Utilitaires globaux pour l'application

// Met à jour le badge du panier dans la navbar
window.updatePanierBadge = function () {
  try {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const count = panier.reduce((total, article) => total + (parseInt(article.quantite) || 0), 0);
    const badge = document.getElementById('panier-count');

    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.classList.remove('hidden');
        badge.classList.add('animate-pulse');
      } else {
        badge.textContent = '';
        badge.classList.add('hidden');
        badge.classList.remove('animate-pulse');
      }
    }
  } catch (e) {
    console.error('Erreur lors de la mise à jour du badge panier:', e);
  }
};

// Gestion du loader et affichage initial
if (!window.loaderHandled) {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
    document.body.classList.remove('opacity-0');
    document.body.classList.add('opacity-100');

    // Mettre à jour le badge du panier
    window.updatePanierBadge();
  });
  window.loaderHandled = true;
}

// Réagir aux changements du localStorage (synchronisation entre onglets)
window.addEventListener('storage', (e) => {
  if (e.key === 'panier') {
    window.updatePanierBadge();
  }
});

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      // Fermer le menu en cliquant ailleurs
      const closeMenu = (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          document.removeEventListener('click', closeMenu);
        }
      };
      if (!mobileMenu.classList.contains('hidden')) {
        setTimeout(() => document.addEventListener('click', closeMenu), 1);
      }
    });
  }

  // Gestion du bouton "Retour en haut"
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        backToTopBtn.classList.add('opacity-0', 'translate-y-4');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Fonction utilitaire pour formater les prix
window.formatPrice = function(price) {
  return parseFloat(price || 0).toFixed(2) + ' €';
};

// Fonction utilitaire pour tronquer le texte
window.truncateText = function(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
