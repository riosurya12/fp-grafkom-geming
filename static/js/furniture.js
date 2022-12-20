var buatFurniture = function() {
  // Atur Materialnya
  // dipakai di kamar
  this.roomMaterial = new THREE.MeshPhongMaterial({color: 0xc39bd3, shininess: 100});
  this.roomMaterial.transparent = false;
  this.lightMaterial = this.roomMaterial.clone();
  this.lightMaterial.side = THREE.FrontSide;

  // dipakai bawah tempat tidur dan tembok untuk warna
  this.frameMaterial = new THREE.MeshPhongMaterial({color: 0x2E4053});
  var self = this;
  this.kasurMaterial = new THREE.MeshPhongMaterial({color: 0xAED6F1});

  // Untuk update teksture tempat tidur
  this.loadBedNormalMap = function(texturePath) {
    TW.loadTextures(
      [texturePath],
      function(textures) {
        self.kasurMaterial.normalMap = textures[0];
        self.kasurMaterial.normalScale.set(0,0);
        self.kasurMaterial.needsUpdate = true;
      });
  };
  // untuk memberikan tekstur pada tempat tidur
  this.loadBedNormalMap('static/images/kasur3.jpg');

  // Untuk pewarnaan radio
  this.radioBodyMaterial = new THREE.MeshPhongMaterial({color: 0xe06f4a});
  this.speakerCoverMaterial = new THREE.MeshPhongMaterial({color: 0x666666});
  this.tunerScreenMaterial = new THREE.MeshPhongMaterial({color: 0xf7e0a2, shininess: 1});

  // warna mejanya
  this.mejaTopMaterial = new THREE.MeshPhongMaterial({color: 0xF0F3F4});
  this.legMaterial = new THREE.MeshPhongMaterial({color: 0x34495E});

  // clone material kursi sama dengan radio
  this.kursiMaterial = new THREE.MeshPhongMaterial({color: 0x7DCEA0});
  //this.lightFrameMaterial = new THREE.MeshPhongMaterial({color : 0x7DCEA0});

  // clone material kulkas
  this.kulkasMaterial = new THREE.MeshPhongMaterial({color: 0xF5B041});
  this.handleMaterial = this.kulkasMaterial.clone();
}

//buat bentuk dan ukuran ruangan
buatFurniture.prototype.Room = function(width, height, length, roomNum) {

  // normal
  var width = (width) ? width : 5;
  var height = (height) ? height : 3;
  var length = (length) ? length : 3;

  var room = new THREE.Object3D();

  var roomGeom = new THREE.BoxGeometry(width, height, length);
  var roomWalls = new THREE.Mesh(roomGeom, this.roomMaterial);
  roomWalls.material.side = THREE.BackSide;
  roomWalls.position.setY(height/2);
  room.add(roomWalls);


  var LampuAtas = new THREE.Object3D();
  
  var CoverLampuGeom = new THREE.CylinderGeometry(width/20,
                                                  width/20,
                                                  height/30,
                                                  20);
  var CoverLampu = new THREE.Mesh(CoverLampuGeom, this.lightMaterial);
  var lightFrameGeom = new THREE.SphereGeometry(width/19, 20, 20);
  var lightFrame = new THREE.Mesh(lightFrameGeom, this.lightMaterial);
  CoverLampu.position.setY(-height/(2*30));
  lightFrame.scale.setY(0.1);
  LampuAtas.add(CoverLampu);
  LampuAtas.add(lightFrame);
  LampuAtas.position.setY(height);
  room.add(LampuAtas);

  return room;
}

//buat bentuk dan ukuran tempat tidur
buatFurniture.prototype.Bed = function(width, height, length) {

  // normal
  var width = (width) ? width : 1.5;
  var height = (height) ? height : 0.2;
  var length = (length) ? length : 2.5;
  
  var bed = new THREE.Object3D();

  //tempat tidur bagian atas
  var topKasur = new THREE.Mesh(
    new THREE.BoxGeometry( width, height, length),
    this.kasurMaterial);
  topKasur.position.setY(height * 2.5);
  bed.add(topKasur);
  
  //tempat tidur bagian tengah
  var middleKasur = topKasur.clone();
  middleKasur.position.setY(height * 1.5);
  bed.add(middleKasur);

  //tempat tidur bagian bawah
  var frame = new THREE.Mesh(
    new THREE.BoxGeometry( width, height, length),
    this.frameMaterial);
  frame.position.setY(height * 0.5);
  bed.add(frame);

  return bed;
}

//semua milik radio
buatFurniture.prototype.Radio = function(width, height, length, antennaRadius, antennaLength) {

  // normal
  var width = (width) ? width : 0.3;
  var height = (height) ? height : 0.2;
  var length = (length) ? length : 0.05;
  var antennaRadius = (antennaRadius) ? antennaRadius : 0.5;
  var antennaLength = (antennaLength) ? antennaLength : 0.25;

  var radio = new THREE.Object3D();

  // buat bentuk radio
  var bodyGeom = new THREE.BoxGeometry(width,
                                       height,
                                       length);
  var body = new THREE.Mesh(bodyGeom, this.radioBodyMaterial);
  body.position.setY(height/2);
  radio.add(body);

  // Radio antenna
  var antennaGeom = new THREE.CylinderGeometry(antennaRadius,
                                               antennaRadius,
                                               antennaLength);
  var antenna = new THREE.Mesh(antennaGeom, this.radioBodyMaterial);
  antenna.position.setX(-width/8);
  antenna.position.setY(height + antennaLength/3);
  antenna.rotation.x = Math.PI/8;
  antenna.rotation.y = Math.PI/8;
  antenna.rotation.z = -Math.PI/4;
  radio.add(antenna);

  //buat speaker radio
  var cover = new THREE.Object3D();
  var coverPieceVertGeom = new THREE.CylinderGeometry(width/60,
                                                  width/60,
                                                  height);
  var coverPieceVert = new THREE.Mesh(coverPieceVertGeom, this.speakerCoverMaterial);
  for (var i=0; i<width/2; i += width/25) {
    var temp = coverPieceVert.clone()
    temp.position.setX(i);
    cover.add(temp);
  }
  var coverPieceHorizGeom = new THREE.CylinderGeometry(width/60,
                                                  width/60,
                                                  width/2);
  var coverPieceHoriz = new THREE.Mesh(coverPieceHorizGeom, this.speakerCoverMaterial);
  coverPieceHoriz.rotation.z = -Math.PI/2;
  coverPieceHoriz.position.setX(width/4);
  for (var i=0; i<height; i += height/25) {
    var temp = coverPieceHoriz.clone()
    temp.position.setY(i - height/2);
    cover.add(temp);
  }
  cover.position.setX(-width/2);
  cover.position.setY(height/2);
  cover.position.setZ(length/2);
  radio.add(cover);
  

  // untuk layar radio
  var tunerGeom = new THREE.BoxGeometry(width/3, height/6, 0.01);
  var tuner = new THREE.Mesh(tunerGeom, this.tunerScreenMaterial);
  tuner.position.set(width/4,
                     3 * height/4,
                     length/2);
  radio.add(tuner);

  // buatkan tombol radio
  var onButtonGeom = new THREE.CylinderGeometry(width/16, width/16, 0.05);
  var onButton = new THREE.Mesh(onButtonGeom, this.radioBodyMaterial);
  onButton.position.set(width/6,
                        height/2,
                        length/2);
  onButton.rotation.x = Math.PI/2;
  radio.add(onButton);

  return radio;
}

//untuk meja dan kaki meja dulu
buatFurniture.prototype.Meja = function(width, height, length, thickness, legRadius, bottomLegRadius) {

  // normal
  var width = (width) ? width : 1.15;
  var height = (height) ? height : 0.9;
  var length = (length) ? length : 1.5;
  var thickness = (thickness) ? thickness : 0.08;
  var legRadius = (legRadius) ? legRadius : 0.03;
  var bottomLegRadius = (bottomLegRadius) ? bottomLegRadius : legRadius;


  var meja = new THREE.Object3D();

  // meja atasnya
  var mejaTopGeom = new THREE.BoxGeometry(width,
                                           thickness,
                                           length);
  var mejaTop = new THREE.Mesh(mejaTopGeom, this.mejaTopMaterial);
  mejaTop.position.setY(height - thickness/2);
  meja.add(mejaTop);

  // kaki meja
  var legGeom = new THREE.CylinderGeometry(legRadius,
                                           bottomLegRadius,
                                           height - thickness,
                                           20);
  var leg = new THREE.Mesh(legGeom, this.legMaterial);
  leg.position.setY((height - thickness)/2);

  var KakiKiriDepan = leg.clone();
  KakiKiriDepan.position.setX(-width/2 + legRadius)
  KakiKiriDepan.position.setZ(-length/2 + legRadius);

  var KakiKananDepan = leg.clone();
  KakiKananDepan.position.setX(width/2 - legRadius);
  KakiKananDepan.position.setZ(-length/2 + legRadius);

  var KakiKananBelakang = leg.clone();
  KakiKananBelakang.position.setX(width/2 - legRadius);
  KakiKananBelakang.position.setZ(length/2 - legRadius);

  var KakiKiriBelakang = leg.clone();
  KakiKiriBelakang.position.setX(-width/2 + legRadius)
  KakiKiriBelakang.position.setZ(length/2 - legRadius);

  meja.add(KakiKiriDepan);
  meja.add(KakiKananDepan);
  meja.add(KakiKananBelakang);
  meja.add(KakiKiriBelakang);

  return meja;
}

//kulkas kulkas
buatFurniture.prototype.Kulkas = function(width, height, length) {
  var width = (width) ? width : 1;
  var height = (height) ? height : 2.5;
  var length = (length) ? length : 0.8;

  var kulkas = new THREE.Object3D();

  var mainBoxGeom = new THREE.BoxGeometry(width,
                                          height,
                                          4*length/5);
  var mainBox = new THREE.Mesh(mainBoxGeom, this.kulkasMaterial);
  mainBox.position.setY(height/2);
  kulkas.add(mainBox);

  var PintuAtas = new THREE.Object3D();
  var PintuAtasWallGeom = new THREE.BoxGeometry(width,
                                          height/3.5, 
                                          length/5 - length/25);  
  var PintuAtasWall = new THREE.Mesh(PintuAtasWallGeom, this.kulkasMaterial);
  PintuAtasWall.position.setY(height - height/(3.5*2));

  var PintuAtasHandleCurve =new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, height/3.5 - height/25, 0),
    new THREE.Vector3(length/8, height/8, 0),
    new THREE.Vector3(length/4, height/25, 0),
    new THREE.Vector3(0, height/25, 0));
  var PintuAtasHandleGeom = new THREE.TubeGeometry( PintuAtasHandleCurve, 20, 0.025, 8, false );
  var PintuAtasHandle = new THREE.Mesh( PintuAtasHandleGeom, this.handleMaterial );
  PintuAtasHandle.position.set(-width/2 + 0.08, 
                              height - (height/3.5),
                              0.05); 
  PintuAtasHandle.rotation.y = -Math.PI/2;
  
  PintuAtas.add(PintuAtasWall);
  PintuAtas.add(PintuAtasHandle);
  PintuAtas.position.setZ(length/2 + length/25); 
  
  kulkas.add(PintuAtas);

  var PintuBawah = new THREE.Object3D();
  var PintuBawahWallGeom = new THREE.BoxGeometry(width,
                                                 height/1.5, 
                                                 length/5 - length/25);  
  var PintuBawahWall = new THREE.Mesh(PintuBawahWallGeom, this.kulkasMaterial);
  PintuBawahWall.position.setY(height/(1.5*2));

  var PintuBawahHandleGeom = PintuAtasHandleGeom.clone();
  var PintuBawahHandle = new THREE.Mesh( PintuBawahHandleGeom, this.handleMaterial );
  PintuBawahHandle.position.set(-width/2 + 0.08,
                              height/1.5,
                              0.05);
  PintuBawahHandle.rotation.z = Math.PI;
  PintuBawahHandle.rotation.y = Math.PI/2;

  PintuBawah.add(PintuBawahWall);
  PintuBawah.add(PintuBawahHandle);
  PintuBawah.position.setZ(length/2 + length/25);

  kulkas.add(PintuBawah);

  return kulkas;
}

//saatnya buat kursi
buatFurniture.prototype.Kursi = function(width, height) {
 
  var width = (width) ? width : 0.5;
  var height = (height) ? height : 1.5;

  var kursi = new THREE.Object3D();

  var kursiSurfaceGeom = new THREE.BoxGeometry(width, width, height/20);
  var kursiSurface = new THREE.Mesh(kursiSurfaceGeom, this.kursiMaterial);

  var seat = kursiSurface.clone();
  seat.position.setY(3 * height/8);
  seat.rotation.x = Math.PI/2;

  var back = kursiSurface.clone()
  back.position.setY(5 * height/8);
  back.position.setZ(-width/2);

  var longLegGeom = new THREE.CylinderGeometry(width/20,
                                               width/20,
                                               2 * height/3);
  var longLeg = new THREE.Mesh(longLegGeom, this.kursiMaterial);
  longLeg.rotation.x = -3 * Math.PI/16;
  longLeg.position.setY(height/4);

  var leftLongLeg = longLeg.clone();
  leftLongLeg.position.setX(-width/2 - width/20);
  var rightLongLeg = longLeg.clone();
  rightLongLeg.position.setX(width/2 + width/20);

  var smallLeg = longLeg.clone();
  smallLeg.scale.setY(3/4);
  smallLeg.position.setY(height/5);
  smallLeg.rotation.x = 3 * Math.PI/16;

  var leftShortLeg = smallLeg.clone();
  leftShortLeg.position.setX(-width/2 - width/20);

  var rightShortLeg = smallLeg.clone();
  rightShortLeg.position.setX(width/2 + width/20);

  kursi.add(seat);
  kursi.add(back);
  kursi.add(leftLongLeg);
  kursi.add(leftShortLeg);
  kursi.add(rightLongLeg);
  kursi.add(rightShortLeg);

  return kursi;
};