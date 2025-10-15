/**
 * Editor Module - Barrel Export
 */

import { EditorUpload, setupGlobalDragHandlers } from './upload.js';
import { EditorTemplates, TEMPLATES } from './templates.js';
import { EditorControls } from './controls.js';
import { EditorPreview } from './preview.js';

export { EditorUpload, setupGlobalDragHandlers } from './upload.js';
export { EditorTemplates, TEMPLATES } from './templates.js';
export { EditorControls } from './controls.js';
export { EditorPreview } from './preview.js';

export function initEditor() {
    const upload = new EditorUpload();
    upload.init();

    const templates = new EditorTemplates();
    templates.init();

    const controls = new EditorControls();
    controls.init();

    const preview = new EditorPreview();
    preview.init();

    // Setup global drag handlers for legacy support
    setupGlobalDragHandlers();
}
