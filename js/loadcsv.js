var pref =[];
function loadDataFile(fName){
  httpObj = createXMLHttpRequest(displayData);
  if(httpObj){
    httpObj.open("GET",fName,false); //chormeでは同期でないとエラーになる
    httpObj.send(null);
  }
}
function displayData(){
  if ((httpObj.readyState == 4) && (httpObj.status === 0)){
    pref  = csvtrans(httpObj.responseText);
  }
}
function createXMLHttpRequest(cbFunc){
  var XMLhttpObject = null;
  try{
    XMLhttpObject = new XMLHttpRequest();
  }catch(e){
    try{
      XMLhttpObject = new ActiveXObject("Msxml2.XMLHTTP");
    }catch(e){
      try{
        XMLhttpObject = new ActiveXObject("Microsoft.XMLHTTP");
      }catch(e){
        return null;
      }
    }
  }
  if (XMLhttpObject) XMLhttpObject.onreadystatechange = cbFunc;
    return XMLhttpObject;
}
function csvtrans(csvFile){
  var csvData = [];
  var CR = String.fromCharCode(13);
  lineData = csvFile.split(CR);
  for(var i=0;i<lineData.length;i++){
    strText = lineData[i].split(",");
    csvData[i] = strText;
   }
   return csvData;
}