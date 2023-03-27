// Sélection des éléments HTML à manipuler
const loggedInBar = document.querySelector('.logged-in');
const filterBar = document.querySelector('.button-container');
const loginLink = document.querySelector('#login-link');

// Fonction pour vérifier si l'utilisateur est connecté ou non
function checkIfUserIsLoggedIn() {  
  if (localStorage.getItem('token')) { // Vérification de la présence d'un token dans le localStorage
    loggedInBar.style.display = 'flex'; // Si l'utilisateur est connecté, affichage de la barre de navigation correspondante
    filterBar.style.display='none';
    loginLink.addEventListener('click', handleLogout); // Ajout d'un écouteur d'événement au bouton de connexion pour permettre la déconnexion
    loginLink.innerHTML = '<li>logout</li>'; // Modification du texte du bouton de connexion pour afficher "logout"
  } else {
    loggedInBar.style.display = 'none'; // Masquage de la barre de navigation correspondante
    loginLink.removeEventListener('click', handleLogout); // Suppression de l'écouteur d'événement pour la déconnexion
    loginLink.addEventListener('click', redirectToLoginPage); // Ajout d'un écouteur d'événement pour rediriger vers la page de connexion 
    loginLink.innerHTML = '<li>login</li>'; // Modification du texte du bouton de connexion pour afficher "login"
  }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function handleLogout(event) {
  event.preventDefault(); // On empêche le comportement par défaut du lien
  localStorage.removeItem('token'); // Suppression du token dans le localStorage
  checkIfUserIsLoggedIn(); // Vérification du statut de connexion de l'utilisateur
}

// Fonction pour rediriger vers la page de connexion
function redirectToLoginPage(event) {
  event.preventDefault();
  window.location.href = 'connexion.html'; // Redirection vers la page de connexion
}

// Vérification du statut de connexion de l'utilisateur au chargement de la page
checkIfUserIsLoggedIn();
 