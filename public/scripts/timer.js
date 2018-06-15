import*as data from"./data.js";import*as menu from"./menu.js";var x,y,scramble,start,end,element,currentime,chart,scrambleImage,cycle=0,penalty=0,menuOpened=!1,inputTime=!1,coloursOpened=!1;if(null===localStorage.getItem("options")){var options={general:{},stats:{decimalsDisplayed:2,AvgsUsed:["ao5","ao12","ao50","ao100","ao1000"],table:{TableAvgDisplay:"ao5",TableAvg1Display:"ao12"}},colours:{ScrambleHeader:new data.side,tableContainer:new data.side,timeContainer:new data.side,scrambleContainer:new data.side,graph:new data.side}};Object.keys(options.colours).forEach(e=>{options.colours[e].applyColours(e)})}else options=JSON.parse(localStorage.getItem("options")),Object.keys(options.colours).forEach(e=>{options.colours[e].applyColours(e)});var cubetype=localStorage.getItem("cubern")||"333",DataArr=JSON.parse(localStorage.getItem("solves"))||[],decimals=options.stats.decimalsDisplayed;if(0!=DataArr.length){tableprint(null,1,DataArr,decimals,cubetype,options);var id=DataArr[DataArr.length-1].position}else id=0;export function scramblegen(e,t,a){if(1!=t){r=(o=document.getElementById("scrambleContainer").getBoundingClientRect()).height/2,s=o.width/2;scramblers[e].initialize(),(l=document.getElementById("scrambleSVG")).innerHTML="";var n=scramblers[e].getRandomScramble();return document.getElementById("scramble").innerHTML=n.scramble_string,scramblers[e].drawScramble(l,n.state,s,r),[n.scramble_string,n.state]}var l;(l=document.getElementById("scrambleSVG")).innerHTML="";var o,r=(o=document.getElementById("scrambleContainer").getBoundingClientRect()).height/2,s=o.width/2;scramblers[e].drawScramble(l,a,s,r)};function hideElements(){document.getElementById("main").style.display="none",document.getElementById("ScrambleHeader").style.display="none",document.getElementById("runningtimeContainer").style.display="block",document.getElementById("runningtimeContainer").style.height="100%",document.getElementById("runningtimeContainer").style.width="100%"}function showElements(){document.getElementById("runningtimeContainer").style.display="none",document.getElementById("ScrambleHeader").style.display="block",document.getElementById("main").style.display="initial"}function typing(e){if(e%3==0||0==e)return 0==inputTime?(document.getElementById("VirtualPenalty").style.display="none",document.getElementById("InputTimes").style.display="initial",document.getElementById("time").style.display="none",document.getElementById("CubeUsed").style.display="none",Mousetrap.unbind("space"),InputHTML(DataArr),$("#cube").unbind("change"),$("#cubeTyping").on("change",function(){var e=$(this).val();if(e!=cubetype){id=0,cubetype=e,tableprint(null,1,DataArr,decimals,e,options);var t=scramblegen(e);switch(scramble=t[0],scrambleImage=t[1],DataArr.forEach(t=>{t.type==e&&t.position>id&&(id=t.position)}),e){case"444":case"555":case"666":case"777":document.getElementById("scramble").style.fontSize="2em";break;default:document.getElementById("scramble").style.fontSize="2.625rem"}$("#CubeUsed").val(e),localStorage.setItem("cubern",cubetype)}}),inputTime=!0):(document.getElementById("VirtualPenalty").style.display="initial",document.getElementById("InputTimes").style.display="none",document.getElementById("time").style.display="initial",document.getElementById("CubeUsed").style.display="initial",Mousetrap.bind("space",main),inputTime=!1),inputTime}function InputHTML(e){document.getElementById("InputTimes").addEventListener("submit",function(t){id++,t.preventDefault();var a=data.HHtoFloat(document.getElementById("TimeType").value);if(1!=isNaN(a)){document.getElementById("TimeType").value="";var n=parseInt(document.getElementById("SolveOption").value);if(2==n)e=DeleteSolvesIndex(e,cubetype);else var l=Result(e,n,a,!0,scramble,id);e.push(l),updateChart(!1,chart,l.result,l.ao12,e);var o=scramblegen(cubetype);scramble=o[0];o[1];localStorage.id=id+1,localStorage.setItem("solves",JSON.stringify(e))}else document.getElementById("TimeType").value="";localStorage.id=id+1,localStorage.setItem("solves",JSON.stringify(e))})}function DeleteSolvesIndex(e,t){for(var a=prompt("Input the ID of the solves separated by commas").split(","),n=0;n<e.length;n++){a[n]=parseInt(a[n]);for(var l=0;l<e.length;l++)if(e[l].position==a[n]&&e[l].type==t){e.splice(a[n]-1,1);for(var o=l;o<e.length;o++)e[o].position-=1}}return id=e[e.length-1].position+1||1,localStorage.id=id,localStorage.setItem("solves",JSON.stringify(e)),document.getElementById("time").innerHTML="00.00",e}function Result(e,t,a,n,l,o){switch(t){case 0:0==n&&(document.getElementById("time").innerHTML=a);var r=new data.Time(o,cubetype,a,l,t,decimals),s=new data.avg([],options.stats.AvgsUsed,!0);$.extend(r,s),e.push(r);var i=data.calc(e,cubetype,options);s=new data.avg(i,options.stats.AvgsUsed,!1);$.extend(r,s),tableprint(r,0,e,decimals,cubetype,options),e.pop();break;case 1:a+=2,0==n&&(document.getElementById("time").innerHTML=a);r=new data.Time(o,cubetype,a,l,t,decimals),s=new data.avg([],options.stats.AvgsUsed,!0);$.extend(r,s),e.push(r);i=data.calc(e,cubetype,options),s=new data.avg(i,options.stats.AvgsUsed,!1);$.extend(r,s),tableprint(r,0,e,decimals,cubetype,options),e.pop();break;case-1:0==n&&(document.getElementById("time").innerHTML=a);r=new data.Time(o,cubetype,a,l,t,decimals),s=new data.avg([],options.stats.AvgsUsed,!0);$.extend(r,s),e.push(r);i=data.calc(e,cubetype,options),s=new data.avg(i,options.stats.AvgsUsed,!1);$.extend(r,s),tableprint(r,0,e,decimals,cubetype,options),e.pop()}return r}function main(){switch(cycle%3){case 0:hideElements(),penalty=0;var e=15;x=setInterval(function(){document.getElementById("runningtime").innerHTML="<p>"+e+"</p>",e<=0&&e>=-2?(penalty=1,document.getElementById("runningtime").innerHTML="<p>+2</p>"):e<-2&&(document.getElementById("runningtime").innerHTML="<p>DNF</p>",penalty=-1),e--},1e3),cycle++;break;case 1:clearInterval(x),start=(new Date).getTime(),y=setInterval(function(){var e=new Date,t=new Date(e-start),a=Math.trunc(t.getUTCMilliseconds()/10,2),n=t.getUTCSeconds(),l=t.getUTCMinutes(),o=t.getUTCHours();document.getElementById("runningtime").innerHTML=(o?o>9?o:"0"+o+":":" ")+(l?l>9?l:"0"+l+":":" ")+(n>9?n:"0"+n)+"."+(a>9?a:"0"+a)},50),cycle++;break;case 2:cycle++,id++,end=(new Date).getTime(),currentime=math.round((end-start)/1e3,3),clearInterval(y);var t=Result(DataArr,penalty,currentime,!1,scramble,id);DataArr.push(t),updateChart(!1,chart,t.result,t.ao12),$("#VirtualOptions").unbind(),$("#VirtualOptions").on("change",function(){var e=parseInt($(this).val());2==e?tableprint(null,1,DataArr=DeleteSolvesIndex(DataArr,cubetype),decimals,cubetype,options):(e!=DataArr[DataArr.length-1].penalty&&(1==e?(DataArr[DataArr.length-1].result+=2,DataArr[DataArr.length-1].penalty=e):0==e&&1==DataArr[DataArr.length-1].penalty?(DataArr[DataArr.length-1].result-=2,DataArr[DataArr.length-1].penalty=e):DataArr[DataArr.length-1].penalty=e,tableprint(DataArr[DataArr.length-1],2,DataArr,decimals,cubetype,options)),updateChart(!0,chart,null,null,DataArr))}),showElements();var a=scramblegen(cubetype);scramble=a[0];a[1];localStorage.id=id+1,localStorage.setItem("solves",JSON.stringify(DataArr))}return!1}export function addTableData(e,t,a,n){var l=t.insertRow(-1);$(l).addClass("row1");var o=l.insertCell(0),r=l.insertCell(1);o.innerHTML=e.position,-1==e.penalty?r.innerHTML="DNF":1==e.penalty?r.innerHTML=e.formattedTime+"+":r.innerHTML=e.formattedTime;var s=l.insertCell(2);null==e[a]?s.innerHTML=" ":-1==e[a]?s.innerHTML="DNF":s.innerHTML=math.round(e[a],decimals);var i=l.insertCell(3);null==e[n]?i.innerHTML=" ":-1==e[n]?i.innerHTML="DNF":i.innerHTML=math.round(e[n],decimals)};export function tableprint(e,t,a,n,l,o){let r=o.stats.table.TableAvgDisplay,s=o.stats.table.TableAvg1Display;var i=document.getElementById("Timetable");switch(t){case 0:addTableData(e,i,r,s);break;case 1:for(var d=i.rows.length-1;d>0;d--)i.deleteRow(d);a.forEach(function(e){e.type==l&&addTableData(e,i,r,s)});break;case 2:i.deleteRow(-1),addTableData(e,i,r,s);break;case 3:for(d=i.rows.length-1;d>0;d--)i.deleteRow(d)}i.scrollTop=i.scrollHeight};function drawChart(){var e=document.getElementById("chart").getContext("2d"),t=new Chart(e,{type:"line",data:{labels:[],datasets:[{label:"Time",backgroundColor:"#F44336",borderColor:"#F44336",data:[],fill:!1,borderWidth:1.5,pointRadius:0,lineTension:!1},{label:"ao12",backgroundColor:"#000000",borderColor:"#000000",data:[],fill:!1,borderWidth:1.5,pointRadius:0}]},options:{responsive:!0,maintainAspectRatio:!1,legend:{labels:{fontColor:"#000000"}},scales:{xAxes:[{gridLines:{display:!1,color:"#000000"}}],yAxes:[{gridLines:{color:"#000000"},ticks:{beginAtZero:!0,fontColor:"#FFFFFF"}}]}}});return Chart.defaults.global.elements.point.backgroundColor="#616161",t}function updateChart(e,t,a,n,l){1==e?(t.data.datasets[0].data=[],t.data.datasets[1].data=[],l.forEach(e=>{t.data.datasets[0].data.push(l[0]),t.data.datasets[1].data.push(l[1])})):(-1==a&&(a=null),-1==n&&(n=null),t.data.labels.push(" "),t.data.datasets[0].data.push(a),t.data.datasets[1].data.push(n),t.update())}window.onload=function(){$("#cube").unbind("change"),$("#cube").on("change",function(){var e=$(this).val();if(e!=cubetype){id=0,cubetype=e,tableprint(null,1,DataArr,decimals,e,options);var t=scramblegen(e);switch(scramble=t[0],scrambleImage=t[1],DataArr.forEach(function(e){e.type==cubetype&&e.position>id&&(id=e.position)}),e){case"444":case"555":case"666":case"777":document.getElementById("scramble").style.fontSize="2em";break;default:document.getElementById("scramble").style.fontSize="2.625rem"}$("#CubeUsed").val(e),localStorage.setItem("cubern",cubetype)}}),document.getElementById("cube").value=cubetype,chart=drawChart();var e=scramblegen(cubetype,!1);scramble=e[0],scrambleImage=e[1],$(window).resize(function(){scramblegen(cubetype,!0,scrambleImage)}),Mousetrap.bind("space",function(){return main(),!1}),menu.Acess(menuOpened,options,coloursOpened),Mousetrap.bind("ctrl+enter",function(){return inputTime=typing(cycle),!1}),$(".row1").unbind(),$(".row1").click(function(e){alert("wtf"),document.getElementById("solveContent").innerHTML="";let t=e.target.parentNode.cells[0].innerHTML,a=DataArr.find(e=>e.position==t);Object.keys(a).forEach(e=>{if(1==e.startsWith("mo")||1==e.startsWith("ao")){var t=document.createElement("p"),n=document.createTextNode(`${e} : ${a[e]}`);t.appendChild(n),document.getElementById("solveContent").appendChild(t)}}),UIkit.modal(document.getElementById("solveModal")).show()}),Mousetrap.bind("d",function(){"yes"==prompt("Are you sure you want to delete everything? Type yes to confirm").toLowerCase()&&(localStorage.clear(),DataArr=[],options={general:{},stats:{decimalsDisplayed:2,AvgsUsed:["ao5","ao12","ao50","ao100","ao1000"],table:{TableAvgDisplay:"ao5",TableAvg1Display:"ao12"}},colours:{ScrambleHeader:new data.side,tableContainer:new data.side,timeContainer:new data.side,scrambleContainer:new data.side,graph:new data.side}},Object.keys(options.colours).forEach(e=>{options.colours[e].isBorder="on",options.colours[e].borderS="1px",options.colours[e].colour="#0D5C63",options.colours[e].fontC="#000000",options.colours[e].fontS="16px",options.colours[e].isGradient="false",options.colours[e].gradientD="",options.colours[e].gradientC1="",options.gradientC2="",options.colours[e].applyColours(e)}),id=0,cubetype="333",tableprint(null,3,null,null,null,options),alert("Cleared"))})};