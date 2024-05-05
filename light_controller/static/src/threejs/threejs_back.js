/** @odoo-module **/

import { Component, onMounted, useRef } from "@odoo/owl";

const Preset = {ASSET_GENERATOR: 'assetgenerator'};

const DEFAULT_CAMERA = '[default]';

const MANAGER = new THREE.LoadingManager();

export class ThreeDComponent extends Component {
    static template = "light_controller.ThreeDComponent";

    setup() {
        this.el = null;
        this.options = {preset: 'vv', kiosk: false, cameraPosition: false};

        this.lights = [];
        this.content = null;
        this.mixer = null;
        this.clips = [];
        this.gui = null;

        this.state = {
            background: false,
            playbackSpeed: 1.0,
            actionStates: {},
            camera: DEFAULT_CAMERA,
            wireframe: false,
            skeleton: false,
            grid: false,
            autoRotate: false,

            // Lights
            punctualLights: true,
            exposure: 0.0,
            toneMapping: THREE.LinearToneMapping,
            ambientIntensity: 0.3,
            ambientColor: '#FFFFFF',
            directIntensity: 0.8 * Math.PI, // TODO(#116)
            directColor: '#FFFFFF',
            bgColor: '#191919',

            pointSize: 1.0,
        };

        this.prevTime = 0;

        //this.stats = new THREE.Stats();
        //this.stats.dom.height = '48px';
        //[].forEach.call(this.stats.dom.children, (child) => (child.style.display = ''));

        this.backgroundColor = new Color(this.state.bgColor);

        this.scene = new THREE.Scene();
        this.scene.background = this.backgroundColor;
        this.defaultCamera = null;
        this.activeCamera = null;

        this.renderer = window.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xcccccc);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.pmremGenerator.compileEquirectangularShader();

        // this.neutralEnvironment = this.pmremGenerator.fromScene(new THREE.RoomEnvironment()).texture;

        //this.controls = new THREE.OrbitControls(this.defaultCamera, this.renderer.domElement);
        //this.controls.screenSpacePanning = true;

        this.cameraCtrl = null;
        this.cameraFolder = null;
        this.animFolder = null;
        this.animCtrls = [];
        this.morphFolder = null;
        this.morphCtrls = [];
        this.skeletonHelpers = [];
        this.gridHelper = null;
        this.axesHelper = null;

        //this.addAxesHelper();
        //this.addGUI();
        if (this.options.kiosk) this.gui.close();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        window.addEventListener('resize', this.resize.bind(this), false);

        onMounted(() => {
            this.initThreeJS2();
        });
    }

    initThreeJS() {
        var width = this.ref.el.offsetWidth;
        var height = this.ref.el.offsetHeight;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();

        renderer.setSize(width, height);
        this.ref.el.appendChild(renderer.domElement);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();
    }

    initThreeJS2() {
        this.el = useRef("canvas").el;
        this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);

        const fov = this.options.preset === Preset.ASSET_GENERATOR ? (0.8 * 180) / Math.PI : 60;
        const aspect = this.el.offsetWidth / this.el.offsetHeight;
        this.defaultCamera = new PerspectiveCamera(fov, aspect, 0.01, 1000);
        this.activeCamera = this.defaultCamera;
        this.scene.add(this.defaultCamera);

        this.el.appendChild(this.renderer.domElement);

        console.log(this.el);
        const loader = new GLTFLoader();

        loader.load(
            '/light_controller/static/data/simple_studio_light.glb',
            (gltf) => {
                const scene = gltf.scene || gltf.scenes[0];
                const clips = gltf.animations || [];

                if (!scene) {
                    // Valid, but not supported by this viewer.
                    throw new Error(
                        'This model contains no scene, and cannot be viewed here. However,' +
                        ' it may contain individual 3D resources.',
                    );
                }

                this.setContent(scene, clips);
            },
            undefined,
            function (error) {
                console.error('Error loading GLTF file:', error);
            }
        );
    }

    setContent(object, clips) {
        object.updateMatrixWorld();

        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());

        //this.controls.reset();

        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        //this.controls.maxDistance = size * 10;

        this.defaultCamera.near = size / 100;
        this.defaultCamera.far = size * 100;
        this.defaultCamera.updateProjectionMatrix();

        if (this.options.cameraPosition) {
            this.defaultCamera.position.fromArray(this.options.cameraPosition);
            this.defaultCamera.lookAt(new Vector3());
        } else {
            this.defaultCamera.position.copy(center);
            this.defaultCamera.position.x += size / 2.0;
            this.defaultCamera.position.y += size / 5.0;
            this.defaultCamera.position.z += size / 2.0;
            this.defaultCamera.lookAt(center);
        }

        this.setCamera(DEFAULT_CAMERA);

        this.axesCamera.position.copy(this.defaultCamera.position);
        this.axesCamera.lookAt(this.axesScene.position);
        this.axesCamera.near = size / 100;
        this.axesCamera.far = size * 100;
        this.axesCamera.updateProjectionMatrix();
        this.axesCorner.scale.set(size, size, size);

        //this.controls.saveState();

        this.scene.add(object);
        this.content = object;

        this.state.punctualLights = true;

        this.content.traverse((node) => {
            if (node.isLight) {
                this.state.punctualLights = false;
            }
        });

        //this.setClips(clips);

        this.updateLights();
        this.updateGUI();
        this.updateDisplay();

        window.VIEWER.scene = this.content;

        this.printGraph(this.content);
    }

    updateLights() {
        const state = this.state;
        const lights = this.lights;

        if (state.punctualLights && !lights.length) {
            this.addLights();
        } else if (!state.punctualLights && lights.length) {
            this.removeLights();
        }

        this.renderer.toneMapping = Number(state.toneMapping);
        this.renderer.toneMappingExposure = Math.pow(2, state.exposure);

        if (lights.length === 2) {
            lights[0].intensity = state.ambientIntensity;
            lights[0].color.set(state.ambientColor);
            lights[1].intensity = state.directIntensity;
            lights[1].color.set(state.directColor);
        }
    }

    addLights() {
        const state = this.state;

        if (this.options.preset === Preset.ASSET_GENERATOR) {
            const hemiLight = new THREE.HemisphereLight();
            hemiLight.name = 'hemi_light';
            this.scene.add(hemiLight);
            this.lights.push(hemiLight);
            return;
        }

        const light1 = new THREE.AmbientLight(state.ambientColor, state.ambientIntensity);
        light1.name = 'ambient_light';
        this.defaultCamera.add(light1);

        const light2 = new THREE.DirectionalLight(state.directColor, state.directIntensity);
        light2.position.set(0.5, 0, 0.866); // ~60º
        light2.name = 'main_light';
        this.defaultCamera.add(light2);

        this.lights.push(light1, light2);
    }

    removeLights() {
        this.lights.forEach((light) => light.parent.remove(light));
        this.lights.length = 0;
    }

    setCamera(name) {
        if (name === DEFAULT_CAMERA) {
            //this.controls.enabled = true;
            this.activeCamera = this.defaultCamera;
        } else {
            //this.controls.enabled = false;
            this.content.traverse((node) => {
                if (node.isCamera && node.name === name) {
                    this.activeCamera = node;
                }
            });
        }
    }

    updateGUI() {
        this.cameraFolder.domElement.style.display = 'none';

        this.morphCtrls.forEach((ctrl) => ctrl.remove());
        this.morphCtrls.length = 0;
        this.morphFolder.domElement.style.display = 'none';

        this.animCtrls.forEach((ctrl) => ctrl.remove());
        this.animCtrls.length = 0;
        this.animFolder.domElement.style.display = 'none';

        const cameraNames = [];
        const morphMeshes = [];
        this.content.traverse((node) => {
            if (node.geometry && node.morphTargetInfluences) {
                morphMeshes.push(node);
            }
            if (node.isCamera) {
                node.name = node.name || `VIEWER__camera_${cameraNames.length + 1}`;
                cameraNames.push(node.name);
            }
        });

        if (cameraNames.length) {
            this.cameraFolder.domElement.style.display = '';
            if (this.cameraCtrl) this.cameraCtrl.remove();
            const cameraOptions = [DEFAULT_CAMERA].concat(cameraNames);
            this.cameraCtrl = this.cameraFolder.add(this.state, 'camera', cameraOptions);
            this.cameraCtrl.onChange((name) => this.setCamera(name));
        }

        if (morphMeshes.length) {
            this.morphFolder.domElement.style.display = '';
            morphMeshes.forEach((mesh) => {
                if (mesh.morphTargetInfluences.length) {
                    const nameCtrl = this.morphFolder.add(
                        {name: mesh.name || 'Untitled'},
                        'name',
                    );
                    this.morphCtrls.push(nameCtrl);
                }
                for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
                    const ctrl = this.morphFolder
                        .add(mesh.morphTargetInfluences, i, 0, 1, 0.01)
                        .listen();
                    Object.keys(mesh.morphTargetDictionary).forEach((key) => {
                        if (key && mesh.morphTargetDictionary[key] === i) ctrl.name(key);
                    });
                    this.morphCtrls.push(ctrl);
                }
            });
        }

        if (this.clips.length) {
            this.animFolder.domElement.style.display = '';
            const actionStates = (this.state.actionStates = {});
            this.clips.forEach((clip, clipIndex) => {
                clip.name = `${clipIndex + 1}. ${clip.name}`;

                // Autoplay the first clip.
                let action;
                if (clipIndex === 0) {
                    actionStates[clip.name] = true;
                    action = this.mixer.clipAction(clip);
                    action.play();
                } else {
                    actionStates[clip.name] = false;
                }

                // Play other clips when enabled.
                const ctrl = this.animFolder.add(actionStates, clip.name).listen();
                ctrl.onChange((playAnimation) => {
                    action = action || this.mixer.clipAction(clip);
                    action.setEffectiveTimeScale(1);
                    playAnimation ? action.play() : action.stop();
                });
                this.animCtrls.push(ctrl);
            });
        }
    }

    updateDisplay() {
        if (this.skeletonHelpers.length) {
            this.skeletonHelpers.forEach((helper) => this.scene.remove(helper));
        }

        traverseMaterials(this.content, (material) => {
            material.wireframe = this.state.wireframe;

            if (material instanceof PointsMaterial) {
                material.size = this.state.pointSize;
            }
        });

        this.content.traverse((node) => {
            if (node.geometry && node.skeleton && this.state.skeleton) {
                const helper = new SkeletonHelper(node.skeleton.bones[0].parent);
                helper.material.linewidth = 3;
                this.scene.add(helper);
                this.skeletonHelpers.push(helper);
            }
        });

        if (this.state.grid !== Boolean(this.gridHelper)) {
            if (this.state.grid) {
                this.gridHelper = new GridHelper();
                this.axesHelper = new AxesHelper();
                this.axesHelper.renderOrder = 999;
                this.axesHelper.onBeforeRender = (renderer) => renderer.clearDepth();
                this.scene.add(this.gridHelper);
                this.scene.add(this.axesHelper);
            } else {
                this.scene.remove(this.gridHelper);
                this.scene.remove(this.axesHelper);
                this.gridHelper = null;
                this.axesHelper = null;
                this.axesRenderer.clear();
            }
        }

        //this.controls.autoRotate = this.state.autoRotate;
    }

    addAxesHelper() {
        this.axesDiv = document.createElement('div');
        this.el.appendChild(this.axesDiv);
        this.axesDiv.classList.add('axes');

        const {clientWidth, clientHeight} = this.axesDiv;

        this.axesScene = new Scene();
        this.axesCamera = new PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 10);
        this.axesScene.add(this.axesCamera);

        this.axesRenderer = new WebGLRenderer({alpha: true});
        this.axesRenderer.setPixelRatio(window.devicePixelRatio);
        this.axesRenderer.setSize(this.axesDiv.clientWidth, this.axesDiv.clientHeight);

        this.axesCamera.up = this.defaultCamera.up;

        this.axesCorner = new AxesHelper(5);
        this.axesScene.add(this.axesCorner);
        this.axesDiv.appendChild(this.axesRenderer.domElement);
    }

    animate(time) {
        requestAnimationFrame(this.animate);

        const dt = (time - this.prevTime) / 1000;

        //this.controls.update();
        //this.stats.update();
        this.mixer && this.mixer.update(dt);
        this.render();

        this.prevTime = time;
    }

    render() {
        console.log(this.renderer, this.scene, this.activeCamera )
        this.renderer.render(this.scene, this.activeCamera);
    }

}

function traverseMaterials(object, callback) {
    object.traverse((node) => {
        if (!node.geometry) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(callback);
    });
}

ThreeDComponent.template = "light_controller.ThreeDComponent";