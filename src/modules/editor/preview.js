/**
 * Editor Preview Module
 * Gestisce la modalità preview full-screen
 */

import { trackEvent } from '../../utils/analytics.js';

export class EditorPreview {
    constructor() {
        this.previewBtn = document.getElementById('preview-button');
    }

    showFullPreview() {
        // Create preview modal or fullscreen view
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
      <div class="preview-content">
        <div class="preview-header">
          <h3>🎯 Anteprima Ombrello Brellò</h3>
          <button class="close-preview">&times;</button>
        </div>
        <div class="preview-body">
          <div class="preview-360">
            <!-- 3D preview would be rendered here -->
            <p>Visualizzazione 360° del tuo ombrello personalizzato</p>
          </div>
          <div class="preview-info">
            <h4>Dettagli pubblicità:</h4>
            <ul>
              <li>✅ Logo applicato su 18 spazi</li>
              <li>✅ Visibilità garantita 3-4 mesi</li>
              <li>✅ Copertura mobile cittadina</li>
              <li>✅ QR code per tracking conversioni</li>
            </ul>
            <button class="btn btn--yellow">📧 Richiedi preventivo</button>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-preview').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    init() {
        if (!this.previewBtn) return;

        this.previewBtn.addEventListener('click', () => {
            this.showFullPreview();

            // Track preview usage
            trackEvent('preview_full', {
                category: 'editor',
                label: 'preview_clicked'
            });
        });
    }
}
