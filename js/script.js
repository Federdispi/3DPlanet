function init() {
  const renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl').appendChild(renderer.domElement);

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

// Création de la grande sphère
var largerBallGeometry = new THREE.SphereGeometry(1, 32, 32);
var largerBallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var largerBall = new THREE.Mesh(largerBallGeometry, largerBallMaterial);

// Création de la petite sphère
var smallerBallGeometry = new THREE.SphereGeometry(0.1, 32, 32);
var smallerBallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var smallerBall = new THREE.Mesh(smallerBallGeometry, smallerBallMaterial);

scene.add(largerBall);
scene.add(smallerBall);

// Matrice d'inversion
const matriceInversion = new THREE.Matrix4().getInverse(new THREE.Matrix4());

// Inversion de la sphère pour obtenir un plan
largerBallGeometry.applyMatrix(matriceInversion);

// Points de contrôle de la courbe de Bézier
const point1 = new THREE.Vector3(-0.5, 0, 0);
const point2 = new THREE.Vector3(0, 0.5, 0);
const point3 = new THREE.Vector3(0.5, 0, 0);

// Poids de la courbe de Bézier
const weight1 = 1;
const weight2 = 1;
const weight3 = 1;

// On trace la courbe de Bézier y1 dans le plan
const curve = new THREE.QuadraticBezierCurve3(point1, point2, point3);
const points = curve.getPoints(50);
const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
const curveMaterial = new THREE.LineBasicMaterial({ color : 0xffffff });
const curveLine = new THREE.Line(curveGeometry, curveMaterial);

// Points de contrôle de la courbe y2 = I(y1)
const invertedPoint1 = point1.applyMatrix4(matriceInversion);
const invertedPoint2 = point2.applyMatrix4(matriceInversion);
const invertedPoint3 = point3.applyMatrix4(matriceInversion);

// On trace y2
const invertedCurve = new THREE.QuadraticBezierCurve3(invertedPoint1, invertedPoint2, invertedPoint3);
const invertedPoints = invertedCurve.getPoints(50);
const invertedCurveGeometry = new THREE.BufferGeometry().setFromPoints(invertedPoints);
const invertedCurveMaterial = new THREE.LineBasicMaterial({ color : 0x0000ff });
const invertedCurveObject = new THREE.Line(invertedCurveGeometry, invertedCurveMaterial);


scene.add(curveLine);
scene.add(invertedCurveObject)

function animate() {
  requestAnimationFrame(animate);
  var t = (Date.now() / 1000) % 1;
  smallerBall.position.copy(curve.getPointAt(t));
  renderer.render(scene, camera);
}
animate();

// Menu GUI
let gui = new dat.GUI();
 let menuGUI = new function () {
  this.cameraxPos = camera.position.x;
  this.camerayPos = camera.position.y;
  this.camerazPos = camera.position.z;
  this.cameraZoom = 1;
  this.cameraxDir = 0;
  this.camerayDir = 0;
  this.camerazDir = 0;

  this.actualisation = function () {
    posCamera();
    reAffichage();
  };
 };

 ajoutCameraGui(gui, menuGUI, camera);
}