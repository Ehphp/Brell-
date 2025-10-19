// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//import { VertexNormalsHelper } from '/node_modules/three-js/addons/helpers/VertexNormalsHelper.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { openTextureEditor } from "./texture-editor.js";

let textureLoader;
let isDragging = false;
let downPos = { x: 0, y: 0 };
let downTime = 0;
const CLICK_MAX_MOVEMENT = 5;//pixel
const CLICK_MAX_DURATION = 300;//millesecond

// Variabili per l'effetto hover con cambio colore
let hoveredObject = null;
let originalProperties = null; // Salviamo solo le proprietà, non l'intero materiale

document.addEventListener("DOMContentLoaded", () => {

    const hero2 = document.getElementById("hero2");
    const textureUpload = document.getElementById('panel-input');
    const saveButton = document.getElementById("toggle-save");

    // Nuovi controlli HTML
    const uploadDropZone = document.getElementById('upload-drop-zone');
    const scaleSlider = document.getElementById('logo-scale');
    const rotationSlider = document.getElementById('logo-rotation');
    const scaleValue = document.getElementById('scale-value');
    const rotationValue = document.getElementById('rotation-value');
    const templateCards = document.querySelectorAll('.template-btn');
    const previewButton = document.getElementById('preview-button');

    const normalTexture = new THREE.TextureLoader().load("3d_model/outdoor-polyester-fabric_normal-ogl.png");
    const metallicTexture = new THREE.TextureLoader().load("3d_model/outdoor-polyester-fabric_metallic.png");
    const roughnessTexture = new THREE.TextureLoader().load("3d_model/outdoor-polyester-fabric_roughness.png");
    const cocaColaTexture = new THREE.TextureLoader().load("3d_model/xxx.png");


    const scene = new THREE.Scene();

    //init scena
    const pivot = new THREE.Group();
    scene.add(pivot);
    const camera = new THREE.PerspectiveCamera(
        75,
        hero2.clientWidth / hero2.clientHeight,
        0.5,
        100
    );

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    light.position.set(-5, 10, 7.5);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(1, 5, 1);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight2.position.set(0, -5, 0);
    scene.add(directionalLight2);

    //RECUPERO E CARICAMENTO  MODELLO
    //RIMANE QUA PER I VARI TEST
    const loader = new GLTFLoader();
    // const loader = new THREE.ObjectLoader();
    let model;
    const clickableMesh = [];

    (async () => {
        const loadedFromCache = await tryLoadModelFromCache();
        if (!loadedFromCache) {
            console.log("Caricamento del modello di fallback da umbrella.glb");
            loader.load(
                "3d_model/umbrella.glb",
                (gltf) => {
                    onModelLoad(gltf, true); // isFreshLoad = true
                },
                undefined,
                (error) => {
                    console.error("Errore durante il caricamento del modello GLB:", error);
                }
            );
        }
    })();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio * 1.5);

    renderer.setSize(hero2.clientWidth, hero2.clientHeight);
    document.getElementById("hero2").appendChild(renderer.domElement);

    scene.background = null; //null for transparent

    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener("mousedown", onMouseClickDown, false);
    renderer.domElement.addEventListener("mouseup", onMouseClickUp);
    renderer.domElement.addEventListener('mouseleave', onMouseLeave, false);

    window.addEventListener('resize', onWindowResize, false);

    //L'anisotropic filtering migliora la qualità delle texture viste con angoli obliqui
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    cocaColaTexture.anisotropy = maxAnisotropy;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: null, RIGHT: null };
    controls.update();

    // Current logo state for editor controls
    let currentLogoTexture = null;
    let logoScale = 1;
    let logoRotation = 0;

    // Expose functions for integration with main script
    window.applyCustomTexture = applyCustomTexture;
    window.applyTextureFromDataUrl = applyTextureFromDataUrl;
    window.applyTemplate = applyTemplate;
    window.updateLogoScale = updateLogoScale;
    window.updateLogoRotation = updateLogoRotation;

    async function applyCustomTexture(file) {
        const editedDataUrl = await openTextureEditor(file);
        if (!editedDataUrl) {
            console.log("Nessuna texture applicata: operazione annullata.");
            return null;
        }
        return applyTextureFromDataUrl(editedDataUrl);
    }

    function applyTextureFromDataUrl(dataUrl) {
        if (!dataUrl) return null;

        const texture = new THREE.TextureLoader().load(dataUrl, () => {
            texture.needsUpdate = true;
        });
        texture.anisotropy = maxAnisotropy;
        if ('colorSpace' in texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
        texture.flipY = false;

        currentLogoTexture = texture;

        // NON applica automaticamente a tutto il modello
        // L'utente deve cliccare sugli slot per applicare
        textureLoader = texture;
        console.log("Texture pronta. Clicca sugli slot dell'ombrello per applicarla.");
        return texture;
    }
    function applyTemplate(template) {
        // Create a canvas-based texture for template text/logo
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = template.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Icon
        ctx.font = '120px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(template.icon, canvas.width / 2, 200);

        // Text
        ctx.font = 'bold 40px Arial';
        ctx.fillText(template.text, canvas.width / 2, canvas.height - 100);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = maxAnisotropy;
        if ('colorSpace' in texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
        currentLogoTexture = texture;

        // NON applica automaticamente a tutto il modello
        // L'utente deve cliccare sugli slot per applicare
        textureLoader = texture;
        console.log("✅ Template pronto. Clicca sugli slot dell'ombrello per applicarlo.");
    }

    function updateLogoScale(scale) {
        logoScale = scale;
        if (currentLogoTexture && model) {
            updateTextureTransform();
        }
    }

    function updateLogoRotation(rotation) {
        logoRotation = rotation * Math.PI / 180; // Convert to radians
        if (currentLogoTexture && model) {
            updateTextureTransform();
        }
    }

    function updateTextureTransform() {
        if (!currentLogoTexture) return;

        // Update texture transformation
        currentLogoTexture.repeat.set(logoScale, logoScale);
        currentLogoTexture.rotation = logoRotation;
        currentLogoTexture.center.set(0.5, 0.5);
        currentLogoTexture.needsUpdate = true;
    }

    function applyTextureToModel(texture) {
        if (!model) return;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                // Apply texture to material
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        if (mat.map) {
                            mat.map = texture;
                            mat.needsUpdate = true;
                        }
                    });
                } else {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                }
            }
        });
    }

    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: null, RIGHT: null };
    controls.update();

    // Expose functions for integration with main script
    window.applyCustomTexture = applyCustomTexture;
    window.applyTextureFromDataUrl = applyTextureFromDataUrl;
    window.applyTemplate = applyTemplate;
    window.updateLogoScale = updateLogoScale;
    window.updateLogoRotation = updateLogoRotation;

    // ============================================
    // EVENT LISTENERS FOR NEW UI CONTROLS
    // ============================================

    // Upload file input
    if (textureUpload) {
        textureUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                await applyCustomTexture(file);
            }
        });
    }

    // Drag and drop zone
    if (uploadDropZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadDropZone.addEventListener(eventName, () => {
                uploadDropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadDropZone.addEventListener(eventName, () => {
                uploadDropZone.classList.remove('dragover');
            }, false);
        });

        // Handle dropped files
        uploadDropZone.addEventListener('drop', async (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    await applyCustomTexture(file);
                    // Also update the file input
                    if (textureUpload) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        textureUpload.files = dataTransfer.files;
                    }
                }
            }
        }, false);

        // Click on drop zone triggers file input
        uploadDropZone.addEventListener('click', () => {
            if (textureUpload) {
                textureUpload.click();
            }
        });
    }

    // Logo scale slider
    if (scaleSlider && scaleValue) {
        scaleSlider.addEventListener('input', (e) => {
            const scale = parseFloat(e.target.value);
            updateLogoScale(scale);
            scaleValue.textContent = `${Math.round(scale * 100)}%`;
        });
    }

    // Logo rotation slider
    if (rotationSlider && rotationValue) {
        rotationSlider.addEventListener('input', (e) => {
            const rotation = parseFloat(e.target.value);
            updateLogoRotation(rotation);
            rotationValue.textContent = `${rotation}°`;
        });
    }

    // Template cards
    const templates = {
        restaurant: {
            color: '#E74C3C',
            icon: '🍕',
            text: 'RISTORANTE'
        },
        bar: {
            color: '#3498DB',
            icon: '☕',
            text: 'BAR'
        },
        shop: {
            color: '#9B59B6',
            icon: '🛍️',
            text: 'NEGOZIO'
        },
        service: {
            color: '#1ABC9C',
            icon: '⚙️',
            text: 'SERVIZI'
        }
    };

    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const templateType = card.dataset.template;
            if (templates[templateType]) {
                // Remove active class from all cards
                templateCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                // Apply template
                applyTemplate(templates[templateType]);
            }
        });
    });

    // Preview button - Auto-rotate the model
    if (previewButton) {
        let isAutoRotating = false;

        previewButton.addEventListener('click', () => {
            isAutoRotating = !isAutoRotating;

            if (isAutoRotating) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 2.0;
                previewButton.innerHTML = '⏸️ Ferma rotazione';
                previewButton.classList.add('active');
            } else {
                controls.autoRotate = false;
                previewButton.innerHTML = '👁️ Anteprima 360°';
                previewButton.classList.remove('active');
            }
        });
    }

    // ============================================
    // END EVENT LISTENERS
    // ============================================

    function animate() {
        requestAnimationFrame(animate);
        pivot.rotation.y += 0.001
        controls.update();

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const container = document.getElementById("hero2")
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function applyTextureClick(event) {
        // Verifica che ci sia una texture caricata
        if (!textureLoader) {
            console.warn("Nessuna texture caricata. Carica prima un'immagine.");
            return;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMesh, true);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;

            // IMPORTANTE: Ripristina l'hover PRIMA di clonare il materiale
            if (hoveredObject === selectedObject && originalProperties) {
                selectedObject.material.color.copy(originalProperties.color);
                selectedObject.material.emissive.copy(originalProperties.emissive);
                selectedObject.material.emissiveIntensity = originalProperties.emissiveIntensity;
                selectedObject.material.opacity = originalProperties.opacity;
                selectedObject.material.transparent = originalProperties.transparent;
                selectedObject.material.needsUpdate = true;
                hoveredObject = null;
                originalProperties = null;
            }

            // Ora clona il materiale pulito (senza hover)
            const newMaterial = selectedObject.material.clone();

            // Applica la texture
            newMaterial.map = textureLoader.clone();
            newMaterial.map.needsUpdate = true;

            // Imposta proprietà corrette per mostrare la texture
            newMaterial.color = new THREE.Color(1, 1, 1); // Bianco per non alterare la texture
            newMaterial.emissive = new THREE.Color(0, 0, 0); // Nessuna emissività
            newMaterial.emissiveIntensity = 0;
            newMaterial.opacity = 1; // Completamente opaco
            newMaterial.transparent = false; // Non trasparente

            selectedObject.material = newMaterial;
            selectedObject.userData.free = false;
            selectedObject.material.needsUpdate = true;

            console.log(`Texture applicata a: ${selectedObject.name}`);
            temp_saveModelToCache();
        }
    }

    function onMouseMove(event) {
        if (event.buttons === 1) { // tasto sinistro premuto
            const dx = event.clientX - downPos.x;
            const dy = event.clientY - downPos.y;
            if (Math.hypot(dx, dy) > CLICK_MAX_MOVEMENT) {
                isDragging = true;
            }
        }
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMesh, true);

        const newObject = intersects.length > 0 ? intersects[0].object : null;

        // Se c'è un cambio di oggetto hoverato
        if (newObject !== hoveredObject) {
            // Ripristina le proprietà originali se esisteva un oggetto precedente
            if (hoveredObject && originalProperties) {
                hoveredObject.material.color.copy(originalProperties.color);
                hoveredObject.material.emissive.copy(originalProperties.emissive);
                hoveredObject.material.emissiveIntensity = originalProperties.emissiveIntensity;
                hoveredObject.material.opacity = originalProperties.opacity;
                hoveredObject.material.transparent = originalProperties.transparent;
                hoveredObject.material.needsUpdate = true;
                hoveredObject = null;
                originalProperties = null;
            }

            // Applica l'effetto hover al nuovo oggetto
            if (newObject && newObject.material) {
                // Salva solo le proprietà che andremo a modificare
                originalProperties = {
                    color: newObject.material.color.clone(),
                    emissive: newObject.material.emissive.clone(),
                    emissiveIntensity: newObject.material.emissiveIntensity,
                    opacity: newObject.material.opacity,
                    transparent: newObject.material.transparent
                };

                // Modifica direttamente il materiale esistente (la texture .map rimane intatta)
                newObject.material.color.setHex(0xEDE2E1); // Colore giallo del tema
                newObject.material.emissive.setHex(0xEDE2E1); // Emissività gialla
                newObject.material.emissiveIntensity = 0.4;
                newObject.material.opacity = 0.8; // Semi-trasparente
                newObject.material.transparent = true;
                newObject.material.needsUpdate = true;

                hoveredObject = newObject;
            }
        }
    }

    function onMouseLeave() {
        // Ripristina le proprietà quando il mouse esce dalla canvas
        if (hoveredObject && originalProperties) {
            hoveredObject.material.color.copy(originalProperties.color);
            hoveredObject.material.emissive.copy(originalProperties.emissive);
            hoveredObject.material.emissiveIntensity = originalProperties.emissiveIntensity;
            hoveredObject.material.opacity = originalProperties.opacity;
            hoveredObject.material.transparent = originalProperties.transparent;
            hoveredObject.material.needsUpdate = true;
            hoveredObject = null;
            originalProperties = null;
        }
    }

    function onMouseClickDown(event) {
        if (event.button !== 0 && event.button !== 2) return;
        if (event.button === 0) { // solo sinistro
            downPos = { x: event.clientX, y: event.clientY };
            downTime = performance.now();
            isDragging = false;
        }
    }

    function onMouseClickUp(event) {
        if (event.button !== 0) return; // solo sinistro
        const duration = performance.now() - downTime;
        const dx = event.clientX - downPos.x;
        const dy = event.clientY - downPos.y;
        const moved = Math.hypot(dx, dy) > CLICK_MAX_MOVEMENT;

        const isClick = !isDragging && !moved && duration <= CLICK_MAX_DURATION;
        if (isClick) {
            applyTextureClick(event);
        }
    }

    //#region SAVE/LOAD LISTENER
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            let json = model.toJSON();
            json = JSON.stringify(json);
            json = btoa(json);
            fetch("http://localhost:7147/api/Umbrella", {
                method: "POST",
                body: JSON.stringify({ GlbFile: json, Name: "umbrella0.1" }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                if (response.ok) {
                    console.log("modello GLB inviato con successo al servder");
                } else {
                    console.error("Errore nell'invio del file GLB al server")
                }
            }).catch((error) => console.error("Errore di rete", error))
        });
    }
    //#endregion event listener
    //#region LOAD MODEL

    /**
     * Funzione temporanea per salvare lo stato del modello nella Cache API.
     * Viene chiamata ogni volta che una texture viene applicata.
     */
    async function temp_saveModelToCache() {
        if (!model) {
            console.error("Il modello non è ancora stato caricato, impossibile salvare.");
            return;
        }

        // Fast fix: Eseguiamo il codice bloccante in un setTimeout per non freezare l'UI.
        // La soluzione ideale sarebbe usare un Web Worker.
        setTimeout(async () => {
            try {
                const cacheName = 'brello-model-cache-v1';
                const requestUrl = '/model/brello_state.json';

                console.log("Serializzazione del modello in corso (in background)...");
                const json = model.toJSON();
                const jsonString = JSON.stringify(json);

                console.log(`Dimensione del modello serializzato: ${(jsonString.length / 1024 / 1024).toFixed(2)} MB`);

                const response = new Response(jsonString, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const cache = await caches.open(cacheName);
                await cache.put(requestUrl, response);

                console.log(`Modello salvato nella cache '${cacheName}' con la chiave '${requestUrl}'.`);

            } catch (e) {
                console.error("Errore durante il salvataggio del modello nella cache:", e);
                alert("Impossibile salvare il modello nella cache.");
            }
        }, 0);
    }

    /**
     * Funzione temporanea per caricare lo stato del modello dalla Cache API.
     */
    async function tryLoadModelFromCache() {
        const cacheName = 'brello-model-cache-v1';
        const requestUrl = '/model/brello_state.json';

        try {
            const cache = await caches.open(cacheName);
            const response = await cache.match(requestUrl);

            if (!response) {
                console.log(`Nessun modello salvato trovato nella cache '${cacheName}'.`);
                return false;
            }

            console.log("Modello trovato nella cache, caricamento in corso...");
            const json = await response.json();

            const objectLoader = new THREE.ObjectLoader();
            const loadedObject = objectLoader.parse(json);

            onModelLoad(loadedObject, false);

            console.log("Modello caricato con successo dalla cache.");
            return true;
        } catch (e) {
            console.error("Errore durante il caricamento del modello dalla cache:", e);
            return false;
        }
    }

    function onModelLoad(loadedObject, isFreshLoad = false) {
        if (loadedObject.scene) { // From GLTFLoader
            model = loadedObject.scene;
        } else { // From ObjectLoader (cache)
            model = loadedObject;
        }

        if (pivot.children.length > 0) {
            pivot.remove(pivot.children[0]);
        }
        pivot.add(model);

        //data l'origine spostata calcoliamo il box che lo contiene e lo posizioniamo al centro della scena
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);
        //anche il pivot è al centro della scena
        pivot.position.set(0, -1, 0);
        //legando gli elementi all'pivot siamo sicuri che ruoteremo e guarderemo sempre all'oggetto
        controls.target.copy(pivot.position);
        controls.update();
        const distance = box.getSize(new THREE.Vector3()).length();
        camera.position.set(distance * 0.0005, 0, distance * 0.4);
        camera.lookAt(pivot.position);

        clickableMesh.length = 0;
        model.traverse((node) => {
            if (node.isMesh) {
                if (node.name !== "Scene" && node.name !== "Plane001" &&
                    node.name !== "Plane001_1" && node.name !== "stecca" && node.name !== "manico") {
                    clickableMesh.push(node);

                    // Applica il materiale di default solo al primo caricamento dal GLB
                    if (isFreshLoad) {
                        const isFree = node.userData.free !== false; // Default a true se non definito
                        if (isFree) {
                            const material = new THREE.MeshPhysicalMaterial({
                                normalMap: normalTexture,
                                metalnessMap: metallicTexture,
                                roughnessMap: roughnessTexture,
                                specularColor: new THREE.Color(0.2, 0.2, 0.2),
                                ior: 1,
                                opacity: 1,
                                normalScale: new THREE.Vector2(0.1, 0.1),
                                color: new THREE.Color(
                                    0.002005289774388075,
                                    0.0032031454611569643,
                                    0.03243967518210411
                                ),
                                side: THREE.DoubleSide
                            });
                            node.material = material;
                        }
                    }
                }
            }
        });

        window.addEventListener("resize", onWindowResize, false);
        animate();
    }
    //#endregion
});
