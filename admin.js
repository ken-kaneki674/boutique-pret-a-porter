const articlesList = document.getElementById('articles-list');
const addArticleForm = document.getElementById('add-article-form');

// Charger articles depuis localStorage
let articles = JSON.parse(localStorage.getItem('adminArticles')) || [];

// Fonction pour afficher les articles
function renderArticles() {
  articlesList.innerHTML = "";
  articles.forEach(article => {
    const articleCard = document.createElement('div');
    articleCard.className = 'bg-white p-4 rounded shadow flex flex-col items-center';

    articleCard.innerHTML = `
      <img src="${article.image}" alt="${article.name}" class="w-full h-48 object-cover rounded mb-4">
      <h4 class="text-xl font-semibold mb-2">${article.name}</h4>
      <p class="mb-4">Prix : ${article.price}FCFA</p>
      <div class="flex space-x-4">
        <button onclick="editArticle(${article.id})" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Modifier</button>
        <button onclick="deleteArticle(${article.id})" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Supprimer</button>
      </div>
    `;

    articlesList.appendChild(articleCard);
  });
}

// Ajouter un article via formulaire
addArticleForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('article-name').value;
  const price = document.getElementById('article-price').value;
  const image = document.getElementById('article-image').value;

  const newArticle = {
    id: Date.now(), // nouvel ID unique
    name,
    price,
    image
  };

  articles.push(newArticle);
  localStorage.setItem('adminArticles', JSON.stringify(articles));
  renderArticles();
  addArticleForm.reset();
});

// Supprimer un article
function deleteArticle(id) {
  articles = articles.filter(article => article.id !== id);
  localStorage.setItem('adminArticles', JSON.stringify(articles));
  renderArticles();
}

// Modifier un article
function editArticle(id) {
  const article = articles.find(a => a.id === id);
  if (article) {
    document.getElementById('article-name').value = article.name;
    document.getElementById('article-price').value = article.price;
    document.getElementById('article-image').value = article.image;

    deleteArticle(id); // supprime l'ancien pour enregistrer la nouvelle version
  }
}

// Charger les articles dès que la page est ouverte
renderArticles();
