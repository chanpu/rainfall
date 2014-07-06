d3.json("japan.json",function(json) {
    d3main(json);
});
loadDataFile("pre.csv");
var citybox = [];
var month,day;
    month=0;
    day=0;
// シーンの追加
var scene = new THREE.Scene();
function d3main(json) {
    var container;
    var camera, renderer;
    var mesh,meshColor;
    initScene(json);
    render();
    animate();
}
// メインの処理
function initScene(json) {
    container = document.getElementById('japan');
    var width = window.innerWidth;
    var height = window.innerHeight;
    // レンダラーの作成
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width,height);
    renderer.setClearColor(0x6CAAFF, 1);
    container.appendChild(renderer.domElement);

    // カメラの設定
    // 画角,縦横比,クリッピングnear,クリッピングfar
    camera = new THREE.PerspectiveCamera(75,width/height, 1, 10000);
    camera.position.set(0, 0, 300);

    // コントローラーの生成
    controls = new THREE.TrackballControls(camera);
    scene.add(camera);

    // ライトの設定
    var light = new THREE.DirectionalLight(0xDDDDDD, 2);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    //geojsonデータ読み込み
    var geodata = json.features;

    //path生成
    var path = d3.geo.path()
        .projection(d3.geo.mercator()
        .translate([-2200,660])
        .scale(900)
        );

    //geoJSONをsvgに変換してmesh変換する処理
    var countries = [];
    for (i = 0 ; i < geodata.length ; i++) {
      var geoFeature = geodata[i];
      var properties = geoFeature.properties;
      var feature = path(geoFeature);
      //svgパスをthree.jsのmeshに変換
      var gmesh = transformSVGPathExposed(feature);
      for (j = 0 ; j < gmesh.length ; j++) {
        countries.push({"data": properties, "mesh": gmesh[j]});
      }
    }

    //日本地図
    for (i = 0 ; i < countries.length ; i++) {
      meshColor = color();
      var material = new THREE.MeshPhongMaterial({
        name:countries[i].data['PREF'],
        color: meshColor,
        opacity:1
      });
      var shape3d = countries[i].mesh.extrude({
        amount: 0,
        bevelEnabled: false,
      });
      var toAdd = new THREE.Mesh(shape3d, material);
      toAdd.rotation.x = Math.PI/2 * 10;
      scene.add(toAdd);
    }

    //各地の降水量オブジェクト
    for(var i=0;i<67;i++){
      city = new City(pref[1][i+1],pref[2][i+1],pref[3][i+1]);
      citybox.push(city.threeObj);
      scene.add(city.threeObj);
    }
}
// 月のパラメータの変更によるデータの変更を行う関数
function changeMonth(value){
  for(var i=0;i<67;i++){
      if(pref[1] !== undefined){
        rmcity = citybox.shift();
        scene.remove(rmcity);
        city = new City(pref[1][i+1],pref[2][i+1],pref[31*(value-1)+3+day][i+1]);
        citybox.push(city.threeObj);
        scene.add(city.threeObj);
        month=value-1;
      }
  }
}
// 日のパラメータの変更によるデータの変更を行う関数
function changeDay(value){
  for(var i=0;i<67;i++){
      if(pref[1] !== undefined){
        rmcity = citybox.shift();
        scene.remove(rmcity);
        city = new City(pref[1][i+1],pref[2][i+1],pref[month*31+3+(value-1)][i+1]);
        citybox.push(city.threeObj);
        scene.add(city.threeObj);
        day=value-1;
      }
  }
}
// 降水オブジェクトを生成する関数
function City(x,y,size){
  var geometry = new THREE.CubeGeometry(5,5,size,1,1);
  var cubeColor = dropColor(size);
  var material = new THREE.MeshBasicMaterial({color:cubeColor});
  var pointPin = new THREE.Mesh(geometry,material);
  //メルカトル図法
  var mercator = d3.geo.mercator()
      .translate([-2200,660])
      .scale(900);
  var c = mercator([y,x]);
  pointPin.position.x = c[0];
  pointPin.position.y = -c[1];
  pointPin.position.z = size/2+0.1;
  this.threeObj = pointPin;
}
// 都道府県の色を決める関数
function color(){
  var meshColorArray = [0x98fb98,0x90ee90,0x32CD32,0x008800,0x009900,0x00aa00,
  0x00bb00,0x00cc00,0x00dd00,0x00ee00,0x00ff00];
  return meshColorArray[Math.round(Math.random()*10)];
}
// 降水量ごとの色分けを行う関数
function dropColor(size){
  if(size>80){
    return 0xb40068;
  }else if(size>50){
    return 0xff2800;
  }else if(size>30){
    return 0xff9900;
  }else if(size>20){
    return 0xfaf500;
  }else if(size>10){
    return 0x0041ff;
  }else if(size>5){
    return 0x218cff;
  }else if(size>1){
    return 0xa0d2ff;
  }else {
    return 0xf2f2ff;
  }
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}
function render(){
  renderer.render(scene, camera);
}


