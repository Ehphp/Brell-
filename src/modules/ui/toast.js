/**
 * Toast Module
 * Gestisce i messaggi toast
 */

export function toast(msg) {
    const box = document.getElementById('toast');
    if (!box) return;

    box.textContent = msg;
    box.parentElement.classList.add('toast--show');

    setTimeout(() => {
        box.parentElement.classList.remove('toast--show');
    }, 2600);
}
