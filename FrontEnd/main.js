async function getProjects() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error(error);
  }
}

async function renderProjects(categoryId = '') {
  const projects = await getProjects();
  const categories = await getCategories();
  const galleryElement = document.querySelector('.gallery');
  galleryElement.innerHTML = '';

  // Filtrer les projets en fonction de la catégorie sélectionnée
  const filteredProjects = categoryId ? projects.filter(project => project.categoryId === categoryId) : projects;

  // Ajouter chaque projet à la galerie
  for (let i = 0; i < filteredProjects.length; i++) {
    const project = filteredProjects[i];
  
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
  
    const imgElement = document.createElement('img');
    imgElement.src = project.imageUrl;
    imgElement.alt = project.title;
  
    const h3Element = document.createElement('h3');
    h3Element.textContent = project.title;
  
    galleryItem.appendChild(imgElement);
    galleryItem.appendChild(h3Element);
    galleryElement.appendChild(galleryItem);
  }
  
}

async function getCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error(error);
  }
}

// Créer un ensemble de catégories disponibles
const categorySet = new Set();

// Ajouter un bouton "Tous"
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.addEventListener('click', () => renderProjects());
categorySet.add(allButton);

// Créer des boutons pour chaque catégorie
async function createCategoryButtons() {
  const categories = await getCategories();
  const button = document.createElement('button');

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    button.textContent = category.name;
    button.addEventListener('click', () => renderProjects(category.id));
    categorySet.add(button);
  }

}

// Ajouter les boutons à la page
async function addButtonsToPage() {
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
  await createCategoryButtons();
  buttonContainer.append(...categorySet);
  const galleryElement = document.querySelector('.gallery');
  galleryElement.before(buttonContainer);
}

// Appeler la fonction pour ajouter les boutons à la page
addButtonsToPage();

// Afficher tous les projets par défaut
renderProjects();
