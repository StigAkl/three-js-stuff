class App {
    constructor() {

        this.time = 0; 
        //Setup
        this.scene = new THREE.Scene(); 
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
        this.canvas = document.getElementById("canvas"); 
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        }); 

        this.renderer.shadowMap.enabled = true; 
        this.renderer.setSize(window.innerWidth, window.innerHeight); 
        document.body.appendChild(this.renderer.domElement); 

        this.controls = new THREE.OrbitControls( this.camera ); 
        //Sphere texture
        this.texture = new THREE.TextureLoader().load('textures/earth_texture.jpg');

        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 10, 10), new THREE.MeshStandardMaterial( {wireframe: true})); 
        this.plane.rotation.x = 80; 
        this.plane.castShadow=true; 
        this.plane.receiveShadow=true; 
        this.translateObject(this.plane, 0, -15, 0); 
        this.plane.receiveShadow=true; 


        //Earth
        this.geometry = new THREE.SphereBufferGeometry(10,32,32); 
        this.material = new THREE.MeshPhongMaterial( { map: this.texture, wireframe: false });
        this.sphere = new THREE.Mesh(this.geometry, this.material); 
        this.sphere.castShadow=true; 
        //Earth's tilt angle = 42 degree = 0.408.. radians
        this.quaternion = new THREE.Quaternion();
        this.quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0.408407045 );
        this.sphere.rotation.setFromQuaternion(this.quaternion);


        //Light
        this.light = new THREE.PointLight(0xffffff, 30, 60); 
        this.light.position.set(0,40,25); 
        this.light.castShadow=true; 
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1); 
        this.ambientLight.position.set(0,10,0); 
    
        //Add to scene
        this.scene.add(this.ambientLight);
        this.scene.add(this.sphere); 
        this.scene.add(this.plane); 
        this.scene.add(this.light); 
        this.camera.position.z = 30; 

        this.render(); 
    }

    translateObject(object, x, y, z) {
        object.position.x += x; 
        object.position.y += y; 
        object.position.z += z; 
    }

    resizeCanvas() {
        this.camera.aspect = window.innerWidth / window.innerHeight; 
        this.camera.updateProjectionMatrix(); 

        this.renderer.setSize(window.innerWidth, window.innerHeight); 
    }

    animate() {
        this.sphere.rotation.y+= 0.003; 
    }

    render() {
        this.controls.update(); 
        this.renderer.render(this.scene, this.camera); 
        this.animate(); 
        window.requestAnimationFrame(this.render.bind(this)); 
    }
}