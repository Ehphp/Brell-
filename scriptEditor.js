import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//import { VertexNormalsHelper } from '/node_modules/three-js/addons/helpers/VertexNormalsHelper.js';


let textureLoader;
let isFullScreen = false;

document.addEventListener("DOMContentLoaded", () => {

    const hero2 = document.getElementById("hero2");
    const textureUpload = document.getElementById('panel-input');
    const saveButton = document.getElementById("toggle-save");

    //#region event listener
    textureUpload.addEventListener('change', fileInputHandler);

    saveButton.addEventListener("click", () => {
        let json = model.toJSON();
        json = JSON.stringify(json);
        json = btoa(json);
        fetch("https://localhost:7147/api/Umbrella", {
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

    const scene = new THREE.Scene();

    //init scena
    const pivot = new THREE.Group();
    scene.add(pivot);
    const camera = new THREE.PerspectiveCamera(
        75,
        hero2.clientWidth / hero2.clientHeight,
        0.1,
        500
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
    //const loader = new THREE.ObjectLoader();
    let model;
    const clickableMesh = [];
    let gettedModelJson;


    // //-----------------------> AXIS HELPER
    // const originHelper = new THREE.AxesHelper(10);
    // originHelper.setColors("red", "green", "blue");
    // scene.add(originHelper); //AXIS
    //#region FETCH MODEL FROM SERVER
    //   fetch("https://localhost:7147/api/Umbrella/29").then((response) => {
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       throw new Error('Network response was not ok: ' + response.statusText);
    //     }
    //   })
    //     .then((data) => {
    //       //decodifichiamo il base64
    //       gettedModelJson = atob(data.glb_file);

    //       gettedModelJson = JSON.parse(gettedModelJson);
    //       loader.parse(
    //         gettedModelJson,
    //         function (gltf) {
    //           model = gltf;
    //           model.scale.set(1, 1, 1);
    //           pivot.add(model);

    //           //data l'origine spostata calcoliamo il box che lo contiene e lo posizioniamo al centro della scena
    //           const box = new THREE.Box3().setFromObject(pivot);
    //           const center = box.getCenter(new THREE.Vector3());

    //           pivot.position.sub(center);
    //           //anche il pivot è al centro della scena
    //           pivot.position.set(0, -1, 0);
    //           model.rotation.set(-1, 0, 0);


    //           //legando gli elementi all'pivot siamo sicuri che ruoteremo e guarderemo sempre all'oggetto
    //           controls.target.copy(pivot.position);
    //           // controls.enablePan = false;
    //           controls.update();
    //           controls.disconnect();

    //           const distance = box.getSize(new THREE.Vector3()).length();
    //           camera.position.set(distance * 0.5, 0, distance * 0.5);
    //           camera.lookAt(pivot.position);

    //           const material = new THREE.MeshPhysicalMaterial({
    //             normalMap: normalTexture,
    //             metalnessMap: metallicTexture,
    //             roughnessMap: roughnessTexture,
    //             specularColor: new THREE.Color(0.2, 0.2, 0.2),
    //             ior: 1,
    //             opacity: 1,
    //             normalScale: new THREE.Vector2(0.1, 0.1),
    //             color: new THREE.Color(
    //               0.002005289774388075,
    //               0.0032031454611569643,
    //               0.03243967518210411
    //             ),
    //             side: THREE.DoubleSide
    //           });

    //           // applica texture al materiale del modello 
    //           model.traverse((node) => {

    //             if (node.isMesh) {

    //               let isFree;

    //               if (node.userData.free == false || node.userData.free) {
    //                 isFree = false
    //               } else {
    //                 isFree = true;
    //               }

    //               if (node.name !== "Scene" && node.name !== "Plane001" &&
    //                 node.name !== "Plane001_1" && node.name !== "stecca" && node.name !== "manico" && isFree) {
    //                 clickableMesh.push(node);

    //                 const material2 = material.clone();
    //                 material2.map = cocaColaTexture;

    //                 node.geometry.computeBoundingBox();

    //                 //genera le coordinate UV della mesh per l'applicazione delle texture
    //                 //TODO  ancora non ho capito perchè non se non calcolo gli uv non usa quelli esportati dal modello
    //                 const bbox = node.geometry.boundingBox;
    //                 const size = new THREE.Vector3();
    //                 bbox.getSize(size);

    //                 const uvAttribute = new Float32Array(node.geometry.attributes.position.count * 2);

    //                 for (let i = 0; i < node.geometry.attributes.position.count; i++) {
    //                   const x = node.geometry.attributes.position.getX(i);
    //                   const y = node.geometry.attributes.position.getY(i);

    //                   uvAttribute[i * 2] = (x - bbox.min.x) / size.x;
    //                   uvAttribute[i * 2 + 1] = (y - bbox.min.y) / size.y;
    //                 }

    //                 node.geometry.setAttribute('uv', new THREE.BufferAttribute(uvAttribute, 2));

    //                 node.material.needsUpdate = true;

    //                 node.material = material;
    //                 if (node.name === 'top_middle002') {
    //                   node.material = material2;
    //                   node.material.color = new THREE.Color(1, 1, 1)
    //                 }
    //               }
    //             }
    //           });

    //           animate();
    //         },
    //         undefined,
    //         function (error) {
    //           console.error(error);
    //         }
    //       );
    //       console.log("Modello GLB inviato con successo al server");
    //     }).catch((error) => console.error("Errore di rete", error))
    //#endregion

    const normalTexture = new THREE.TextureLoader().load("public/3d_model/outdoor-polyester-fabric_normal-ogl.png");
    const metallicTexture = new THREE.TextureLoader().load("public/3d_model/outdoor-polyester-fabric_metallic.png");
    const roughnessTexture = new THREE.TextureLoader().load("public/3d_model/outdoor-polyester-fabric_roughness.png");
    const cocaColaTexture = new THREE.TextureLoader().load("public/3d_model/xxx.png");

    //PER IL MOMENTO RIMANE QUA PERCHÈ ANCORA MI SERVE PER FARE I VARI TEST
    loader.load(
        "public/3d_model/umbrella.glb",
        function (gltf) {
            model = gltf.scene;
            model.scale.set(1, 1, 1);
            pivot.add(model);
            scene.add(pivot);

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

            // applica texture al materiale del modello 
            model.traverse((node) => {

                if (node.isMesh) {

                    let isFree;

                    if (node.userData.free == false || node.userData.free) {
                        isFree = false
                    } else {
                        isFree = true;
                    }

                    if (node.name !== "Scene" && node.name !== "Plane001" &&
                        node.name !== "Plane001_1" && node.name !== "stecca" && node.name !== "manico" && isFree) {
                        clickableMesh.push(node);

                        const material2 = material.clone();
                        material2.map = cocaColaTexture;

                        node.geometry.computeBoundingBox();

                        //genera le coordinate UV della mesh per l'applicazione delle texture
                        //TODO  ancora non ho capito perchè non se non calcolo gli uv non usa quelli esportati dal modello
                        const bbox = node.geometry.boundingBox;
                        const size = new THREE.Vector3();
                        bbox.getSize(size);

                        const uvAttribute = new Float32Array(node.geometry.attributes.position.count * 2);

                        for (let i = 0; i < node.geometry.attributes.position.count; i++) {
                            const x = node.geometry.attributes.position.getX(i);
                            const y = node.geometry.attributes.position.getY(i);

                            uvAttribute[i * 2] = (x - bbox.min.x) / size.x;
                            uvAttribute[i * 2 + 1] = (y - bbox.min.y) / size.y;
                        }

                        node.geometry.setAttribute('uv', new THREE.BufferAttribute(uvAttribute, 2));

                        node.material.needsUpdate = true;

                        node.material = material;
                        if (node.name === 'top_middle002') {
                            node.material = material2;
                            node.material.color = new THREE.Color(1, 1, 1)
                        }
                        // node.userData.originalMaterial = material.clone(); //copia in proprietà orginale per ripristino materiale quando si rimuove la texture
                        // node.userData.isOriginalMaterial = true; //copia in proprietà orginale per ripristino materiale quando si rimuove la texture
                    }
                }
            });

            window.addEventListener("resize", onWindowResize, false);
            animate();
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );



    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener("mousedown", onMouseClick, false);

    function onMouseClick(event) {
        if (!isFullScreen) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        // trova gli oggetti intercettati dal raycaster(linea immaginaria che parte dal cursore verso l'oggetto attraversando lo spazio 3d )
        const intersects = raycaster.intersectObjects(clickableMesh, true); // il true permette di testare gli spicchi(figlio)

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;

            console.log("Hai cliccato sull'oggetto:", selectedObject);
            const newMaterial = selectedObject.material.clone();
            newMaterial.map = textureLoader;
            newMaterial.color = new THREE.Color(1, 1, 1);
            selectedObject.material = newMaterial;
            selectedObject.userData.free = false;

            selectedObject.material.needsUpdate = true;
            model.children.find(c => { if (c.name == selectedObject.name) c = selectedObject })
        }
    }
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(hero2.clientWidth, hero2.clientHeight);
    document.getElementById("hero2").appendChild(renderer.domElement);

    scene.background = null; //null for transparent

    //L'anisotropic filtering migliora la qualità delle texture viste con angoli obliqui
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    cocaColaTexture.anisotropy = maxAnisotropy;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: null };
    controls.update();

    function animate() {
        requestAnimationFrame(animate);
        isFullScreen == true ? null : pivot.rotation.y += 0.01

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const container = document.getElementById("hero2")
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});

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
    };
    reader.readAsDataURL(file);
}
//#endregion DRAG AND DROP
