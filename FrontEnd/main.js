async function getProjects() { //Définition de la fonction asynchrone getProjects pour récupérer la liste des projets depuis l'API
  try {
    const response = await fetch('http://localhost:5678/api/works'); // Récupération de la réponse de l'API via fetch avec l'URL correspondant aux projets
    const projects = await response.json(); //Extraction des données JSON à partir de la réponse de l'API
    return projects;
  } catch (error) { //en cas d'erreur, affichage de l'erreur dans la console
    console.error(error);
  }
}

async function renderProjects(categoryId = '') { //Définition de la fonction asynchrone renderProjetcs pour afficher les projets dans la galerie
  const projects = await getProjects(); //Récupération de la liste complète des projets
  const categories = await getCategories(); //Récupération de la liste des catégories
  const galleryElement = document.querySelector('.gallery'); //Récupération de l'élement de gallery
  galleryElement.innerHTML = ''; //Vidage de la galerie pour éviter d'ajouter les projets en double

  // Filtrer les projets en fonction de la catégorie sélectionnée
  const filteredProjects = categoryId ? projects.filter(project => project.categoryId === categoryId) : projects;

  // Ajouter chaque projet à la galerie
  for (let i = 0; i < filteredProjects.length; i++) {
    const project = filteredProjects[i];
  
    const galleryItem = document.createElement('div'); //Création d'un élément div pour chaque projet à ajouter à la galerie
    galleryItem.classList.add('gallery-item');
  
    const imgElement = document.createElement('img'); //Création d'un élément img pour afficher l'image du projet
    imgElement.src = project.imageUrl;
    imgElement.alt = project.title;
  
    const h3Element = document.createElement('h3'); //Création d'un élément h3 pour afficher le titre du projet
    h3Element.textContent = project.title;
    galleryItem.appendChild(imgElement); //Ajout de l'élément img à l'élément div de chaque projet
    galleryItem.appendChild(h3Element); //ajout de l'élément h3 à l'élément div de chaque projet
    galleryElement.appendChild(galleryItem); //Ajout de l'élément div de chaque projet à la galerie 
  }
  
}

async function getCategories() { //Définition de la fonction asynchrone getCategories pour récupérer la liste des catégories depuis l'API
  try {
    const response = await fetch('http://localhost:5678/api/categories'); //Récupération de la réponse de l'API avec fetch
    const categories = await response.json(); //Extraction des données JSON à partir de la réponse de l'API
    return categories; //Retour des catégories extraites
  } catch (error) {
    console.error(error); //En cas d'erreur, affichage de l'erreur dans la console
  }
}

// Créer un nouvel objet Set pour stocker les boutons de catégorie
const categorySet = new Set();

// Ajouter un bouton "Tous"
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.addEventListener('click', () => renderProjects());
categorySet.add(allButton); //Ajoute le bouton "Tous" à l'ensemble des boutons de catégorie

// Créer des boutons pour chaque catégorie
async function createCategoryButtons() {
  const categories = await getCategories(); //Récupération des catégories depuis l'API (défini plus haut)
  for (let i = 0; i < categories.length; i++) { //parcourir chaque catégorie et créer un bouton correspondant
    const category = categories[i];
    const button = document.createElement('button');
    button.textContent = category.name;
    button.addEventListener('click', () => renderProjects(category.id)); //Ajouter un événement pour déclencher le filtrage des projets correpondants à la catégorie
    categorySet.add(button); //Ajouter le bouton à l'ensemble des boutons catégorie
  }
}

// Ajouter les boutons à la page
async function addButtonsToPage() {
  const buttonContainer = document.querySelector('.button-container'); // Récupérer la div avec la classe "button-container"
  await createCategoryButtons(); //Appeler la fonction pour créer les boutons
  buttonContainer.append(...categorySet); //Ajouter tous les boutons de catégorie à la div
  const galleryElement = document.querySelector('.gallery');
  galleryElement.before(buttonContainer);
}

// Appeler la fonction pour ajouter les boutons à la page
addButtonsToPage();

// Afficher tous les projets par défaut
renderProjects();

