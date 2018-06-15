import * as data from "./data.js"
import * as menu from "./menu.js"

var cubetype=localStorage.getItem('cubern') || "333";
var cycle=0;
var id = localStorage.getItem('id') || 0;
//var remoteData = new PouchDB('http://localhost:5984/mydb');
var localData = new PouchDB('localData');
/*localData.sync(remoteData,{
  live: true,
  retry: true
}).on('change',function(change){
  console.log("Change in mydb")
}).on('complete', function(){
  console.log("Done and dusted boi")});*/
var objdata=[];
var decimals=2;
var start, end, x,y, scram, time;
var smallestValue, biggestValue, currentavg, tempavg, scramble;
var inputTime=false;
var penalty=0;
var menuOpened=false;

function scramblegen(cubetype){
  scramblers[cubetype].initialize();
  document.getElementById("scrambleImage").innerHTML = "";
  var scram = scramblers[cubetype].getRandomScramble();
  document.getElementById("scramble").innerHTML = "<p>" + scram.scramble_string + "</p>";
  scramblers[cubetype].drawScramble(scrambleImage, scram.state, 100, 80);
  return scram.scramble_string;
};




function typing(){
  if (inputTime==false){
    document.getElementById("TimeInput").style.display = "initial";
  inputTime=true;
  } else {
    document.getElementById("TimeInput").style.display = "none";
  inputTime=false;
  }
};


function hideElements(){
  document.getElementById("ScrambleHeader").style.display = "none";
  document.getElementById("column_left").style.display = "none";
  document.getElementById("column_right").style.display = "none";
  document.getElementById("column_middle").classList.remove('col-sm-6');
  document.getElementById("column_middle").classList.add('col-sm-12');
  document.getElementById("column_middle").style.height = "100vh";
  document.getElementById("column_middle").style.width = "100vh";
}

function showElements(){
  document.getElementById("column_middle").style.height = "90vh";
  document.getElementById("column_middle").style.width = "50vh";
  document.getElementById("ScrambleHeader").style.display = "block";
  document.getElementById("column_middle").classList.remove('col-sm-12');
  document.getElementById("column_middle").classList.add('col-sm-6');
  document.getElementById("column_left").style.display = "initial";
  document.getElementById("column_right").style.display = "initial";
}

function InputHTML(data,i){
  alert("hehehe");
  var penalty=document.getElementById("SolveOption").value;
  switch (penalty) {
    case 0:
      addData(localData,i,document.getElementById("TimeType").value,0);
      break;
    case 1:
      addData(localData,i,document.getElementById("TimeType").value,1);
      break;
    case 2:
      addData(localData,i,document.getElementById("TimeType").value,-1);
  };
  calc(data);
  scramblegen(data,id);
  id++;
}

function main(event,scramble){
  if (math.isInteger(parseInt(event.key))==true && parseInt(event.key)>1 && parseInt(event.key)<4){
    switch (parseInt(event.key)) {
      case 2:
        cubetype="222";
        break;
      case 3:
        cubetype="333";
      case 4:
        cubetype="444";
      case 5:
        cubetype="555";
      case 6:
        cubetype="666";
      case 7:
        cubetype="777";
  }} else if (inputTime==false){
    if (cycle % 3== 0 && event.key==" "){
      hideElements();
      cycle++;
      var inspectiontime = 15;
      x = setInterval(function(){
      document.getElementById("time").innerHTML = "<p>" + inspectiontime + "</p>";
      inspectiontime--;
      if (inspectiontime<=0 && inspectiontime>=-2){
        penalty=1;
        document.getElementById("time").innerHTML = "<p>" + "+2" + "</p>";
      } else if (inspectiontime<-2) {
        document.getElementById("time").innerHTML = "<p>" + "DNF" + "</p>";
        penalty=2;
      }},1000);
    } else if (cycle % 3 == 1 && event.key==" ") {
      clearInterval(x);
      start = new Date();
      cycle++;
      y = setInterval(function(){
      var current = new Date();
      var timeGone = new Date(current - start);
      var ms = timeGone.getUTCMilliseconds();
      var s = timeGone.getUTCSeconds();
      var m = timeGone.getUTCMinutes();
      var h = timeGone.getUTCHours();
      document.getElementById("time").innerHTML = (h ? (h > 9 ? h : "0" + h) : "00")
      + ":" + (m ? (m > 9 ? m : "0" + m) : "00") + ":" + (s > 9 ? s : "0"+ s) + ":" + (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);;
    },5);
    } else if (cycle % 3 == 2){
      showElements();
      clearInterval(y);
      end = new Date();
      switch (penalty) {
        case 0:
          time=math.round((((end - start)/1000)),3);
          //console.log(localData.info());
          var avgarr = data.calc()
          var currentime = data.AddObj(id,cubetype,time,0,avgarr)
          ObjData.push(currentime);
          document.getElementById("time").innerHTML = "<p>" + time + "</p>";
          break;
        case 1:
          time=(math.round((((end - start)/1000)),3))+2;
          var added = data.addData(localData,id,time,1,scramble,cubetype);
          localData = added[0];
          var currentime = added[1];
          document.getElementById("time").innerHTML = "<p>" + time +"+" + "</p>";
          break;
        case 2:
          var added = data.addData(localData,id,time,-1,scramble,cubetype);
          localData = added[0];
          var currentime = added[1];
          document.getElementById("time").innerHTML = "<p>DNF</p>";
      }
      if (id==0){
          data.createIndexDB(localData);
      };
      console.log("cube",cubetype);
      var lel=(data.printData(localData,cubetype));
      scramble=scramblegen(cubetype);
      cycle++;
      id++;
    };
  };
};
scramble=scramblegen(cubetype);
document.addEventListener('keydown', function(){
    main(event,scramble)
});
Mousetrap.bind('ctrl+enter',typing);
menu.Acess(menuOpened);
Mousetrap.bind('ctrl+i', function(){
    localData.destroy();
    return false;
})
