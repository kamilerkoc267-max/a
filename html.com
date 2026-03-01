<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CodeBoss Earth Explorer</title>
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Işık
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5,3,5);
scene.add(directionalLight);

// Dünya küresi
const geometry = new THREE.SphereGeometry(1, 64, 64);
const texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/2/2c/BlueMarble-2001-2002.jpg');
const material = new THREE.MeshPhongMaterial({map:texture});
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Yıldız arka plan
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];
for(let i=0;i<1000;i++){
    starsVertices.push((Math.random()-0.5)*200);
    starsVertices.push((Math.random()-0.5)*200);
    starsVertices.push((Math.random()-0.5)*200);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices,3));
const starsMaterial = new THREE.PointsMaterial({color:0xffffff});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Animasyon
function animate(){
    requestAnimationFrame(animate);
    earth.rotation.y += 0.001; // kendi ekseninde dönme
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Ülke tıklama (basit, sadece küreye tıklama)
window.addEventListener('click', function(event){
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX/window.innerWidth)*2-1;
    mouse.y = -(event.clientY/window.innerHeight)*2+1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earth);
    if(intersects.length>0){
        alert("Dünyaya tıkladınız! 🌍");
    }
});
</script>

</body>
</html>
