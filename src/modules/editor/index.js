/**
 * Editor Module - Barrel Export
 */

import { EditorUpload, setupGlobalDragHandlers } from './upload.js';
import { EditorTemplates, TEMPLATES } from './templates.js';
import { EditorControls } from './controls.js';

export { EditorUpload, setupGlobalDragHandlers } from './upload.js';
export { EditorTemplates, TEMPLATES } from './templates.js';
export { EditorControls } from './controls.js';

export function initEditor() {
    const upload = new EditorUpload();
    upload.init();

    const templates = new EditorTemplates();
    templates.init();

    const controls = new EditorControls();
    controls.init();

    // Setup global drag handlers for legacy support
    setupGlobalDragHandlers();
}
