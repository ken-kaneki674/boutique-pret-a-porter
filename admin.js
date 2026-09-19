// admin.js - Gestion CRUD des articles via l'API

const getApiUrl = () => {
  const hostname = window.location.hostname;

  // 1. Local Development (File or Localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'http://localhost:3000';
  }

  // 2. GitHub Pages (Demo Mode - Frontend Only)
  if (hostname.includes('github.io')) {
    return null;
  }

  // 3. Production (frontend et backend déployés séparément, ex: Vercel + Render)
  // Voir config.js pour renseigner l'URL du backend.
  return typeof PRODUCTION_API_URL !== 'undefined' ? PRODUCTION_API_URL : null;
};

const API_URL = getApiUrl();

const adminForm = document.getElementById('admin-form');
const titreInput = document.getElementById('titre');
const categorieInput = document.getElementById('categorie');
const prixInput = document.getElementById('prix');
const imageInput = document.getElementById('image');
const descriptionInput = document.getElementById('description');
const adminCatalogue = document.getElementById('admin-catalogue');
const submitBtn = adminForm ? adminForm.querySelector('button[type="submit"]') : null;

// Container for image preview
let imagePreviewContainer = document.getElementById('image-preview-container');
if (!imagePreviewContainer && imageInput) {
  imagePreviewContainer = document.createElement('div');
  imagePreviewContainer.id = 'image-preview-container';
  imagePreviewContainer.className = 'mt-2 mb-2 hidden';
  imageInput.parentNode.insertBefore(imagePreviewContainer, imageInput.nextSibling);
}

// Cancel button (created dynamically)
let cancelBtn = null;

let editId = null;

// Helper to toggle edit mode UI
function setEditMode(enable, article = null) {
  if (enable && article) {
    editId = article.id;
    if (submitBtn) submitBtn.textContent = 'Mettre à jour';

    // Create/Show Cancel Button
    if (!cancelBtn) {
      cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Annuler';
      cancelBtn.className = 'bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 md:col-span-2 mt-2';
      cancelBtn.onclick = () => {
        resetForm();
      };
      adminForm.appendChild(cancelBtn);
    } else {
      cancelBtn.style.display = 'inline-block';
    }

    // Show Image Preview
    if (imagePreviewContainer) {
      imagePreviewContainer.innerHTML = `<p class="text-sm text-gray-600 mb-1">Image actuelle:</p><img src="${API_URL}/${article.image}" class="h-20 object-contain border rounded">`;
      imagePreviewContainer.classList.remove('hidden');
    }

  } else {
    editId = null;
    if (submitBtn) submitBtn.textContent = 'Ajouter';
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (imagePreviewContainer) {
      imagePreviewContainer.innerHTML = '';
      imagePreviewContainer.classList.add('hidden');
    }
  }
}

function resetForm() {
  adminForm.reset();
  setEditMode(false);
}

// Récupérer les articles depuis l'API
async function fetchArticles() {
  if (API_URL === null) return []; // Mode démo : pas d'articles API
  try {
    const res = await fetch(`${API_URL}/api/articles`);
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Impossible de récupérer les articles', e);
    // On propage l'erreur pour pouvoir afficher l'alerte "Backend non lancé"
    throw e;
  }
}

// Charger et afficher les articles
async function loadAndRender() {
  // 1. Vérification du mode (Local vs En ligne)
  if (API_URL === null) {
    // Cas: En ligne (GitHub Pages)
    if (adminCatalogue) {
      adminCatalogue.innerHTML = `
        <div class="col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Mode Démo !</strong>
          <span class="block sm:inline">Le site est en ligne, mais le backend (base de données) ne peut pas tourner sur GitHub Pages. Les fonctionnalités d'ajout/modification sont désactivées.</span>
        </div>
      `;
    }
    // Désactiver le formulaire
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Désactivé en mode Démo";
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    const inputs = adminForm ? adminForm.querySelectorAll('input, select, textarea') : [];
    inputs.forEach(input => input.disabled = true);
    return;
  }

  // 2. Cas: Local (tentative de connexion au backend)
  try {
    const list = await fetchArticles();

    if (!adminCatalogue) return;
    adminCatalogue.innerHTML = '';

    if (list.length === 0) {
      adminCatalogue.innerHTML = '<p class="text-center text-gray-500 py-8">Aucun article trouvé.</p>';
      return;
    }

    list.forEach(a => {
      // Handle image path (absolute vs relative)
      const imgSrc = a.image ? (a.image.startsWith('http') ? a.image : `${API_URL}/${a.image}`) : `${API_URL}/images/article1.jpg`;

      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col';
      card.innerHTML = `
        <img src="${imgSrc}" alt="${a.nom}" class="w-full h-48 object-cover rounded mb-3" onerror="this.src='images/article1.jpg'">
        <h3 class="text-xl font-semibold text-gray-900">${a.nom || 'Article sans nom'}</h3>
        <p class="text-gray-600 mb-2">${a.description || 'Pas de description'}</p>
        <p class="font-bold mb-3 text-indigo-600">Prix: ${(parseFloat(a.prix) || 0).toFixed(0)} FCFA</p>
        <div class="mt-auto flex gap-2">
          <button class="edit-article bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded font-medium transition-colors" data-id="${a.id}">Modifier</button>
          <button class="delete-article bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-medium transition-colors" data-id="${a.id}">Supprimer</button>
        </div>
      `;
      adminCatalogue.appendChild(card);
    });

  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    if (adminCatalogue) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '';
      const hint = isLocal
        ? '<p class="mt-2 text-sm">👉 Lancez le fichier <code>start_website.bat</code> ou ouvrez un terminal dans le dossier <code>backend</code> et faites <code>npm start</code>.</p>'
        : '<p class="mt-2 text-sm">👉 Vérifiez que <code>PRODUCTION_API_URL</code> dans <code>config.js</code> pointe vers un backend déployé et accessible.</p>';
      adminCatalogue.innerHTML = `
        <div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Backend non détecté !</strong>
          <span class="block sm:inline">Le serveur backend (${API_URL}) ne répond pas.</span>
          ${hint}
        </div>
      `;
    }
  }
}

// Gestionnaire de soumission du formulaire
if (adminForm) {
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation des champs requis
    if (!titreInput.value.trim() || !prixInput.value.trim()) {
      alert('Le nom et le prix sont obligatoires.');
      return;
    }

    const formData = new FormData();
    formData.append('nom', titreInput.value.trim());
    formData.append('categorie', categorieInput.value.trim() || 'tous');
    formData.append('prix', prixInput.value.trim());
    formData.append('description', descriptionInput.value.trim() || '');

    if (imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
    }

    try {
      let res;
      if (editId) {
        // Mise à jour
        res = await fetch(`${API_URL}/api/articles/${editId}`, {
          method: 'PUT',
          body: formData
        });
        if (!res.ok) throw new Error(`Échec mise à jour: ${res.status}`);
        alert('Article mis à jour avec succès !');
        resetForm();
      } else {
        // Création
        res = await fetch(`${API_URL}/api/articles`, {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error(`Échec création: ${res.status}`);
        alert('Article créé avec succès !');
        resetForm(); // Reset only on success creation
      }

      await loadAndRender();
    } catch (err) {
      console.error('Erreur lors de l\'opération:', err);
      alert('Erreur lors de l\'opération: ' + err.message);
    }
  });
}

// Gestionnaire d'événements pour les boutons modifier/supprimer
if (adminCatalogue) {
  adminCatalogue.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-article');
    const delBtn = e.target.closest('.delete-article');

    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const res = await fetch(`${API_URL}/api/articles/${id}`);
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

        const art = await res.json();

        // Populate form
        titreInput.value = art.nom || '';
        categorieInput.value = art.categorie || '';
        prixInput.value = art.prix || '';
        descriptionInput.value = art.description || '';
        imageInput.value = ''; // Reset file input

        setEditMode(true, art);

        // Scroll vers le formulaire
        adminForm.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        console.error('Impossible de charger l\'article:', err);
        alert('Impossible de charger l\'article pour modification');
      }
    } else if (delBtn) {
      const id = delBtn.dataset.id;
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

      try {
        const res = await fetch(`${API_URL}/api/articles/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error(`Échec suppression: ${res.status}`);

        alert('Article supprimé avec succès !');
        await loadAndRender();
        // If we were editing the deleted item, reset the form
        if (editId == id) {
          resetForm();
        }
      } catch (err) {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  });
}

// Chargement initial
loadAndRender();


