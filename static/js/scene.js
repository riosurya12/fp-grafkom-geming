var Furniture = new buatFurniture();

function createScene(params, roomNum) {
  var newScene = new THREE.Object3D();
  
  var room = Furniture.Room(params.roomWidth,
                            params.roomHeight,
                            params.roomLength);
  newScene.add(room);

  var topLight = new THREE.PointLight( 0xffffff, 0.5);
  topLight.layers.set(roomNum);
  topLight.position.y = 9 * params.roomHeight/10;
  newScene.add(topLight);

  var bed = Furniture.Bed(params.bedWidth, params.bedHeight, params.bedLength);
  bed.layers.set(roomNum);
  bed.position.setX(params.roomWidth/2 - params.bedWidth/2);
  bed.position.setZ(-params.roomLength/2 + params.bedLength/2);
  newScene.add(bed);

  var meja = Furniture.Meja(params.mejaWidth, params.mejaHeight, params.mejaLength);
  meja.layers.set(roomNum);
  meja.position.setX(-params.roomWidth/2 + params.mejaWidth/2 + 0.05);
  meja.position.setZ(params.roomLength/2 - params.mejaLength/2 - 0.25);
  newScene.add(meja);

  var radio = Furniture.Radio(params.radioWidth,
                              params.radioHeight,
                              params.radioLength,
                              params.radioAntRadius,
                              params.radioAntLength);
  radio.layers.set(roomNum);
  radio.position.set(-6*params.roomWidth/16,
                     params.mejaHeight,
                     params.roomLength/4);
  radio.rotation.y = 5 * Math.PI/8;
  newScene.add(radio);

  var kulkas = Furniture.Kulkas(params.kulkasWidth, params.kulkasHeight, params.kulkasLength);
  kulkas.layers.set(roomNum);
  kulkas.position.setX(-params.roomWidth/2 + params.kulkasLength/2);
  kulkas.position.setZ(-params.roomLength/2 + params.kulkasWidth/2 + 0.1);
  kulkas.rotation.y = Math.PI / 2
  newScene.add(kulkas);

  var kursi = Furniture.Kursi(params.kursiWidth, params.kursiHeight);
  kursi.layers.set(roomNum);
  kursi.rotation.y = -Math.PI/2;
  kursi.position.set(-params.roomWidth/2 + 3*params.mejaWidth/4 + params.kursiWidth,
                   0,
                   params.roomLength/2 - params.mejaLength/2);
  newScene.add(kursi);

  newScene.add(makeRobot(params));

  return newScene;
}


function makeRobot(params) {
  var robot = new THREE.Object3D();

  var robotBodyTopGeom = new THREE.BoxGeometry( params.roomWidth + 0.2, params.roomHeight/3, params.roomLength );
  var robotBodyTop = new THREE.Mesh( robotBodyTopGeom, Furniture.radioBodyMaterial );
  var robotBodyBottom = robotBodyTop.clone();

  // membuat ruangan baru bagian atas bawah
  robotBodyTop.position.setY( 7 * params.roomHeight/6  + 0.005 ); //jadiin 0.005 biar tidak kelebihan atas bawah
  robotBodyBottom.position.setY( -params.roomHeight/6 - 0.005 );  //jadiin 0.005 biar tidak kelebihan atas bawah
  robot.add(robotBodyTop);
  robot.add(robotBodyBottom);

  var robotSideGeom = new THREE.BoxGeometry(params.roomWidth/6, 5 * params.roomHeight/3, params.roomLength + 0.2);
  var robotSideLeft = new THREE.Mesh( robotSideGeom, Furniture.radioBodyMaterial );
  robotSideLeft.position.setY( params.roomHeight/2 );
  robotSideLeft.position.setZ( -0.1 );
  var robotSideRight = robotSideLeft.clone();
  
  // Membuat ruangan baru bagian kanan kiri
  robotSideLeft.position.setX( -7 * params.roomWidth/12  - 0.05 );
  robotSideRight.position.setX( 7 * params.roomWidth/12 + 0.05 );
  robot.add( robotSideLeft );
  robot.add( robotSideRight );

  var robotBackGeom = new THREE.BoxGeometry( 4 * params.roomWidth/3, 5 * params.roomHeight/3 , 0.15 );
  var robotBack = new THREE.Mesh( robotBackGeom, Furniture.radioBodyMaterial );
  robotBack.position.setY( params.roomHeight/2 );
  robotBack.position.setZ( -params.roomLength/2 - 0.15 );
  robot.add( robotBack );

  var bottom = new THREE.Object3D();
  bottom.position.setY( -params.roomHeight/2 );
  
  var tori = new THREE.Object3D();  // untuk animasi loop
  tori.name = "tori";
  

  bottom.add( tori );
  robot.add( bottom );

  return robot;
}


var canvas = createCanvas();
var scenes = [],
    renderer,
    camera;

function createCanvas() {
  var canvas = document.getElementById("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "canvas",
    document.body.appendChild(canvas)
  }
  canvas.width = window.innerWidth,
  canvas.height = window.innerHeight
  return canvas;
}

function sceneSetup(params) {
  var scene = new THREE.Scene();

  for (var i=0.2, j=0; i<=625; i *= 5, j++) {
    var temp = createScene(params, j);

    temp.scale.set(i,i,i);
    temp.position.setZ( i * params.roomLength/3);
    temp.position.setY( i * -params.roomLength/2 );
    temp.rotation.y = params.pemainRotation;

    scene.add(temp);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  return scene;
}

var Creative = function(params) {
  // buat render
  renderer = new THREE.WebGLRenderer({
    canvas: canvas
  });
  
  renderer.setSize(canvas.clientWidth,canvas.clientHeight);
  renderer.setClearColor(0xffffff, 1);
  renderer.autoClear = false;

  scene = sceneSetup(params, sceneNum);

  startScene = scene.children[4];
  startPoint = getFrontPoint(startScene, params);

  endScene = scene.children[5];
  endPoint = getFrontPoint(endScene, params);

  camera = new THREE.PerspectiveCamera(75, 
                                       canvas.clientWidth / canvas.clientHeight, 
                                       0.1, 
                                       3000);
  camera.position.copy(startPoint);
  cameraPath = calculateCameraPath(startPoint, endPoint);

  return {renderer: renderer, camera: camera}
}

//semua parameter yang dibutuhkan scene
var params = {
  roomWidth: 5,
  roomHeight: 3,
  roomLength: 3,
  lightDistance: 1,
  
  bedWidth: 1.5,
  bedHeight: 0.2,
  bedLength: 2.5,
  
  mejaWidth: 1.15,
  mejaHeight: 0.9,
  mejaLength: 1.5,
  mejaThickness: 0.08,
  mejaLegRadius: 0.03,

  radioWidth: 0.3,
  radioHeight: 0.2,
  radioLength: 0.05,
  radioAntLength: 0.25,
  radioAntRadius: 0.005,
  
  kulkasWidth: 1,
  kulkasHeight: 2.5,
  kulkasLength: 0.7,

  kursiWidth: 0.5,
  kursiHeight: 1.5,

  pemainRotation: 0, //atur rotasi kamera
  cameraInterval: 1000000000, //atur kecepatan mundur kamera
}

function applySceneChange(miniScene) {
  if (params.pemainKanan) {
    miniScene.rotation.y += Math.PI/128;
  }
  if (params.pemainKiri) {
    miniScene.rotation.y -= Math.PI/128;
  }

  if (params.pemainKedepan) {
    miniScene.position.z += Math.cos(miniScene.rotation.y) * 1;
    miniScene.position.x += Math.sin(miniScene.rotation.y) * 1;
  } 
  if (params.pemainKebelakang) {
    miniScene.position.z -= Math.cos(miniScene.rotation.y) * 1;
    miniScene.position.x -= Math.sin(miniScene.rotation.y) * 1;
  }

  if (params.pemainAtas) {
    miniScene.position.y += 10;
  }
  if (params.pemainBawah) {
    miniScene.position.y -= 10;
  }

  var tori = miniScene.getObjectByName( "tori", true );
  for (var i=0; i<tori.children.length; i++) {
    tori.children[i].position.setY(tori.children[i].position.y - 0.015);

    tori.children[i].scale.x -= 0.005;
    tori.children[i].scale.y -= 0.005;
    tori.children[i].scale.z -= 0.005;

    tori.children[i].material.transparent = true;
    tori.children[i].material.opacity -= 0.005;
    if  (tori.children[i].position.y < -4 * params.roomHeight/5) {
      console.log(tori.children[i]);
      tori.children[i].position.setY( 0 );
      tori.children[i].scale.set(1, 1, 1);
      tori.children[i].material.opacity = 1;
    }
  }
}

function calculateCameraPath(startPoint, endPoint) {
  var outDirection = startPoint.clone()
    .add(startPoint.clone());
  var inDirection = endPoint.clone()
    .sub(endPoint.clone().divideScalar(3));
  var final = endPoint.clone()
    .add(endPoint.clone().sub(inDirection).normalize());

  return new THREE.CubicBezierCurve3(startPoint,
                                     outDirection,
                                     inDirection,
                                     final);
}

// For updating scenes
var sceneNum = 0;
var cameraPath;


function render() {
  requestAnimationFrame(render);
  //camera.position.z += 0.4 + (new Date().getTime() - counter) * 0.0002;
  var point = (new Date().getTime() - counter) * 2 /params.cameraInterval;

  camera.position.copy(cameraPath.getPointAt(point));
  camera.lookAt(cameraPath.getPointAt(point - 0.01));

  for (var i=0; i<scene.children.length - 2; i++) {
    applySceneChange(scene.children[i]);
  }
  
  if ( camera.position.distanceTo(endPoint) <= 5 ) {
    counter = new Date().getTime();

    startScene = scene.children[4];
    endScene = scene.children[5];

    startPoint = getFrontPoint(startScene, params);
    endPoint = getFrontPoint(endScene, params);

    cameraPath = calculateCameraPath(startPoint, endPoint);
  } else {
    // console.log(camera.position.distanceTo(endPoint));
  }
  renderer.render( scene, camera );
}


function getFrontPoint(tempScene, params) {
  var sphere = new THREE.SphereGeometry(0.01, 32, 32);
  var material = new THREE.MeshBasicMaterial( {color: 0xb05ecc} );
  var frontPoint = new THREE.Mesh( sphere, material );

  frontPoint.position.setY( params.roomHeight/2 );
  frontPoint.position.setZ( params.roomLength/2 );

  tempScene.add(frontPoint);

  frontPoint.visible = false;

  tempScene.updateMatrixWorld();
  var pos = new THREE.Vector3();

  return pos.setFromMatrixPosition(frontPoint.matrixWorld);
}

var counter;
var startScene, startPoint;
var endScene, endPoint;

//untuk mengsetup render
window.onload = function() {
  var model = new Creative(params);
  counter = new Date().getTime();

  render();
}

//buat input keyboard mengarahkan wasdqe
function toggleKeys(event) {
  const keyName = event.key;
  var state = (event.type == "keydown") ? true : false;

  switch (keyName) {
    case 'w':
      params.pemainKedepan = state;
      break;
    case 's':
      params.pemainKebelakang = state;
      break;
    case 'a':
      params.pemainKiri = state;
      break;
    case 'd':
      params.pemainKanan = state;
      break;
    case 'e':
      params.pemainAtas = state;
      break;
    case 'q':
      params.pemainBawah = state;
      break;
  }
}

document.addEventListener('keydown', toggleKeys);
document.addEventListener('keyup', toggleKeys);
