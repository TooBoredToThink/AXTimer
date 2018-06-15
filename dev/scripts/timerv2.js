import * as data from "./data.js"
import * as menu from "./menu.js"


var DataArr = []; //array which stores all data
var cubetype=localStorage.getItem('cubern') || "333"; //the cube being used, stored when changing events or adding data
var cycle=0; //cycle which defines whether is at inspection, solving or finished solving
var id = localStorage.getItem('id') || 0; //id of the solve, based on the current cube
var penalty=0; //penalty, global var because can be affected by inspection
var x, y; // Intervals for inspection and solving respec.
var scramble ,start, end, element, currentime,chart; //scramble string
var decimals = 2; //how many decimals used when calculating avgs
var arr = [5,12,50,100,1000]; //array containing all the averages which will be calculated
var menuOpened=false;//boolean to check whether the general menu is opened or not
var inputTime=false;


function scramblegen(cubetype,w,h){
    scramblers[cubetype].initialize();
    document.getElementById("scrambleImage").innerHTML = "";
    var scram = scramblers[cubetype].getRandomScramble();
    document.getElementById("scramble").innerHTML = "<p>" + scram.scramble_string + "</p>";
    scramblers[cubetype].drawScramble(scrambleImage, scram.state, w, h);
    return scram.scramble_string;
};
/////TIMER FUNCS///////
function hideElements(){
    //hides left, right column and header, makes middle take all avalaible space
    document.getElementById('VirtualSolve').style.display = "none";
    document.getElementById("ScrambleHeader").style.display = "none";
    document.getElementById("column_left").style.display = "none";
    document.getElementById("column_right").style.display = "none";
    document.getElementById("column_middle").classList.remove('col-sm-6');
    document.getElementById("column_middle").classList.add('col-sm-12');
    document.getElementById("column_middle").style.height = "100vh";
    document.getElementById("column_middle").style.width = "100vh";
}

function showElements(){
    //restores initial settings
    document.getElementById('VirtualSolve').style.display = "initial";
    document.getElementById("column_middle").style.height = "90vh";
    document.getElementById("column_middle").style.width = "50vh";
    document.getElementById("ScrambleHeader").style.display = "block";
    document.getElementById("column_middle").classList.remove('col-sm-12');
    document.getElementById("column_middle").classList.add('col-sm-6');
    document.getElementById("column_left").style.display = "initial";
    document.getElementById("column_right").style.display = "initial";
}

function typing(cycle){
    if (cycle % 3 == 0 || cycle == 0){
        if (inputTime==false){
            document.getElementById("InputTimes").style.display = "initial";
            document.getElementById("time").style.display = "none";
            Mousetrap.unbind('space');
            InputHTML(DataArr);
            inputTime=true;

        } else {
            document.getElementById("InputTimes").style.display = "none";
            document.getElementById("time").style.display = "initial";
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
    document.getElementById("VirtualSolve").style.display = "none";
    document.getElementById("InputTimes").addEventListener('submit',function(e){
        e.preventDefault();
        var currentime = parseFloat(document.getElementById("TimeType").value);
        var penalty = parseInt(document.getElementById("SolveOption").value);
        console.log(penalty);
        var times = Result(penalty,currentime,true,scramble);
        DataArr.push(times);
        updateChart(chart,times.result,times.ao12,id);
        id++;
    });
};

function Result(DataArr,penalty,currentime,manualinput,scramble){
    switch (penalty){
        case 0:
            if (manualinput==false){
                document.getElementById("time").innerHTML = "<p>" + currentime + "</p>";
            };
            var time = new data.Time(id,cubetype,currentime,scramble,penalty);//creating a time object
            var avgs = new data.avg([null,null,null,null,null]);
            $.extend(time,avgs);
            DataArr.push(time)
            console.log(time);
            var avgarr = data.calc(DataArr,cubetype,arr,3);//caculating avgs
            var avgs = new data.avg(avgarr);//addding prev. calculated avgs inot obj
            $.extend(time,avgs);
            tableprint(time,id,false);
            DataArr.pop();
            break;
        case 1:
            currentime=currentime+2;
            if (manualinput==false){
                document.getElementById("time").innerHTML = "<p>" + currentime + "+" + "</p>";
            };
            var time = new data.Time(id,cubetype,currentime,scramble,1);//creating a time object
            var avgarr = data.calc(DataArr,cubetype,arr,3);//caculating avgs
            var avgs = new data.avg(avgarr);//addding prev. calculated avgs inot obj
            $.extend(time,avgs);
            tableprint(time,id,false);
            break;
        case -1:
            if (manualinput==false){
                document.getElementById("time").innerHTML = "<p>DNF</p>";
            };
            var time = new data.Time(id,cubetype,currentime,scramble,-1);//creating a time object
            var avgarr = data.calc(DataArr,cubetype,arr,3);//caculating avgs
            var avgs = new data.avg(avgarr);//addding prev. calccycle++;ulated avgs inot obj
            $.extend(time,avgs);
            tableprint(time,id,false);
            break;
    };
    return time

};

function main(h,w){
        console.log(cycle);//debug purposes
        switch (cycle % 3) {
            //using a switch instead of if..else as its more efficient and
            // its always the output of a certain condition
            case 0:
                hideElements();
                //shows a 15 second countdown, if the user takes 15-17 to inspect
                //if user takes 15-17, a 2 second penalty is added to the final time
                //if the user takes 17+ seconds then the solve is DNF (Did Not Finish)
                var inspectiontime = 15;
                x = setInterval(function(){
                    document.getElementById("time").innerHTML = "<p>" + inspectiontime + "</p>";
                    if (inspectiontime<=0 && inspectiontime>=-2){
                        console.log("EHEHEHHE");
                        //penalty=1;
                        document.getElementById("time").innerHTML = "<p>" + "+2" + "</p>";
                    } else if (inspectiontime<-2) {
                        document.getElementById("time").innerHTML = "<p>" + "DNF" + "</p>";
                        //penalty=-1;
                    }
                    inspectiontime--;
                },1000);//1000ms or every second
                cycle++;
                break;
            case 1:
                clearInterval(x);
                start = new Date();
                //shows the running timer, and displays minutes and hours as necessary
                y = setInterval(function(){
                    var current = new Date();
                    var timeGone = new Date(current - start);
                    var ms = timeGone.getUTCMilliseconds();
                    var s = timeGone.getUTCSeconds();
                    var m = timeGone.getUTCMinutes();
                    var h = timeGone.getUTCHours();
                    document.getElementById("time").innerHTML =
                    (h ? (h > 9 ? h : "0" + h + ":"):" ")
                    +
                    (m ? (m > 9 ? m : "0" + m + ":"):" ")
                    +
                    (s > 9 ? s : "0"+ s)
                    + ":" +
                    (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms)
                },5);
                cycle++;
                break;
        case 2:
            cycle++;
            end = new Date();
            currentime=math.round((((end - start)/1000)),3);
            clearInterval(y);
            //console.log("it gets here");
            /*document.getElementById("VirtualSolve").addEventListener('submit',function(e){
                e.preventDefault();
                console.log("hehe");
                penalty=parseInt(document.getElementById('VirtualOptions').value);
                var times = Result(DataArr,penalty,currentime,false,scramble);
                if (times===DataArr[cycle]){
                    DataArr.pop();
                    DataArr.push(times);
                } else{
                    DataArr.push(times);
                    updateChart(chart,times.result,times.ao12,id);
                };
            });*/
            var times = Result(DataArr,penalty,currentime,false,scramble);
            console.log("why",times.penalty);
            DataArr.push(times);
            updateChart(chart,times.result,times.ao12,id);
            scramble = scramblegen(cubetype,w,h);
            id++;
            showElements();
            break;
    }
    return false;
}
/////DISPLAYING  DATA//////
function tableprint(time,id,deleteRow){
    var table = document.getElementById("Timetable");
    if (deleteRow==true){
        for(var i = table.rows.length - 1; i > 0; i--){
            table.deleteRow(i);
        };
    } else {
        var times_row = table.insertRow(-1);
        var id1 = times_row.insertCell(0);
        var result = times_row.insertCell(1);
        var avg5 = times_row.insertCell(2);
        id1.innerHTML = id+1;
        if (time.penalty==-1){
            result.innerHTML = "DNF";
        } else if (time.penalty==1){
            result.innerHTML = time.result+"+";
        } else {
            result.innerHTML =time.result;
        }
        if (time.ao5==null){
            avg5.innerHTML = " ";
        } else if (time.ao5==-1){
            avg5.innerHTML = "DNF";
        } else {
            avg5.innerHTML = time.ao5;
        };
        var avg12 = times_row.insertCell(3);
        if (time.ao12==null){
            avg12.innerHTML = " ";
        } else if (time.ao12==-1){
            avg12.innerHTML = "DNF";
        } else {
            avg12.innerHTML = time.ao12;
        };
    }
};

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
function updateChart(chart,stuff,morestuff,id) {
    if(stuff==-1){stuf=null};
    if(morestuff==-1){stuf=null};
    chart.data.labels.push(' ');
    chart.data.datasets[0].data.push(stuff);
    chart.data.datasets[1].data.push(morestuff);
    chart.update();
}
////MAIN STUFF//////
window.onload= function(){ //launching everythng after page is loaded
    var elem = document.querySelector('.modal');
    var instance = M.Modal.init(elem);
    console.log(elem);
    chart=drawChart();
    var element = document.getElementById('column_right');
    var positionInfo = element.getBoundingClientRect();
    var h = (positionInfo.height)/2;
    var w = (positionInfo.width)/2;
    scramble=scramblegen(cubetype,w,h);
    Mousetrap.bind('space',function(){
        main(h,w);
        return false;
    });//using bind rather addEventListener
    menu.Acess(menuOpened);
    Mousetrap.bind('ctrl+enter',function(){
        inputTime=typing(cycle);
        return false;
    });
}
