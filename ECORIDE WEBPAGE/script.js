// Select the DOM elements
const showPassword = document.querySelector('#show-password');
const passwordInput = document.querySelector('#password');

// Listen for a click event on the button
showPassword.addEventListener('click', function () {
    this.classList.toggle("ph-eye-slash");
    // Check the current type attribute
    const isHidden = passwordInput.getAttribute('type') === 'password';
    
    // Toggle the type attribute
    passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
    
});
