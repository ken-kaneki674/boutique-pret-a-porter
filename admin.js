// admin.js — gestion CRUD via l'API /api/articles

const adminForm = document.getElementById('admin-form');
const titreInput = document.getElementById('titre');
const categorieInput = document.getElementById('categorie');
const prixInput = document.getElementById('prix');
const imageInput = document.getElementById('image');
const descriptionInput = document.getElementById('description');
const adminCatalogue = document.getElementById('admin-catalogue');

let editId = null;

async function fetchArticles() {
  try {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (e) {
    console.error('Impossible de récupérer les articles', e);
    return [];
  }
}

async function loadAndRender() {
  const list = await fetchArticles();
  adminCatalogue.innerHTML = '';
  list.forEach(a => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col';
    card.innerHTML = `
      <img src="${a.image || 'images/article1.jpg'}" alt="${a.nom}" class="w-full h-48 object-cover rounded mb-3">
      <h3 class="text-xl font-semibold">${a.nom}</h3>
      <p class="text-gray-600 mb-2">${a.description || ''}</p>
      <p class="fw-bold mb-3">Prix: ${a.prix} €</p>
      <div class="mt-auto flex gap-2">
        <button class="edit-article btn btn-warning" data-id="${a.id}">Modifier</button>
        <button class="delete-article btn btn-danger" data-id="${a.id}">Supprimer</button>
      </div>
    `;
    adminCatalogue.appendChild(card);
  });
}

adminForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('nom', titreInput.value);
  formData.append('categorie', categorieInput.value);
  formData.append('prix', prixInput.value);
  formData.append('description', descriptionInput.value);

  if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    if (editId) {
      // update
      const res = await fetch(`/api/articles/${editId}`, {
        method: 'PUT',
        body: formData // pas de Content-Type manuel !
      });
      if (!res.ok) throw new Error('Échec mise à jour');
      editId = null;
    } else {
      // create
      const res = await fetch('/api/articles', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Échec création');
    }
    adminForm.reset();
    await loadAndRender();
  } catch (err) {
    alert('Erreur lors de l\'opération: ' + err.message);
  }
});

// Delegation pour edit/delete
adminCatalogue.addEventListener('click', async (e) => {
  const editBtn = e.target.closest('.edit-article');
  const delBtn = e.target.closest('.delete-article');
  if (editBtn) {
    const id = editBtn.dataset.id;
    try {
      const res = await fetch(`/api/articles/${id}`);
      const art = await res.json();
      titreInput.value = art.nom || '';
      categorieInput.value = art.categorie || '';
      prixInput.value = art.prix || '';
      imageInput.value = ''; // Reset file input
      descriptionInput.value = art.description || '';
      editId = art.id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Impossible de charger l\'article');
    }
  } else if (delBtn) {
    const id = delBtn.dataset.id;
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Échec suppression');
      await loadAndRender();
    } catch (err) {
      alert('Erreur suppression: ' + err.message);
    }
  }
});

// Initial load
loadAndRender();

