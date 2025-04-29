// auth.js

const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginTab.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginTab.classList.add('text-blue-600', 'border-blue-600');
  loginTab.classList.remove('text-gray-600');
  registerTab.classList.remove('text-blue-600', 'border-blue-600');
  registerTab.classList.add('text-gray-600');
});

registerTab.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  registerTab.classList.add('text-blue-600', 'border-blue-600');
  registerTab.classList.remove('text-gray-600');
  loginTab.classList.remove('text-blue-600', 'border-blue-600');
  loginTab.classList.add('text-gray-600');
});

window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
  document.body.classList.remove('opacity-0');
  document.body.classList.add('opacity-100');
});
