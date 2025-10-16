/**
 * Editor Upload Module
 * Gestisce drag & drop e upload di file per l'editor 3D
 */

import { showNotification } from '../ui/notifications.js';
import { trackEvent } from '../../utils/analytics.js';

export class EditorUpload {
    constructor() {
        this.uploadZone = document.getElementById('upload-drop-zone');
        this.fileInput = document.getElementById('panel-input');
    }

    handleFileUpload(file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            showNotification('⚠️ Seleziona un file immagine valido', 'warning');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('⚠️ Il file è troppo grande (max 5MB)', 'warning');
            return;
        }

        showNotification('✅ Logo caricato! Clicca sugli slot dell\'ombrello per applicarlo', 'success');

        // Track file upload
        trackEvent('logo_uploaded', {
            category: 'editor',
            label: 'file_uploaded',
            value: Math.round(file.size / 1024) // Size in KB
        });

        // Integrate with 3D editor to apply the texture
        if (typeof window.applyCustomTexture === 'function') {
            window.applyCustomTexture(file);
        }
    }

    init() {
        if (!this.uploadZone || !this.fileInput) return;

        // Drag and drop functionality
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });

        this.uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
        });

        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        this.uploadZone.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }
}

// Global drag and drop handlers (legacy support)
export function setupGlobalDragHandlers() {
    window.dropHandler = function (ev) {
        console.log('File(s) dropped');
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach((item, i) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    console.log(`File ${i}:`, file.name);

                    // Trigger file input change for 3D editor
                    const fileInput = document.getElementById('panel-input');
                    if (fileInput) {
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        fileInput.files = dt.files;
                        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
        }
    };

    window.dragoverHandler = function (ev) {
        console.log('File(s) in drop zone');
        ev.preventDefault();
    };
}
