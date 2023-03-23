const loggedInBar = document.querySelector('.logged-in');
const filterBar = document.querySelectorAll('.button-container');

function checkIfUserIsLoggedIn() {
  if (localStorage.getItem('token')) {
    loggedInBar.style.display = 'flex';
    filterBar.style.display = 'none';
  } else {
    loggedInBar.style.display = 'none';
    filterBar.style.display = 'flex'
  }
}

checkIfUserIsLoggedIn(); // Vérifier si l'utilisateur est connecté lors du chargement de la page