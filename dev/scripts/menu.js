import * as timer from './timerv3.js';
export function Acess(menuOpened,options,coloursOpened){
    $(document).ready(function(){
        $( document ).on( 'focus', ':input', function(){
            $( this ).attr( 'autocomplete', 'off' );
            });
    });
    function generalMenu(menuOpened){
        if (menuOpened==false){
            menuOpened=true;
            var menuElement = document.getElementById('generalModal');
            UIkit.modal(menuElement).show();
            document.getElementById('statsForm').style.display='none';
            document.getElementById('shortcutsTable').style.display='none';
            document.getElementById('a1').addEventListener('click',function(){
                document.getElementById('generalForm').style.display='block';
                document.getElementById('statsForm').style.display='none';
                document.getElementById('shortcutsTable').style.display='none';
                //options=GeneralOptions(options);
            });
            document.getElementById('a2').addEventListener('click',function(){
                document.getElementById('generalForm').style.display='none';
                document.getElementById('statsForm').style.display='block';
                document.getElementById('shortcutsTable').style.display='none';
                options=statsOptions(options);
            });
            document.getElementById('a3').addEventListener('click',function(){
                document.getElementById('generalForm').style.display='none';
                document.getElementById('statsForm').style.display='none';
                document.getElementById('shortcutsTable').style.display='table';
            });
        } else{
            //document.getElementById("menu").style.width = "0";
            //document.getElementById("main").style.marginLeft = "0";
            menuOpened=false;
        }
        return menuOpened;
    };
    function statsOptions(options){
        var datalength = document.getElementById("tableList").options.length;
        if (datalength==0){
            var avglist = options.stats.AvgsUsed;
            const list = document.getElementById('tableList');
            const list1 = document.getElementById('tableList1');
            avglist.forEach(el => {
                var option = document.createElement('option');
                option.value = el;
                list.appendChild(option);
                list1.appendChild(option.cloneNode(true));
            });
        };
        document.getElementById('statsForm').addEventListener('submit',function(e){
            e.preventDefault();
            UIkit.modal(document.getElementById('generalModal')).hide();
            var temp=document.getElementById('avgCalc').value;
			var dec=parseInt(document.getElementById('decimalsInput').value);
			if(dec!=options.stats.decimalsDisplayed){
				options.stats.decimalsDisplayed = dec;
				timer.tableprint(null,1,timer.arr,timer.cubetype,options);						
				
			}            
            var tableDisplay = document.getElementById('tableAvg').value;
            var tableDisplay1 = document.getElementById('tableAvg1').value;
            if(tableDisplay){
                document.getElementById('tableTh1').innerHTML = tableDisplay;
                options.stats.table.TableAvgDisplay=tableDisplay;
            };
            if(tableDisplay1){
                document.getElementById('tableTh2').innerHTML = tableDisplay1;
                options.stats.table.TableAvg1Display=tableDisplay1;
            };
            if (temp){
                var temparr = temp.split(',');
                var avgarr=processAvgs(temparr);
                options.stats.AvgsUsed = [];
                options.stats.AvgsUsed = avgarr;
            }

        });
        localStorage.setItem('options', JSON.stringify(options));
        return options;
    };
    function generalOptions(options){
        document.getElementById('generalForm').addEventListener('submit',function(e){
            e.preventDefault();
        })
    }
    function processAvgs(templist){
        var arr=[];
        templist.forEach(el => {
            if (el.startsWith('mo')==false && el.startsWith('ao')==false){
                alert(`The input ${el} is not valid an will not be used`);
            }else{
                var tempdigit=parseInt(el.substr(2));
                if (typeof tempdigit!='number'){
                    alert('The input '+el+' is not valid an will not be used');
                }else{
                    arr.push(el);
                }
            };
        })
        return arr;
    }
    function processColours(options){
        var whatCont=document.getElementById('whatDiv').value;
        $('#whatDiv').on('change',function(){
            $('#goBack').unbind();
            console.log($(this).val());
            whatCont=$(this).val();
        });
        $('#showChanges').on('click',function(e){
            e.preventDefault();
            UIkit.modal(document.getElementById('colourModal')).hide();
            showText();
            document.getElementById('goBack').style.display="block";
            $('#goBack').on('click',function(){
                UIkit.modal(document.getElementById('colourModal')).show();
                document.getElementById('goBack').style.display="none";
            });
            var border=document.querySelector('input[name=borderRadio]:checked').value;
            var borderSize=document.getElementById('borderRange').value +'px';
            var colour = document.getElementById('mainColour').value;
            var fontColour = document.getElementById('fontColour').value;
            document.getElementById(whatCont).style.backgroundColor = colour;
            document.getElementById(whatCont).style.color = fontColour;
            document.getElementById(whatCont).style.borderWidth = borderSize;
        });
        $('#coloursDiscard').on('click',function(e){
            e.preventDefault();
            UIkit.modal(document.getElementById('colourModal')).hide();
            showText();
        });

        $('#coloursSubmit').on('click',()=>{
            $('#goBack').unbind();            
            $('#colourForm').submit(function(e){
                e.preventDefault();
            });
            var border=document.querySelector('input[name=borderRadio]:checked').value;
            var borderSize=document.getElementById('borderRange').value +'px';
            var colour = $('#mainColourB').spectrum('get').toHexString();
            var fontColour = $('#fontColourB').spectrum('get').toHexString();
            var fontSize = document.getElementById('fontRange').value+'px';
            var gradient = document.querySelector('input[name=gradientRadio]:checked').value;
            console.log(gradient);
            if (gradient=='true'){
                console.log('wut');
                var firstGradient=$('#gradientC1B').spectrum('get').toHexString();
                var secondGradient=$('#gradientC2B').spectrum('get').toHexString();
                var dirGradient=document.getElementById('whatDir').value;
                options.colours[whatCont].isGradient=true;
                console.log(dirGradient);
                options.colours[whatCont].gradientD=dirGradient;
                options.colours[whatCont].gradientC1=firstGradient;
                options.colours[whatCont].gradientC2=secondGradient;
            } else{
                console.log(gradient);
                options.colours[whatCont].colour=colour;
            }           
            if (border=='false'){
                options.colours[whatCont].isBorder=false;   
                options.colours[whatCont].BorderS=0;             
            } else{                
                options.colours[whatCont].isBorder=true;
                options.colours[whatCont].BorderS=borderSize; 
            };            
            options.colours[whatCont].fontC=fontColour;
            options.colours[whatCont].fontS=fontSize;
            Object.keys(options.colours).forEach(key => {
                data.applyColours(key,options.colours[key]);
            });	
            console.log(options);
            UIkit.modal(document.getElementById('colourModal')).hide();
            localStorage.setItem('options', JSON.stringify(options))
            showText();
        })
    }
    /////MAIN FUNCTION///////

    Mousetrap.bind('ctrl+m',function(){
        menuOpened=generalMenu(menuOpened);
        return false;
    });
    Mousetrap.bind('c',function(){
        if (coloursOpened==false){
            coloursOpened=true;
            $('#mainColourB,#fontColourB,#gradientC1B,#gradientC2B').spectrum({
                color: "#f00",
                showInput: true,
                showPalette:true,
                palette:[
                    ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                    ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                    ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                    ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                    ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                    ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                    ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                    ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
                ],
                chooseText: "Save",
                cancelText: "Discard",
                preferredFormat: "hex",
                
            });
            $('#mainColour').on('input',()=>{
                $("#mainColourB").spectrum("set",$('#mainColour').val());
            });
            $("#mainColourB").on('move.spectrum',()=>{                
               document.getElementById('mainColour').value=$('#mainColourB').spectrum('get').toHexString();
            });           
            $('#fontColour').on('input',()=>{
                $("#fontColourB").spectrum("set",$('#fontColour').val());
            });
            $("#fontColourB").on('move.spectrum',()=>{                
                document.getElementById('fontColour').value=$('#fontColourB').spectrum('get').toHexString();
             }); 
             $('#gradientC1').on('input',()=>{
                $("#gradientC1B").spectrum("set",$('#gradientC1').val());
            });
            $("#gradientC1B").on('move.spectrum',()=>{                
                document.getElementById('gradientC1').value=$('#gradientC1B').spectrum('get').toHexString();
             });
             $('#gradientC2').on('input',()=>{
                $("#gradientC2B").spectrum("set",$('#gradientC2').val());
            });
            $("#gradientC2B").on('move.spectrum',()=>{                
                document.getElementById('gradientC2').value=$('#gradientC2B').spectrum('get').toHexString();
             }); 

            hideText();
            //lopping through all elements with the class colourInput
            //as this return an array, so undefined error
            var el= document.getElementById('colourModal');
            UIkit.modal(el).show();
            options=processColours(options);
        } else {
            showText();
            var el= document.getElementById('colourModal');
            UIkit.modal(el).hide();
            coloursOpened=false;
        }
        return false;
    });

};
function hideText(){
    document.getElementById('scramble').style.display = "none";
    document.getElementById('scrambleSVG').style.display = "none";
    document.getElementById('Timetable').style.display = "none";
    document.getElementById('chart').style.display = "none";
    document.getElementById('time').style.display = "none";
    document.getElementById('CubeUsed').style.display = "none";
    document.getElementById('VirtualPenalty').style.display = "none";
};
function showText(){
    document.getElementById('scramble').style.display = "block";
    document.getElementById('scrambleSVG').style.display = "initial";
    document.getElementById('Timetable').style.display = "table";
    document.getElementById('chart').style.display = "initial";
    document.getElementById('time').style.display = "initial";
    document.getElementById('CubeUsed').style.display = "initial";
    document.getElementById('VirtualPenalty').style.display = "initial";
}
