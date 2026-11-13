const showPassword = document.querySelector('#show-password');
const passwordInput = document.querySelector('#password');

if (showPassword && passwordInput) {
    showPassword.addEventListener('click', function () {
        const isHidden = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
        this.classList.toggle('ph-eye-slash', !isHidden);
        this.classList.toggle('ph-eye', isHidden);
    });
}
