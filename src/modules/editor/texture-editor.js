import shapeMasks from "./shape-masks.json";

/**
 * Texture Editor Modal
 * Gestisce l'overlay di editing per crop / zoom / posizionamento del logo.
 */

const CANVAS_SIZE = 1024;
const MAX_SCALE_MULTIPLIER = 4;
const MIN_ZOOM_RATIO = 0.25;
const DEFAULT_SHAPE = "circle";
const ALLOWED_SHAPES = ["circle", "crown", "segment"];
const DEFAULT_FILL_MODE = "fit";
const ALLOWED_FILL_MODES = ["fit", "cover", "repeat"];

const SHAPE_GEOMETRY = buildShapeGeometry(shapeMasks);

function uvToCanvas(u, v) {
    return {
        x: u * CANVAS_SIZE,
        y: (1 - v) * CANVAS_SIZE
    };
}

function buildShapeGeometry(masks) {
    const geometry = {};

    Object.entries(masks || {}).forEach(([key, value]) => {
        if (!value || !Array.isArray(value.triangles) || value.triangles.length === 0) {
            return;
        }

        const path = new Path2D();
        const pixelTriangles = [];
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        value.triangles.forEach((triangle) => {
            const points = [];
            for (let i = 0; i < triangle.length; i += 2) {
                const { x, y } = uvToCanvas(triangle[i], triangle[i + 1]);
                points.push([x, y]);
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }

            if (points.length === 3) {
                path.moveTo(points[0][0], points[0][1]);
                path.lineTo(points[1][0], points[1][1]);
                path.lineTo(points[2][0], points[2][1]);
                path.closePath();
                pixelTriangles.push(points);
            }
        });

        const uvBounds = value.uvBounds || { minU: 0, maxU: 1, minV: 0, maxV: 1 };
        const pixelBounds = {
            minX: uvBounds.minU * CANVAS_SIZE,
            maxX: uvBounds.maxU * CANVAS_SIZE,
            minY: (1 - uvBounds.maxV) * CANVAS_SIZE,
            maxY: (1 - uvBounds.minV) * CANVAS_SIZE
        };

        let finalPath = path;
        if (key === "segment") {
            const transform = new DOMMatrix();
            transform.translateSelf(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
            transform.scaleSelf(1, -1);
            transform.translateSelf(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2);
            const flipped = new Path2D();
            flipped.addPath(path, transform);
            finalPath = flipped;
        }

        geometry[key] = {
            mesh: value.mesh,
            path: finalPath,
            pixelTriangles,
            bounds: {
                minX,
                maxX,
                minY,
                maxY
            },
            pixelBounds
        };
    });

    return geometry;
}

class TextureEditorModal {
    constructor() {
        this.backdrop = null;
        this.canvasWrapper = null;
        this.canvas = null;
        this.ctx = null;
        this.zoomSlider = null;
        this.zoomLabel = null;
        this.hintLabel = null;
        this.shapeButtons = [];
        this.fillButtons = [];
        this.image = null;
        this.resolve = null;

        this.isDragging = false;
        this.lastPointer = { x: 0, y: 0 };

        this.scale = 1;
        this.baseScale = 1;
        this.scaleFit = 1;
        this.scaleCover = 1;
        this.minScaleLimit = 0.1;
        this.maxScale = MAX_SCALE_MULTIPLIER;
        this.imageX = 0;
        this.imageY = 0;

        this.cropShape = DEFAULT_SHAPE;
        this.fillMode = DEFAULT_FILL_MODE;
        this.previousActiveElement = null;
        this.geometryCache = SHAPE_GEOMETRY;

        this.boundPointerDown = this.onPointerDown.bind(this);
        this.boundPointerMove = this.onPointerMove.bind(this);
        this.boundPointerUp = this.onPointerUp.bind(this);
        this.boundKeydown = this.onKeyDown.bind(this);
        this.boundZoomInput = this.onZoomInput.bind(this);
    }

    async openFromFile(file) {
        const dataUrl = await this.readFileAsDataUrl(file);
        if (!dataUrl) return null;
        return this.openWithDataUrl(dataUrl, file.name);
    }

    openWithDataUrl(dataUrl, name = "logo") {
        this.close();

        return new Promise((resolve) => {
            this.resolve = resolve;
            this.cropShape = DEFAULT_SHAPE;
            this.fillMode = DEFAULT_FILL_MODE;
            this.createModal(name);
            this.loadImage(dataUrl);
            this.draw();
        });
    }

    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        }).catch((err) => {
            console.error("Errore nella lettura del file per il texture editor:", err);
            return null;
        });
    }

    createModal(name) {
        const safeName = this.escapeHtml(name || "logo");
        const backdrop = document.createElement("div");
        backdrop.className = "texture-editor-backdrop";
        backdrop.setAttribute("role", "dialog");
        backdrop.setAttribute("aria-modal", "true");

        this.previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        document.body.appendChild(backdrop);
        document.body.classList.add("texture-editor-open");
        backdrop.innerHTML = `
            <div class="texture-editor-modal">
                <header class="texture-editor-header">
                    <div>
                        <h3>Regola il tuo logo</h3>
                        <p class="texture-editor-subtitle">${safeName}</p>
                    </div>
                    <button class="texture-editor-close" type="button" aria-label="Chiudi">&times;</button>
                </header>
                <div class="texture-editor-content">
                    <div class="texture-editor-canvas-wrapper">
                        <canvas class="texture-editor-canvas" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
                    </div>
                    <div class="texture-editor-controls">
                        <div class="texture-editor-control-group">
                            <div class="texture-editor-label-row">
                                <span class="texture-editor-label">Zoom</span>
                                <span class="texture-editor-hint">Trascina o usa lo slider</span>
                            </div>
                            <div class="texture-editor-zoom-row">
                                <input id="texture-editor-zoom" type="range" min="0" max="100" value="0" step="1">
                                <span class="texture-editor-zoom-value">100%</span>
                            </div>
                        </div>
                        <div class="texture-editor-control-group compact">
                            <span class="texture-editor-label">Modalita riempimento</span>
                            <div class="texture-editor-pill-group">
                                <button type="button" class="texture-editor-fill-btn is-active" data-fill="fit" aria-pressed="true">
                                    <span class="texture-editor-fill-title">Adatta</span>
                                    <span class="texture-editor-fill-sub">Mostra tutto</span>
                                </button>
                                <button type="button" class="texture-editor-fill-btn" data-fill="cover" aria-pressed="false">
                                    <span class="texture-editor-fill-title">Copri</span>
                                    <span class="texture-editor-fill-sub">Nessuno spazio vuoto</span>
                                </button>
                                <button type="button" class="texture-editor-fill-btn" data-fill="repeat" aria-pressed="false">
                                    <span class="texture-editor-fill-title">Ripeti</span>
                                    <span class="texture-editor-fill-sub">Piastrellatura</span>
                                </button>
                            </div>
                        </div>
                        <div class="texture-editor-control-group compact">
                            <span class="texture-editor-label">Forma ritaglio</span>
                            <div class="texture-editor-pill-group">
                                <button type="button" class="texture-editor-shape-btn is-active" data-shape="circle" aria-pressed="true">
                                    <span class="texture-editor-shape-icon" aria-hidden="true">&bigcirc;</span>
                                    <span class="texture-editor-shape-label">Cerchio</span>
                                </button>
                                <button type="button" class="texture-editor-shape-btn" data-shape="crown" aria-pressed="false">
                                    <span class="texture-editor-shape-icon" aria-hidden="true">&#9678;</span>
                                    <span class="texture-editor-shape-label">Corona</span>
                                </button>
                                <button type="button" class="texture-editor-shape-btn" data-shape="segment" aria-pressed="false">
                                    <span class="texture-editor-shape-icon" aria-hidden="true">&#9652;</span>
                                    <span class="texture-editor-shape-label">Spicchio</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="texture-editor-footer">
                    <button class="texture-editor-button texture-editor-button--ghost" type="button" data-action="cancel">Annulla</button>
                    <button class="texture-editor-button texture-editor-button--primary" type="button" data-action="confirm">Applica</button>
                </footer>
            </div>
        `;

        this.backdrop = backdrop;
        this.canvasWrapper = backdrop.querySelector(".texture-editor-canvas-wrapper");
        this.canvas = backdrop.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: false });
        this.zoomSlider = backdrop.querySelector("#texture-editor-zoom");
        this.zoomLabel = backdrop.querySelector(".texture-editor-zoom-value");
        this.hintLabel = backdrop.querySelector(".texture-editor-hint");
        this.shapeButtons = Array.from(backdrop.querySelectorAll(".texture-editor-shape-btn"));
        this.fillButtons = Array.from(backdrop.querySelectorAll(".texture-editor-fill-btn"));

        backdrop.querySelector(".texture-editor-close").addEventListener("click", () => this.cancel());
        backdrop.querySelector("[data-action='cancel']").addEventListener("click", () => this.cancel());
        backdrop.querySelector("[data-action='confirm']").addEventListener("click", () => this.confirm());

        this.backdrop.addEventListener("click", (event) => {
            if (event.target === this.backdrop) {
                this.cancel();
            }
        });

        this.canvas.addEventListener("pointerdown", this.boundPointerDown);
        this.canvas.addEventListener("pointermove", this.boundPointerMove);
        this.canvas.addEventListener("pointerup", this.boundPointerUp);
        this.canvas.addEventListener("pointercancel", this.boundPointerUp);
        this.canvas.addEventListener("pointerleave", this.boundPointerUp);

        this.zoomSlider.addEventListener("input", this.boundZoomInput);

        this.shapeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const shape = button.getAttribute("data-shape");
                this.setCropShape(shape);
            });
        });

        this.fillButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const mode = button.getAttribute("data-fill");
                this.setFillMode(mode);
            });
        });

        document.addEventListener("keydown", this.boundKeydown);
        requestAnimationFrame(() => {
            this.syncShapeButtons();
            this.syncFillButtons();
            const primaryButton = backdrop.querySelector("[data-action='confirm']");
            primaryButton?.focus();
        });
    }

    loadImage(dataUrl) {
        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.calculateScaleBounds();
            this.setFillMode(this.fillMode, { fromLoad: true });
            this.updateZoomDisplay();
            this.draw();
        };
        img.onerror = () => {
            console.error("Impossibile caricare l'immagine nel texture editor");
            this.cancel();
        };
        img.src = dataUrl;
    }

    calculateScaleBounds() {
        if (!this.image) return;

        const width = this.image.width || 1;
        const height = this.image.height || 1;
        const fit = Math.min(CANVAS_SIZE / width, CANVAS_SIZE / height);
        const cover = Math.max(CANVAS_SIZE / width, CANVAS_SIZE / height);

        this.scaleFit = fit;
        this.scaleCover = cover;
        this.minScaleLimit = Math.max(fit * MIN_ZOOM_RATIO, 0.05);
        this.maxScale = Math.max(cover * MAX_SCALE_MULTIPLIER, this.minScaleLimit + 0.00001);
    }

    getBaseScaleForMode(mode) {
        if (!this.image) {
            return 1;
        }
        switch (mode) {
            case "cover":
                return this.scaleCover;
            case "repeat":
                return this.scaleFit;
            case "fit":
            default:
                return this.scaleFit;
        }
    }

    setFillMode(mode, { fromLoad = false } = {}) {
        const normalized = ALLOWED_FILL_MODES.includes(mode) ? mode : DEFAULT_FILL_MODE;
        this.fillMode = normalized;
        this.syncFillButtons();

        if (!this.image) {
            this.updateZoomDisplay();
            return;
        }

        this.baseScale = this.getBaseScaleForMode(normalized);
        this.baseScale = Math.min(Math.max(this.baseScale, this.minScaleLimit), this.maxScale);
        this.applyScale(this.baseScale, { skipClamp: true, syncSlider: true, recenter: true });

        if (!fromLoad) {
            this.draw();
        }
    }

    setCropShape(shape) {
        const normalizedShape = ALLOWED_SHAPES.includes(shape) ? shape : DEFAULT_SHAPE;
        if (!this.geometryCache[normalizedShape]) {
            console.warn(`Forma "${normalizedShape}" non disponibile nei dati del modello.`);
            return;
        }
        if (this.cropShape === normalizedShape) return;

        this.cropShape = normalizedShape;
        this.syncShapeButtons();
        this.draw();
    }

    syncShapeButtons() {
        if (!this.shapeButtons || this.shapeButtons.length === 0) return;
        this.shapeButtons.forEach((button) => {
            const isActive = button.getAttribute("data-shape") === this.cropShape;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        if (this.canvasWrapper) {
            this.canvasWrapper.setAttribute("data-shape", this.cropShape);
        }
    }

    syncFillButtons() {
        if (!this.fillButtons || this.fillButtons.length === 0) return;
        this.fillButtons.forEach((button) => {
            const isActive = button.getAttribute("data-fill") === this.fillMode;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    }

    onPointerDown(event) {
        if (!this.canvas) return;
        event.preventDefault();
        if (this.canvas.hasPointerCapture?.(event.pointerId)) {
            this.canvas.releasePointerCapture(event.pointerId);
        }
        this.canvas.setPointerCapture(event.pointerId);
        this.isDragging = true;
        this.hintLabel?.classList.add("is-dragging");

        const rect = this.canvas.getBoundingClientRect();
        this.lastPointer.x = event.clientX * (CANVAS_SIZE / rect.width);
        this.lastPointer.y = event.clientY * (CANVAS_SIZE / rect.height);
    }

    onPointerMove(event) {
        if (!this.isDragging || !this.canvas) return;
        event.preventDefault();

        const rect = this.canvas.getBoundingClientRect();
        const currentX = event.clientX * (CANVAS_SIZE / rect.width);
        const currentY = event.clientY * (CANVAS_SIZE / rect.height);

        const deltaX = currentX - this.lastPointer.x;
        const deltaY = currentY - this.lastPointer.y;

        this.lastPointer.x = currentX;
        this.lastPointer.y = currentY;

        this.imageX += deltaX;
        this.imageY += deltaY;

        this.clampPosition();
        this.draw();
    }

    onPointerUp(event) {
        if (!this.canvas) return;
        if (this.canvas.hasPointerCapture?.(event.pointerId)) {
            this.canvas.releasePointerCapture(event.pointerId);
        }
        this.isDragging = false;
        this.hintLabel?.classList.remove("is-dragging");
    }

    onKeyDown(event) {
        if (event.key === "Escape") {
            this.cancel();
        }
    }

    clampPosition() {
        if (!this.image) return;

        const drawWidth = this.image.width * this.scale;
        const drawHeight = this.image.height * this.scale;

        if (drawWidth <= CANVAS_SIZE) {
            this.imageX = (CANVAS_SIZE - drawWidth) / 2;
        } else {
            const minX = CANVAS_SIZE - drawWidth;
            const maxX = 0;
            this.imageX = Math.min(Math.max(this.imageX, minX), maxX);
        }

        if (drawHeight <= CANVAS_SIZE) {
            this.imageY = (CANVAS_SIZE - drawHeight) / 2;
        } else {
            const minY = CANVAS_SIZE - drawHeight;
            const maxY = 0;
            this.imageY = Math.min(Math.max(this.imageY, minY), maxY);
        }
    }

    applyScale(nextScale, { skipClamp = false, syncSlider = false, recenter = false } = {}) {
        if (!this.image) return;

        let targetScale = Number.isFinite(nextScale) ? nextScale : this.scale;
        if (!skipClamp) {
            targetScale = Math.min(Math.max(targetScale, this.minScaleLimit), this.maxScale);
        }

        const prevDrawWidth = this.image.width * this.scale;
        const prevDrawHeight = this.image.height * this.scale;
        const centerX = this.imageX + prevDrawWidth / 2;
        const centerY = this.imageY + prevDrawHeight / 2;

        this.scale = targetScale;

        const drawWidth = this.image.width * this.scale;
        const drawHeight = this.image.height * this.scale;

        if (recenter) {
            this.imageX = (CANVAS_SIZE - drawWidth) / 2;
            this.imageY = (CANVAS_SIZE - drawHeight) / 2;
        } else {
            this.imageX = centerX - drawWidth / 2;
            this.imageY = centerY - drawHeight / 2;
            this.clampPosition();
        }

        if (syncSlider) {
            this.syncSliderToScale();
        }

        this.updateZoomDisplay();
        this.draw();
    }

    draw() {
        if (!this.ctx) return;
        this.renderToCanvas(this.ctx, { includeOverlay: true });
    }

    renderToCanvas(ctx, { includeOverlay = false } = {}) {
        if (!ctx) return;

        const geometry = this.geometryCache[this.cropShape] || this.geometryCache[DEFAULT_SHAPE];
        const showOverlay = Boolean(includeOverlay);

        ctx.save();
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        if (showOverlay) {
            ctx.fillStyle = "#10141c";
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

            if (geometry?.path) {
                ctx.save();
                ctx.fillStyle = "rgba(10, 14, 22, 0.72)";
                ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                ctx.globalCompositeOperation = "destination-out";
                ctx.fill(geometry.path);
                ctx.restore();
            }
        }

        if (geometry?.path) {
            ctx.save();
            ctx.clip(geometry.path);

            if (this.image) {
                if (this.fillMode === "repeat") {
                    const pattern = ctx.createPattern(this.image, "repeat");
                    if (pattern) {
                        if (typeof pattern.setTransform === "function") {
                            const matrix = new DOMMatrix();
                            matrix.a = this.scale;
                            matrix.d = this.scale;
                            matrix.e = this.imageX;
                            matrix.f = this.imageY;
                            pattern.setTransform(matrix);
                            ctx.fillStyle = pattern;
                            ctx.fillRect(-CANVAS_SIZE, -CANVAS_SIZE, CANVAS_SIZE * 3, CANVAS_SIZE * 3);
                        } else {
                            ctx.save();
                            ctx.translate(this.imageX, this.imageY);
                            ctx.scale(this.scale, this.scale);
                            ctx.fillStyle = pattern;
                            const span = CANVAS_SIZE / this.scale + Math.max(this.image.width, this.image.height) * 4;
                            ctx.fillRect(-span, -span, span * 2, span * 2);
                            ctx.restore();
                        }
                    }
                } else {
                    const drawWidth = this.image.width * this.scale;
                    const drawHeight = this.image.height * this.scale;
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(this.image, this.imageX, this.imageY, drawWidth, drawHeight);
                }
            } else if (showOverlay) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
                ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            }

            ctx.restore();
        }

        if (geometry?.path && showOverlay) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
            ctx.lineWidth = 4;
            ctx.lineJoin = "round";
            ctx.stroke(geometry.path);
            ctx.restore();
        }

        if (showOverlay) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(CANVAS_SIZE / 2, 0);
            ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE);
            ctx.moveTo(0, CANVAS_SIZE / 2);
            ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE / 2);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }

    generateExportDataUrl() {
        if (!this.canvas) return null;
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = CANVAS_SIZE;
        exportCanvas.height = CANVAS_SIZE;
        const exportCtx = exportCanvas.getContext("2d", { willReadFrequently: false });
        if (!exportCtx) return null;

        exportCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        this.renderToCanvas(exportCtx, { includeOverlay: false });

        const geometry = this.geometryCache[this.cropShape] || this.geometryCache[DEFAULT_SHAPE];
        if (geometry?.path) {
            exportCtx.save();
            exportCtx.globalCompositeOperation = "destination-in";
            exportCtx.fillStyle = "#ffffff";
            exportCtx.fill(geometry.path);
            exportCtx.restore();
        }

        return exportCanvas.toDataURL("image/png");
    }

    confirm() {
        if (!this.resolve || !this.canvas) {
            this.close();
            return;
        }
        const dataUrl = this.generateExportDataUrl();
        const resolveFn = this.resolve;
        this.close();
        resolveFn(dataUrl);
    }

    cancel() {
        if (this.resolve) {
            const resolveFn = this.resolve;
            this.close();
            resolveFn(null);
        } else {
            this.close();
        }
    }

    close() {
        document.removeEventListener("keydown", this.boundKeydown);

        const previous = this.previousActiveElement;

        if (this.canvas) {
            this.canvas.removeEventListener("pointerdown", this.boundPointerDown);
            this.canvas.removeEventListener("pointermove", this.boundPointerMove);
            this.canvas.removeEventListener("pointerup", this.boundPointerUp);
            this.canvas.removeEventListener("pointercancel", this.boundPointerUp);
            this.canvas.removeEventListener("pointerleave", this.boundPointerUp);
        }

        this.zoomSlider?.removeEventListener("input", this.boundZoomInput);

        this.backdrop?.remove();
        document.body.classList.remove("texture-editor-open");

        this.backdrop = null;
        this.canvasWrapper = null;
        this.canvas = null;
        this.ctx = null;
        this.zoomSlider = null;
        this.zoomLabel = null;
        this.hintLabel = null;
        this.shapeButtons = [];
        this.fillButtons = [];
        this.image = null;
        this.resolve = null;
        this.isDragging = false;
        this.scale = 1;
        this.baseScale = 1;
        this.scaleFit = 1;
        this.scaleCover = 1;
        this.minScaleLimit = 0.1;
        this.maxScale = MAX_SCALE_MULTIPLIER;
        this.imageX = 0;
        this.imageY = 0;
        this.cropShape = DEFAULT_SHAPE;
        this.fillMode = DEFAULT_FILL_MODE;
        this.previousActiveElement = null;

        if (previous && typeof previous.focus === "function") {
            try {
                previous.focus();
            } catch (err) {
                // Elemento non piu presente.
            }
        }
    }

    updateZoomDisplay() {
        if (!this.zoomLabel) return;
        const reference = this.baseScale || this.scale || 1;
        const percent = Math.round((this.scale / reference) * 100);
        const safePercent = Number.isFinite(percent) ? percent : 100;
        this.zoomLabel.textContent = `${safePercent}%`;
    }

    scaleToSliderValue(scale) {
        if (this.maxScale <= this.minScaleLimit) return 0;
        const ratio = (scale - this.minScaleLimit) / (this.maxScale - this.minScaleLimit);
        return Math.min(100, Math.max(0, ratio * 100));
    }

    sliderToScale(value) {
        if (this.maxScale <= this.minScaleLimit) return this.minScaleLimit;
        const ratio = Math.min(Math.max(value / 100, 0), 1);
        return this.minScaleLimit + ratio * (this.maxScale - this.minScaleLimit);
    }

    syncSliderToScale() {
        if (!this.zoomSlider) return;
        const sliderValue = this.scaleToSliderValue(this.scale);
        this.zoomSlider.value = `${sliderValue}`;
    }

    onZoomInput() {
        if (!this.zoomSlider || !this.image) return;
        const sliderValue = Number(this.zoomSlider.value);
        const nextScale = this.sliderToScale(sliderValue);
        this.applyScale(nextScale, { skipClamp: false, syncSlider: false });
    }

    escapeHtml(value) {
        if (value == null) return "";
        return String(value).replace(/[&<>"']/g, (char) => {
            switch (char) {
                case "&": return "&amp;";
                case "<": return "&lt;";
                case ">": return "&gt;";
                case '"': return "&quot;";
                case "'": return "&#39;";
                default: return char;
            }
        });
    }
}

export const textureEditorModal = new TextureEditorModal();

export async function openTextureEditor(file) {
    if (!file) return null;

    try {
        return await textureEditorModal.openFromFile(file);
    } catch (err) {
        console.error("Texture editor fallito:", err);
        return null;
    }
}

export async function openTextureEditorFromDataUrl(dataUrl, name) {
    if (!dataUrl) return null;

    try {
        return await textureEditorModal.openWithDataUrl(dataUrl, name);
    } catch (err) {
        console.error("Texture editor fallito:", err);
        return null;
    }
}
