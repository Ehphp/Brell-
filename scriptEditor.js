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

let textureLoader;
let isDragging = false;
let downPos = { x: 0, y: 0 };
let downTime = 0;
const CLICK_MAX_MOVEMENT = 5;//pixel
const CLICK_MAX_DURATION = 300;//millesecond

document.addEventListener("DOMContentLoaded", () => {

    const hero2 = document.getElementById("hero2");
    const textureUpload = document.getElementById('panel-input');
    const saveButton = document.getElementById("toggle-save");

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

    //#region COMPOSER - OUTLINE EFFECT
    const size = new THREE.Vector2(hero2.clientWidth, hero2.clientHeight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const outlinePass = new OutlinePass(
        size,
        scene,
        camera
    );

    outlinePass.visibleEdgeColor.set(0xffffff);
    outlinePass.hiddenEdgeColor.set(0x000000);
    outlinePass.edgeThickness = 1.5;
    outlinePass.edgeGlow = 0.7;
    outlinePass.edgeStrength = 2.0;
    outlinePass.pulsePeriod = 3;

    composer.addPass(outlinePass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    //#endregion

    scene.background = null; //null for transparent

    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener("mousedown", onMouseClickDown, false);
    renderer.domElement.addEventListener("mouseup", onMouseClickUp);

    window.addEventListener('resize', onWindowResize, false);

    //L'anisotropic filtering migliora la qualità delle texture viste con angoli obliqui
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    cocaColaTexture.anisotropy = maxAnisotropy;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: null, RIGHT: null };
    controls.update();

    function animate() {
        requestAnimationFrame(animate);
        pivot.rotation.y += 0.001

        composer.render();
    }

    function onWindowResize() {
        const container = document.getElementById("hero2")
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);

        effectFXAA.uniforms['resolution'].value.set(1 / container.clientWidth, 1 / container.clientHeight);
    }

    function applyTextureClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableMesh, true);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            const newMaterial = selectedObject.material.clone();
            newMaterial.map = textureLoader;
            newMaterial.color = new THREE.Color(1, 1, 1);
            selectedObject.material = newMaterial;
            selectedObject.userData.free = false;
            selectedObject.material.needsUpdate = true;

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
        outlinePass.selectedObjects = newObject ? [newObject] : [];

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

    //#region DRAG AND DROP
    function fileInputHandler(event) {
        const file = event.target.files[0];
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            handleFileUpload(file);
        } else {
            alert("Please upload a valid PNG or JPEG file.");
        }
    }

    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            textureLoader = new THREE.TextureLoader().load(imageUrl);
            textureLoader.anisotropy = maxAnisotropy;
            textureLoader.encoding = THREE.sRGBEncoding;
            textureLoader.flipY = false;
        };
        reader.readAsDataURL(file);
    }


    //#endregion DRAG AND DROP
    //#region SAVE/LOAD LISTENER
    textureUpload.addEventListener('change', fileInputHandler);

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
