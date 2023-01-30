const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(0, 0, 15);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

var largerBallGeometry = new THREE.SphereGeometry(5, 32, 32);
var largerBallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var largerBall = new THREE.Mesh(largerBallGeometry, largerBallMaterial);

var smallerBallGeometry = new THREE.SphereGeometry(1, 32, 32);
var smallerBallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var smallerBall = new THREE.Mesh(smallerBallGeometry, smallerBallMaterial);

scene.add(largerBall);
scene.add(smallerBall);

var curve = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(-5, 15, 0),
  new THREE.Vector3(20, 15, 0),
  new THREE.Vector3(10, 0, 0)
);

var curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
var curveMaterial = new THREE.LineBasicMaterial({ color : 0xffffff });
var curveLine = new THREE.Line(curveGeometry, curveMaterial);

scene.add(curveLine);

function animate() {
  requestAnimationFrame(animate);
  var t = (Date.now() / 1000) % 1;
  smallerBall.position.copy(curve.getPointAt(t));
  renderer.render(scene, camera);
}
animate();
//renderer.setAnimationLoop(animate);