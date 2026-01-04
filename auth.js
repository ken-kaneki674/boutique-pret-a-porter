// auth.js - Gestion de l'authentification (simulation côté client)

const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Vérifier si les éléments existent avant d'ajouter les événements
if (loginTab && registerTab && loginForm && registerForm) {
  loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('text-indigo-600', 'border-indigo-600');
    loginTab.classList.remove('text-gray-400');
    registerTab.classList.remove('text-indigo-600', 'border-indigo-600');
    registerTab.classList.add('text-gray-400');
  });

  registerTab.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    registerTab.classList.add('text-indigo-600', 'border-indigo-600');
    registerTab.classList.remove('text-gray-400');
    loginTab.classList.remove('text-indigo-600', 'border-indigo-600');
    loginTab.classList.add('text-gray-400');
  });
}

// Gestion du loader (éviter les doublons avec app.js)
if (!window.loaderHandled) {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    document.body.classList.remove('opacity-0');
    document.body.classList.add('opacity-100');
  });
  window.loaderHandled = true;
}
