let modal = null
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

async function displayProjects() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const projects = await response.json();
    const galleryModal = document.querySelector('.gallery-modal');
    galleryModal.innerHTML = '';
    projects.forEach(project => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('img-modal');
      const imgElement = document.createElement('img');
      imgElement.src = project.imageUrl;
      imgElement.alt = project.title;
      galleryItem.appendChild(imgElement);

      // Ajout du bouton de suppression
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fas', 'fa-trash-alt');
      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('type', 'button');
      deleteButton.appendChild(deleteIcon);
      deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          const token = localStorage.getItem('token');
          const deleteResponse = await fetch(`http://localhost:5678/api/works/${project.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (deleteResponse.ok) {
            // Supprime le projet du DOM
            galleryModal.removeChild(galleryItem);
            renderProjects();
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
      
      galleryItem.appendChild(deleteButton);

      galleryModal.appendChild(galleryItem);
    });
  } catch (error) {
    console.error(error);
  }
}

displayProjects();


  