<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CodeBoss Space Explorer</title>
<style>
body{margin:0;overflow:hidden;background:black;}
canvas{display:block;}
</style>
</head>
<body>

<script src="https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.154.0/examples/js/controls/OrbitControls.js"></script>

<script>
const scene = new THREE.Scene();

// Kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Kontroller
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.enableZoom = true;

// Işık
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

// Yıldızlar
function createStars(num){
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for(let i=0;i<num;i++){
        vertices.push((Math.random()-0.5)*2000);
        vertices.push((Math.random()-0.5)*2000);
        vertices.push((Math.random()-0.5)*2000);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices,3));
    const material = new THREE.PointsMaterial({color:0xffffff});
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}
createStars(2000);

// Gezegen ve uydular
const planets = [];
function createPlanet(name, size, distance, color, numMoons){
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({color:color});
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    planet.userData = {name:name, size:size, moons:numMoons};
    scene.add(planet);
    planets.push({mesh:planet, distance:distance, angle:Math.random(), speed:0.001 + Math.random()*0.002, moons:[]});
    
    // Uydular
    for(let i=0;i<numMoons;i++){
        const moonGeom = new THREE.SphereGeometry(size*0.2,16,16);
        const moonMat = new THREE.MeshStandardMaterial({color:0xaaaaaa});
        const moon = new THREE.Mesh(moonGeom, moonMat);
        moon.userData = {name:name+"'s Moon "+(i+1)};
        scene.add(moon);
        planets[planets.length-1].moons.push({mesh:moon, distance:size*2+(i*3), angle:Math.random(), speed:0.005});
    }
}

// Örnek gezegenler
createPlanet("Earth", 2, 20, 0x0000ff, 1);
createPlanet("Mars", 1.5, 30, 0xff0000, 2);
createPlanet("Jupiter", 4, 50, 0xffaa00, 4);
createPlanet("Saturn", 3.5, 70, 0xffff00, 5);

function animate(){
    requestAnimationFrame(animate);
    
    // Gezegen yörüngesi ve uydular
    planets.forEach(p=>{
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle)*p.distance;
        p.mesh.position.z = Math.sin(p.angle)*p.distance;
        // Uydular
        p.moons.forEach(m=>{
            m.angle += m.speed;
            m.mesh.position.x = p.mesh.position.x + Math.cos(m.angle)*m.distance;
            m.mesh.position.z = p.mesh.position.z + Math.sin(m.angle)*m.distance;
            m.mesh.position.y = p.mesh.position.y;
        });
    });
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Gezegen tıklama
window.addEventListener('click', function(event){
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX/window.innerWidth)*2-1;
    mouse.y = -(event.clientY/window.innerHeight)*2+1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p=>p.mesh));
    if(intersects.length>0){
        alert("Gezegen: "+intersects[0].object.userData.name + "\nBoyut: "+intersects[0].object.userData.size + "\nUydular: "+intersects[0].object.userData.moons);
    }
});
</script>

</body>
</html>
