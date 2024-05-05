/** @odoo-module **/

import { Component, onMounted, useRef } from "@odoo/owl";

const Preset = {ASSET_GENERATOR: 'assetgenerator'};

const DEFAULT_CAMERA = '[default]';

const MANAGER = new THREE.LoadingManager();

export class ThreeDComponent extends Component {
    static template = "light_controller.ThreeDComponent";

    setup() {
        this.ref = useRef("canvas");
        onMounted(() => {
            this.initThreeJS();
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
        scene.background = new THREE.Color('#f8f9fa');

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();
    }
}

ThreeDComponent.template = "light_controller.ThreeDComponent";