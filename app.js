class App {
    constructor() {

        this.time = 0; 
        this.temperature = 14; 
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

        this.controls.keys = {
            LEFT: 37, //left arrow
            UP: 38, // up arrow
            RIGHT: 39, // right arrow
            BOTTOM: 40 // down arrow
        }
        //Sphere texture
        this.texture = new THREE.TextureLoader().load('textures/earth_texture.jpg');

        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 50, 50), new THREE.MeshStandardMaterial( {color: 0x222222, wireframe: true}));
        this.createGravityWell();  
        this.plane.rotation.x = Math.PI / 2; 
        this.plane.castShadow=true; 
        this.plane.receiveShadow=true; 
        this.translateObject(this.plane, 0, -15, 0); 
        this.plane.receiveShadow=true; 


        //Earth
        this.geometry = new THREE.SphereBufferGeometry(25,64,64); 
        this.material = new THREE.MeshPhongMaterial( {  map: this.texture});
        this.sphere = new THREE.Mesh(this.geometry, this.material); 
        this.sphere.castShadow=true; 
        //Earth's tilt angle = 42 degree = 0.408.. radians
        this.quaternion = new THREE.Quaternion();
        this.quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0.408407045 );
        this.sphere.rotation.setFromQuaternion(this.quaternion);


        //Light
        this.light = new THREE.DirectionalLight(this.generateColor(this.temperature), 2); 
        this.light.position.set(0,50,70); 
        this.light.castShadow=true; 
        this.ambientLight = new THREE.AmbientLight(this.generateColor(this.temperature), 8); 
        this.ambientLight.position.set(10,10,10); 

        //Add to scene
        this.scene.add(this.ambientLight);
        this.scene.add(this.sphere); 
        this.scene.add(this.plane); 
        this.scene.add(this.light); 
        this.camera.position.z = 90; 

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

    createGravityWell() {
        let vertices = this.plane.geometry.vertices; 

        let center = this.getCenterPoint(this.plane); 

        for(var i = 0; i < vertices.length; i++) {
            let distance = this.distanceVector(new THREE.Vector3(vertices[i].x, vertices[i].y, vertices[i].z), center);
            let z = Math.pow((distance - 40)/8, 2); 
            
            if(distance < 40) 
                vertices[i].z = z; 
        }

        this.plane.geometry.vertices=vertices; 
    }

    createStars(radius, segments) { 
        return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/shared/galaxy_starfield.jpg'), side: THREE.BackSide 
    }));
    }

    distanceVector( v1, v2 )
    {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z; 

        return Math.sqrt( dx * dx + dy * dy + dz * dz);
    }

    getCenterPoint(mesh) {
        var middle = new THREE.Vector3();
        var geometry = mesh.geometry;
    
        geometry.computeBoundingBox();
    
        middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
        middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
        middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
    
        mesh.localToWorld( middle );
        return middle;
    }

    generateColor(temperature) {
        let colors = [0x00bcff, 0x84b2d9, 0xafa8b3, 0xf18741, 0xffc900, 0xff0010]; 

        let color = colors[0]; 
        if(temperature >= 15 && temperature < 18) {
            color = colors[1];
        } else if(temperature >= 18 && temperature < 20) {
            color = colors[2]; 
        } else if(temperature >= 20 && temperature < 23) {
            color = colors[3]; 
        } else if(temperature >= 23 && temperature < 25){
            color = colors[4]; 
        } else if(temperature >= 25) {
            color = colors[5]; 
        }
        return color; 
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