/**
 * Editor Controls Module
 * Gestisce slider e controlli per scala e rotazione del logo
 */

export class EditorControls {
    constructor() {
        this.scaleSlider = document.getElementById('logo-scale');
        this.rotationSlider = document.getElementById('logo-rotation');
        this.scaleValue = document.getElementById('scale-value');
        this.rotationValue = document.getElementById('rotation-value');
    }

    updateLogoScale(scale) {
        // Connect with 3D editor to update logo scale
        if (typeof window.updateLogoScale === 'function') {
            window.updateLogoScale(scale);
        }
    }

    updateLogoRotation(rotation) {
        // Connect with 3D editor to update logo rotation
        if (typeof window.updateLogoRotation === 'function') {
            window.updateLogoRotation(rotation);
        }
    }

    init() {
        // Scale slider
        if (this.scaleSlider && this.scaleValue) {
            this.scaleSlider.addEventListener('input', (e) => {
                const value = Math.round(e.target.value * 100);
                this.scaleValue.textContent = `${value}%`;
                this.updateLogoScale(e.target.value);
            });
        }

        // Rotation slider
        if (this.rotationSlider && this.rotationValue) {
            this.rotationSlider.addEventListener('input', (e) => {
                this.rotationValue.textContent = `${e.target.value}°`;
                this.updateLogoRotation(e.target.value);
            });
        }
    }
}
