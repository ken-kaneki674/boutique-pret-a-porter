const articles = [
    { id: 1, name: "T-shirt Bleu", price: 20 },
    { id: 2, name: "Jeans Noir", price: 40 },
  ];
  
  const articleList = document.getElementById("articles");
  
  function displayArticles() {
    articleList.innerHTML = '';
    articles.forEach(article => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("p-4", "bg-white", "shadow-lg", "rounded-lg");
  
      articleDiv.innerHTML = `
        <h3 class="text-lg font-bold">${article.name}</h3>
        <p class="text-gray-700">Prix: ${article.price} FCFA</p>
      `;
  
      articleList.appendChild(articleDiv);
    });
  }
  
  displayArticles();
  
  window.addEventListener('load', () => {
    document.getElementById('loader').style.display = 'none';
    document.body.classList.remove('opacity-0');
    document.body.classList.add('opacity-100');
  });
  