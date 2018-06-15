import * as data from './data.js';
import * as menu from './menu.js';

var cycle=0; //cycle which defines whether is at inspection, solving or finished solving
var penalty=0; //penalty, global var because can be affected by inspection
var x, y; // Intervals for inspection and solving respec.
var scramble ,start, end, element, currentime,chart, scrambleImage; //scramble string
var menuOpened=false;//boolean to check whether the general menu is opened or not
var inputTime=false;
var coloursOpened=false;	
var resizeScramble=true;
if (localStorage.getItem("options") === null){
    var options={
        general:{},
        stats:{
            decimalsDisplayed:2,
            AvgsUsed:['ao5','ao12','ao50','ao100','ao1000'],
            table:{
                TableAvgDisplay:'ao5',
                TableAvg1Display:'ao12',
            }

        },
        colours:{
            ScrambleHeader: new data.side(),
            tableContainer: new data.side(),
            timeContainer: new data.side(),
            scrambleContainer: new data.side(),
            graph: new data.side(),
        }
    };
    Object.keys(options.colours).forEach(key => {
        data.applyColours(key,options.colours[key]);
    });    
    console.log(options);
}else{    
	options=JSON.parse(localStorage.getItem('options'));  	
	Object.keys(options.colours).forEach(key => {
        data.applyColours(key,options.colours[key]);
    });

}

/*var db = new PouchDB('stuff');
var remoteDB = new PouchDB('http://localhost:5984/stuffremote');
remoteDB.info().then(result=>{
    console.log(result);
});
var sync = PouchDB.sync('remoteDB', 'stuff', {
  live: true,
  retry: true
}).on('change', function (info) {
  console.log(`there's a change ${info}`);
}).on('paused', function (err) {
    console.log(`shit got paused ${err}`);
}).on('active', function () {
    console.log(`shit is back up`);
}).on('denied', function (err) {
    console.log(`cucked xd ${err}`);
}).on('complete', function (info) {
    console.log(`done`);
}).on('error', function (err) {
    console.log(`ffs ${err}`);
});*/
var cubetype=localStorage.getItem('cubern') || '333';
var DataArr = JSON.parse(localStorage.getItem('solves')) || [];
export{DataArr as arr, cubetype as cubetype};
var decimals = options.stats.decimalsDisplayed; //how many decimals used when calculating avgs
console.log(DataArr);
if (DataArr.length!=0){
    tableprint(null,1,DataArr,cubetype,options);
    var id = DataArr[DataArr.length-1].position;
} else{
    var id=0;
};


export function scramblegen(cubetype,resize,image){
    if (resize==true){
        //if the size of the window changes this will
        //redraw the scramble so its always the same proportions
        //compared to the container
        var scramble1 = document.getElementById("scrambleSVG");
        scramble1.innerHTML = "";//clear previous images
        var element = document.getElementById('scrambleContainer');
        var positionInfo = element.getBoundingClientRect();
        var h = (positionInfo.height)/2;
        var w = (positionInfo.width)/2;

        scramblers[cubetype].drawScramble(scramble1,image, w, h);
    } else{
        var element = document.getElementById('scrambleContainer');
        var positionInfo = element.getBoundingClientRect();
        var h = (positionInfo.height)/2;
        var w = (positionInfo.width)/2;
        scramblers[cubetype].initialize();
        var scramble1 = document.getElementById("scrambleSVG");
        scramble1.innerHTML = "";//clear previous images
        var scram = scramblers[cubetype].getRandomScramble();
        document.getElementById("scramble").innerHTML = scram.scramble_string;
        scramblers[cubetype].drawScramble(scramble1, scram.state, w, h);
        return [scram.scramble_string,scram.state]
    }
};


//SHOWING/HIDING ELEMENTS
function hideElements(){
    document.getElementById("main").style.display = "none";
    document.getElementById("ScrambleHeader").style.display = "none";
    document.getElementById("runningtimeContainer").style.display = "block";
    document.getElementById("runningtimeContainer").style.height = "100%";
    document.getElementById("runningtimeContainer").style.width = "100%";
};
function showElements(){
    document.getElementById("runningtimeContainer").style.display = "none";
    document.getElementById("ScrambleHeader").style.display = "block";
    document.getElementById("main").style.display = "initial";
}

///////INPUTTING TIMES MANUALLY///////
function typing(cycle){
    if (cycle % 3 == 0 || cycle == 0){
        if (inputTime==false){
            document.getElementById("VirtualPenalty").style.display = "none";
            document.getElementById("InputTimes").style.display = "initial";
            document.getElementById("time").style.display = "none";
            document.getElementById("CubeUsed").style.display = "none";
            Mousetrap.unbind('space');
            InputHTML(DataArr);
            $('#cube').unbind('change');
            $('#cubeTyping').on('change',function(){
				var changed=$(this).val();
				console.log(changed);
				if (changed =='mbld'){
					menu.mbld();
				}else if (changed!=cubetype){
					
                    id=0;
                    cubetype=changed;
                    tableprint(null,1,DataArr,changed,options);
                    var scramarr=scramblegen(changed);
                    scramble=scramarr[0];
                    scrambleImage=scramarr[1];
                    DataArr.forEach(el=>{
                        if (el.type==changed && el.position>id){
                            id=el.position;
                        };
                    });
                    switch (changed){
                        case '444':
                        case '555':
                        case '666':
                        case '777':
                        document.getElementById('scramble').style.fontSize = "2em";
						break;						
                        default:
                        document.getElementById('scramble').style.fontSize = "2.625rem";
                    };
                    $("#CubeUsed").val(changed);
                    localStorage.setItem('cubern',cubetype);
                };
            });
            inputTime=true;

        } else {
            document.getElementById("VirtualPenalty").style.display = "initial";
            document.getElementById("InputTimes").style.display = "none";
            document.getElementById("time").style.display = "initial";
            document.getElementById("CubeUsed").style.display = "initial";
            Mousetrap.bind('space',main);
            inputTime=false;
        }
        return inputTime;
    }
};

function InputHTML(DataArr){
    console.log("listening for input..");
//this function will detect whhen a time has been inputed, as it uses a form
//to do so. Then it will add the times and avgs.
    document.getElementById("InputTimes").addEventListener('submit',function(e){
        id++;
        e.preventDefault();
        var currentime = data.HHtoFloat(document.getElementById("TimeType").value);
        console.log(currentime);
        if (isNaN(currentime)!=true){
            document.getElementById("TimeType").value = "";
            var penalty = parseInt(document.getElementById("SolveOption").value);
            if (penalty==2){
                DataArr=DeleteSolvesIndex(DataArr,cubetype);

            } else{

                var times = Result(DataArr,penalty,currentime,true,scramble,id);
            }            
            DataArr.push(times);
            updateChart(false,chart,times.result,times.ao12,DataArr);
            var changed=cubetype;
            var scramarr=scramblegen(changed);
            scramble=scramarr[0];
            var scrambleImage=scramarr[1];
            localStorage.id=id+1;
            localStorage.setItem("solves", JSON.stringify(DataArr));
            console.log(DataArr);
        } else{
            document.getElementById("TimeType").value = "";
        }
        localStorage.id=id+1;
        localStorage.setItem("solves", JSON.stringify(DataArr));
    });
};

///////TIMER STUFF///////
function DeleteSolvesIndex(arr,cube){
    var temp = prompt("Input the ID of the solves separated by commas");
    var indexel = temp.split(',');
    for(var i=0;i<arr.length;i++){//goes through all the ids that have to be deleted
        indexel[i]=parseInt(indexel[i])
        for(var j=0;j<arr.length;j++){//for the individual id, goes through all the solves
            if(arr[j].position==indexel[i] && arr[j].type==cube){//if the id matches the id correspondent to the solve
                arr.splice((indexel[i]-1),1);//deletes solve, using splice so no null items
                for(var k=j;k<arr.length;k++){
                    //goes through the item, as list gets shifted, k takes the value of
                    //j as j points to the item that was after the item deleted
                    arr[k].position-=1;//changes the position(id) to be 1 less
                }
            };
        };
	};  	
    id=arr[arr.length-1].position + 1 || 1;
    localStorage.id=id;
    localStorage.setItem("solves", JSON.stringify(arr));
    document.getElementById('time').innerHTML="00.00";
    return arr;
}
function Result(DataArr,penalty,currentime,manualinput,scramble,id){
    switch (penalty){
        case 0:
            if (manualinput==false){
                document.getElementById("time").innerHTML = currentime;
            };
            var time = new data.Time(id,cubetype,currentime,scramble,penalty,decimals);//creating a time object
            var avgs = new data.avg([],options.stats.AvgsUsed,true);
            $.extend(time,avgs);
            DataArr.push(time);
            var avgarr = data.calc(DataArr,cubetype,options);//caculating avgs
            var avgs = new data.avg(avgarr,options.stats.AvgsUsed,false);//addding prev. calculated avgs inot obj
            $.extend(time,avgs);
            tableprint(time,0,DataArr,cubetype,options);
            DataArr.pop();
            break;
        case 1:
            currentime=currentime+2;
            if (manualinput==false){
                document.getElementById("time").innerHTML = currentime;
            };
            var time = new data.Time(id,cubetype,currentime,scramble,penalty,decimals);//creating a time object
            var avgs = new data.avg([],options.stats.AvgsUsed,true);
            $.extend(time,avgs);
            DataArr.push(time);
            var avgarr = data.calc(DataArr,cubetype,options);//caculating avgs
            var avgs = new data.avg(avgarr,options.stats.AvgsUsed,false);//addding prev. calculated avgs inot obj
            $.extend(time,avgs);
            tableprint(time,0,DataArr,cubetype,options);
            DataArr.pop();
            break;
        case -1:
            if (manualinput==false){
                document.getElementById("time").innerHTML = currentime;
            };
            var time = new data.Time(id,cubetype,currentime,scramble,penalty,decimals);//creating a time object
            var avgs = new data.avg([],options.stats.AvgsUsed,true);
            $.extend(time,avgs);
            DataArr.push(time);
            var avgarr = data.calc(DataArr,cubetype,options);//caculating avgs
            var avgs = new data.avg(avgarr,options.stats.AvgsUsed,false);//addding prev. calculated avgs inot obj
            $.extend(time,avgs);
            tableprint(time,0,DataArr,cubetype,options);
            DataArr.pop();
            break;
    };
    return time

};
function main(){
        console.log(cycle);//debug purposes
        switch (cycle % 3) {
            //using a switch instead of if..else as its more efficient and
            // its always the output of a certain condition
            case 0:
                hideElements();
                //shows a 15 second countdown, if the user takes 15-17 to inspect
                //if user takes 15-17, a 2 second penalty is added to the final time
                //if the user takes 17+ seconds then the solve is DNF (Did Not Finish)
                penalty=0;
                var inspectiontime = 15;
                x = setInterval(function(){
                    document.getElementById("runningtime").innerHTML = "<p>" + inspectiontime + "</p>";
                    if (inspectiontime<=0 && inspectiontime>=-2){
                        console.log("EHEHEHHE");
                        penalty=1;
                        document.getElementById("runningtime").innerHTML = "<p>" + "+2" + "</p>";
                    } else if (inspectiontime<-2) {
                        document.getElementById("runningtime").innerHTML = "<p>" + "DNF" + "</p>";
                        penalty=-1;
                    }
                    inspectiontime--;
                },1000);//1000ms or every second
                cycle++;
                break;
            case 1:
                clearInterval(x);
                start = new Date().getTime();
                //shows the running timer, and displays minutes and hours as necessary
                y = setInterval(function(){
                    var current = new Date();
                    var timeGone = new Date(current - start);
                    var ms = Math.trunc(((timeGone.getUTCMilliseconds())/10),2);
                    var s = timeGone.getUTCSeconds();
                    var m = timeGone.getUTCMinutes();
                    var h = timeGone.getUTCHours();
                    document.getElementById("runningtime").innerHTML =
                    (h ? (h > 9 ? h : "0" + h + ":"):" ")
                    +
                    (m ? (m > 9 ? m : "0" + m + ":"):" ")
                    +
                    (s > 9 ? s : "0"+ s)
                    + "." +
                    (ms > 9 ? ms : "0"+ ms)
                },50);
                cycle++;
                break;
        case 2:
            cycle++;
            id++;
            end = new Date().getTime();
            currentime=math.round((end - start)/1000,4);
            clearInterval(y);
            var times = Result(DataArr,penalty,currentime,false,scramble,id);
            DataArr.push(times);
            updateChart(false,chart,times.result,times.ao12);
            $('#VirtualOptions').unbind();
            $('#VirtualOptions').on('change', function() {
                var changed=parseInt($(this).val());
                if (changed==2){
                    DataArr=DeleteSolvesIndex(DataArr,cubetype);                 
                    tableprint(null,1,DataArr,cubetype,options);
                } else{
                    if (changed!=DataArr[DataArr.length-1].penalty){
                        if (changed==1){
                            DataArr[DataArr.length-1].result+=2;
                            DataArr[DataArr.length-1].penalty=changed;
                        } else if (changed==0 && DataArr[DataArr.length-1].penalty==1){
                            DataArr[DataArr.length-1].result-=2;
                            DataArr[DataArr.length-1].penalty=changed;
                        } else{
                            DataArr[DataArr.length-1].penalty=changed;
                        }

                        tableprint(DataArr[DataArr.length-1],2,DataArr,cubetype,options);
					};
					updateChart(true,chart,null,null,DataArr);                 
                };
                
            });
            showElements();
            var changed=cubetype;
            var scramarr=scramblegen(changed);
            scramble=scramarr[0];
            var scrambleImage=scramarr[1];
            localStorage.id=id+1;
            localStorage.setItem("solves", JSON.stringify(DataArr));           
            break;
    }
    return false;
}
function mbldRequest(){
	Mousetrap.unbind('space');
	$.ajax({
		url:'relay.html',		
		success: function(html){			
			document.getElementById('main').innerHTML=html;
			$("<link/>", {
				rel: "stylesheet",
				type: "text/css",
				href: "/style/relay.css"
			 }).appendTo("head");
			 resizeScramble=false;
		},
		complete: function(){
			$('input[name="type"]').on('click', function(e) {
				if(document.querySelector('input[name=type]:checked').value=='nnn'){
					document.getElementById('bldform').style.display="none";
					document.getElementById('relayCubes').style.display="block";
				} else{
					document.getElementById('relayCubes').style.display="none";
					document.getElementById('bldform').style.display="block";
				}
			});		
			$('#createSolve').on('submit',e=>{
				e.preventDefault();					
				var type=document.querySelector('input[name=type]:checked').value;
				if (type=='mbld'){
					var cubeNum=$('#bldcubes').val();
					if (cubeNum<0){
						document.getElementById('createSolve').reset();
						alert('Not valid');
					} else{
						document.getElementById("createSolve").reset();	
						var table=document.getElementById('scrambleTable');
						$("#scrambleTable > tbody").html("");						
						for (var i=0;i<cubeNum;i++){						
							var row=table.insertRow(-1);
							row.style.color='black';
							var id=row.insertCell(0);
							var scrambleImage=row.insertCell(1);
							var scrambleText=row.insertCell(2);
							var scram = scramblers['333bf'].getRandomScramble();					
							scramblers['333bf'].drawScramble(scrambleImage, scram.state, 150, 150);
							scrambleText.innerHTML = `<h3>${scram.scramble_string}</h3>`;
							id.innerHTML=`<h3>${i+1}</h3>`;
						}
					}					
				} else{
					var first=$('#firstCube').val();
					var last=$('#lastCube').val();
					if (first>last){
						document.getElementById('createSolve').reset();
						alert('Not valid');
					} else{
						document.getElementById("createSolve").reset();	
					var table=document.getElementById('scrambleTable');
					$("#scrambleTable > tbody").html("");	
					for (var i=first;i<last;i++){
						var cube=`${i}${i}${i}`;						
						var table=document.getElementById('scrambleTable');
						var row=table.insertRow(-1);
						row.style.color='black';
						var id=row.insertCell(0);
						var scrambleImage=row.insertCell(1);
						var scrambleText=row.insertCell(2);
						var scram = scramblers[cube].getRandomScramble();					
						scramblers[cube].drawScramble(scrambleImage, scram.state, 150, 150);
						scrambleText.innerHTML = `<h3>${scram.scramble_string}</h3>`;
						id.innerHTML=`<h3>${i}x${i}</h3>`;	
					}
					}
					
				}
					
			})
				
		},
	});
		
	  	
}
///////TABLE///////
export function addTableData(time,table,avgpos,avgpos1,decimals){
    var times_row = table.insertRow(-1);
    $(times_row).addClass('row1');
    var id1 = times_row.insertCell(0);
    var result = times_row.insertCell(1);
    id1.innerHTML = time.position;
    if (time.penalty==-1){
        result.innerHTML = "DNF";
    } else if (time.penalty==1){
        result.innerHTML = data.dateFormatter(time.result,decimals);
    } else {
        result.innerHTML =data.dateFormatter(time.result,decimals);
    };
    var avg1 = times_row.insertCell(2);
    if (time[avgpos]==null){
        avg1.innerHTML = " ";
    } else if (time[avgpos]==-1){
        avg1.innerHTML = "DNF";
    } else {		
        avg1.innerHTML = data.dateFormatter(time[avgpos],decimals);
    };
    var avg2 = times_row.insertCell(3);
    if (time[avgpos1]==null){
        avg2.innerHTML = " ";
    } else if (time[avgpos1]==-1){
        avg2.innerHTML = "DNF";
    } else {
        avg2.innerHTML = data.dateFormatter(time[avgpos1],decimals);
	};	
    
}
export function tableprint(time,EditTable,array,cube,options){
    var avg=options.stats.table.TableAvgDisplay;
	var avg1=options.stats.table.TableAvg1Display;
	var decimals=options.stats.decimalsDisplayed;
    var table = document.getElementById("Timetable");
    switch (EditTable){
        case 0:
            addTableData(time,table,avg,avg1,decimals);
            break;
        case 1:
            for(var i = table.rows.length - 1; i > 0; i--){
                table.deleteRow(i);
            };
            array.forEach(function(el){
                if (el.type==cube){
                    var time=el;
                    addTableData(time,table,avg,avg1,decimals);
                }
            });
            break;
        case 2:
            table.deleteRow(-1);
            addTableData(time,table,avg,avg1,decimals);
            break;
        case 3:
            for(var i = table.rows.length - 1; i > 0; i--){
                table.deleteRow(i);
            };
            break;
    };
    table.scrollTop = table.scrollHeight;

};

///////CHART STUFF///////

function drawChart(){
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Time",
                backgroundColor: '#F44336',
                borderColor: '#F44336',
                data: [],
                fill:false,
                borderWidth:1.5,
                pointRadius:0,
                lineTension:false,

            }, {
                label: "ao12",
                backgroundColor: '#000000',
                borderColor: '#000000',
                data: [],
                fill:false,
                borderWidth:1.5,
                pointRadius:0,
            }]

        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            legend:{
                labels:{
                    fontColor:'#000000',
                },
            },
            scales:{
                xAxes:[{
                    gridLines:{
                        display:false,
                        color:'#000000'
                    },

                }],
                yAxes:[{
                    gridLines:{
                        color:'#000000'
                    },
                    ticks:{
                        beginAtZero:true,
                        fontColor:'#FFFFFF'
                    }
                }],
            }
        }
    });
    Chart.defaults.global.elements.point.backgroundColor = '#616161';
    return chart;
}
function updateChart(delet,chart,stuff,morestuff,arr) {
    if (delet==true){        
        chart.data.datasets[0].data=[];
        chart.data.datasets[1].data=[];        
        arr.forEach(item => {
            chart.data.datasets[0].data.push(arr[0]);
            chart.data.datasets[1].data.push(arr[1]);
        });
    } else{
        if(stuff==-1){stuff=null};
        if(morestuff==-1){morestuff=null};
        chart.data.labels.push(' ');
        chart.data.datasets[0].data.push(stuff);
        chart.data.datasets[1].data.push(morestuff);
        chart.update();
    }
   
};


/////// MAIN PROGRAM///////
window.onload = function(){			
    $("#Timetable").on("click", "tr",e=>{
		//e.target just gives td the user has clicked, parentNode gives the whole row
		//and cells[0] gives the id to be used to select the right object in the array
		//for the modal
		var temp=e.target.parentNode.cells[0].innerHTML;	
		var solve=DataArr.find(x => x.position == temp);	        
		var table=document.getElementById('statTable');	
		document.getElementById('solveTitle').innerHTML = `Solve Info: ${solve.result}`;	
		for(var i = table.rows.length - 1; i > 0; i--){
			table.deleteRow(i);
		};			
		Object.keys(solve).forEach(key => {
			if(key.startsWith('mo')==true || key.startsWith('ao')==true ){
				var row = table.insertRow(-1);
				var statN = row.insertCell(0);
				var currentStat = row.insertCell(1);
				var bestStat = row.insertCell(2);
				var worstStat = row.insertCell(3);					
				statN.innerHTML = key;				
				switch (solve[key]){
					case -1:
						currentStat.innerHTML="DNF";
						break;
					case null:
						currentStat.innerHTML="";
						break;
					default:
						currentStat.innerHTML=solve[key];
						break;
				}
			};
					
		});	
		$('#commentBTN').click(()=>{
			var index=DataArr.findIndex(x => x.position == temp);			
			DataArr[index].comment=encodeURIComponent($('#commentInput').val());
			localStorage.setItem("solves", JSON.stringify(DataArr));  
		})			
		UIkit.modal(document.getElementById('solveModal')).show();
	});
    document.getElementById('cube').value = cubetype;
    chart=drawChart();
    var scramarr=scramblegen(cubetype, false);
    scramble=scramarr[0];
    scrambleImage=scramarr[1];
    $(window).resize(function(){
		if (resizeScramble==true){
			scramblegen(cubetype,true,scrambleImage);
		}
       
    });
    Mousetrap.bind('space',function(){
        main();
        return false;
	});//using bind rather addEventListener
	$('#cube').unbind('change');	
    $('#cube').on('change',function(){
		alert('xddd');
        var changed=$(this).val();       
		if (changed =='mbld'){			
			mbldRequest();
		}else if (changed!=cubetype){
            id=0;
			cubetype=changed;			
			tableprint(null,1,DataArr,changed,options);		
            var scramarr=scramblegen(changed);
            scramble=scramarr[0];
            scrambleImage=scramarr[1];
            DataArr.forEach(function(el){
                if (el.type==cubetype && el.position>id){
                    id=el.position;
                };
            });
            switch (changed){
                case '444':
                case '555':
                case '666':
                case '777':
                document.getElementById('scramble').style.fontSize = "2.625em";
                break;
                default:
                document.getElementById('scramble').style.fontSize = "3rem";
            };
            $("#CubeUsed").val(changed);
            localStorage.setItem('cubern',cubetype);
        };
	});
    menu.Acess(menuOpened,options,coloursOpened);
    Mousetrap.bind('ctrl+enter',function(){
        inputTime=typing(cycle);
        return false;
    });   
    Mousetrap.bind('d',function(){
        var userConf=prompt('Are you sure you want to delete everything? Type yes to confirm').toLowerCase();
        if (userConf=='yes'){
            localStorage.clear();
            DataArr=[];
            options={
                general:{},
                stats:{
                    decimalsDisplayed:2,
                    AvgsUsed:['ao5','ao12','ao50','ao100','ao1000'],
                    table:{
                        TableAvgDisplay:'ao5',
                        TableAvg1Display:'ao12',
                    }

                },
                colours:{
                    ScrambleHeader: new data.side(),
                    tableContainer: new data.side(),
                    timeContainer: new data.side(),
                    scrambleContainer: new data.side(),
                    graph: new data.side(),
                },

			};
			Object.keys(options.colours).forEach(key => {
                options.colours[key].isBorder='on',
                options.colours[key].borderS='1px',
                options.colours[key].colour='#0D5C63',
                options.colours[key].fontC='#000000';
                options.colours[key].fontS='16px';
                options.colours[key].isGradient='false';
                options.colours[key].gradientD=''; 
                options.colours[key].gradientC1='';
                options.gradientC2='';
			    data.applyColours(key,options.colours[key]);
			});	
            id=0;
            cubetype='333';
            tableprint(null,3,null,null,options)
            alert('Cleared');           
        };
    });
    Mousetrap.bind('k',()=>{
        data.dataBackup(db,options,DataArr);
    })

}

