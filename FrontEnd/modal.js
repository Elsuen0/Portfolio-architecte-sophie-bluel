let modal = null

const container = document.querySelector('.gallery-modal')
const container2 = document.querySelector('.gallery-modal2')
const title = document.querySelector('.modal-wrapper h2')
const previousButton = document.querySelector('.js-modal-previous')

import { renderProjects } from "./main.js"

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    previousModal(e)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
    
})

window.addEventListener('keydown', function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

function hideElement(e) { 
  e.preventDefault()
  container.style.display = 'none';
  container2.style.display = 'flex';
  previousButton.style.display = null
  title.textContent = 'Ajout Photo';
}

function previousModal(e) {
  e.preventDefault()
  container.style.display = null
  container2.style.display = 'none'
  previousButton.style.display = 'none'
  title.textContent = 'Galerie photo'
}

document.querySelector('.button-add-photo').addEventListener('click', hideElement)

previousButton.addEventListener('click', previousModal)

async function displayProjects() { // Fonction asynchrone pour afficher les projets dans la galerie
  try {
    const response = await fetch('http://localhost:5678/api/works'); // Récupération des projets via l'API
    const projects = await response.json();
    const galleryModal = document.querySelector('.gallery-modal'); // Sélection de la galerie dans le DOM
    galleryModal.innerHTML = ''; // Nettoyage de la galerie
    projects.forEach(project => { // Boucle pour chaque projet dans la liste des projets
      const galleryItem = document.createElement('div'); // Création de la div pour chaque projet
      galleryItem.classList.add('img-modal');

      const imgElement = document.createElement('img'); // Ajout de l'image du projet dans la div
      imgElement.src = project.imageUrl;
      imgElement.alt = project.title;
      galleryItem.appendChild(imgElement);

      // Ajout du bouton de suppression
      const deleteIcon = document.createElement('i'); // ajout de l'icone
      deleteIcon.classList.add('fas', 'fa-trash-alt');

      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('type', 'button');
      deleteButton.appendChild(deleteIcon);
      deleteButton.addEventListener('click', async (event) => { //ajout de l'événement clic pour le bouton de suppression 
        event.preventDefault();
        try {
          const token = localStorage.getItem('token'); // Récupération du token d'identification
          const deleteResponse = await fetch(`http://localhost:5678/api/works/${project.id}`, { // Appel de l'API pour supprimer le projet correspondant à l'id du projet avec la method delete
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (deleteResponse.ok) {
            // Supprime le projet du DOM
            galleryModal.removeChild(galleryItem);
            renderProjects(); // Actualisation de la galerie après suppression 
            // Supprime le projet de la liste des projets
            const projectIndex = projects.findIndex(p => p.id === project.id);
            if (projectIndex > -1) {
              projects.splice(projectIndex, 1);
            }
          }
          
        } catch (error) {
          console.error(error);
        }
      });
      // Ajout du bouton de suppression à la div du projet
      galleryItem.appendChild(deleteButton);

      //Ajout de la div du projet à la galerie
      galleryModal.appendChild(galleryItem);
    });
  } catch (error) {
    console.error(error);
  }
}
//Appel de la fonction pour afficher les projets
displayProjects();
  