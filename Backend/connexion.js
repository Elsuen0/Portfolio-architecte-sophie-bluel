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
    if (localStorage.getItem('token')) {
        const loginLink = document.querySelector('.lien_connexion li');
        loginLink.textContent = 'Log Out';
        loginLink.addEventListener('click', (event) => {
          event.preventDefault();
          // Supprimer le token du localStorage pour se déconnecter
          localStorage.removeItem('token');
          window.location.href = 'connexion.html';
        });
      }
  })
  .catch(error => {
    console.error(error);
    alert(error.message);
  });
});
