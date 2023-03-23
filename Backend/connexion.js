const loginForm = document.querySelector('.login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêcher la soumission du formulaire

  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;

  // Appeler l'API pour la connexion
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => {
    if (response.ok) {
      // Si la connexion réussit, stocker le token
      response.json().then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
      });
    } else {
      // Si la connexion échoue, afficher le message d'erreur
      throw new Error('e-mail ou mot de passe incorrect');
    }

  })
  .catch(error => {
    console.error(error);
    alert(error.message);
  });
});

const loggedInBar = document.querySelector('.logged-in');
const loginLink = document.getElementById('login-link');
const loginLinkText = document.querySelector('#login-link li');
const filterBar = document.querySelector('.button-container');

function checkIfUserIsLoggedIn() {
  if (localStorage.getItem('token')) {
    loggedInBar.style.display = 'flex';
    loginLinkText.textContent = 'Log out';
    filterBar.style.display = 'none';
  } else {
    loggedInBar.style.display = 'none';
    loginLinkText.textContent = 'Login';
    filterBar.style.display = 'flex'
  }
}

checkIfUserIsLoggedIn(); // Vérifier si l'utilisateur est connecté lors du chargement de la page
