/**
 * Form Validation Module
 * Gestisce la validazione dei form
 */

export function validateForm(form) {
    let isValid = true;

    form.querySelectorAll('[required]').forEach(input => {
        const value = input.value.trim();

        // Check if empty
        if (!value) {
            isValid = false;
            input.style.outline = '3px solid #ff9a8b';
            return;
        }

        // Check email format
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            input.style.outline = '3px solid #ff9a8b';
            return;
        }

        // Valid input
        input.style.outline = 'none';
    });

    return isValid;
}

export function collectFormData(form) {
    return [...new FormData(form).entries()].reduce(
        (obj, [key, value]) => {
            obj[key] = value;
            return obj;
        },
        {}
    );
}
