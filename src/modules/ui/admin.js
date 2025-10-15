/**
 * Admin Module
 * Gestisce il login admin per l'editor
 */

let admin = false;
let password = "";

function passwordInput(event) {
    password = event.target.value;
}

function checkAdmin() {
    console.log(password);
    if (password === "password") {
        admin = true;
        const panelInput = document.getElementById("panel-input");
        const passwordInput = document.getElementById("admin-password-input");

        if (panelInput) {
            panelInput.removeAttribute("disabled");
        }

        if (passwordInput) {
            passwordInput.value = "";
        }

        const adminModalEl = document.getElementById('enableAdminModal');
        if (adminModalEl && typeof bootstrap !== 'undefined') {
            const adminModal = bootstrap.Modal.getInstance(adminModalEl);
            if (adminModal) {
                password = "";
                adminModal.hide();
            }
        }
    }
}

export function initAdmin() {
    const passwordInputEl = document.getElementById('admin-password-input');
    const sendButton = document.getElementById('admin-password-send');

    if (passwordInputEl) {
        passwordInputEl.addEventListener('input', passwordInput);
    }

    if (sendButton) {
        sendButton.addEventListener('click', checkAdmin);
    }
}

export { admin, password };
