export function dataBackup(db,options,solves){
    db.put({
        _id:new Date().toISOString(),
        options:options,
        solve:solves,
    }).then(response=>{
        console.log('Added the ting');
    }).catch(err=>{
        console.log('xd',err)
    });
    db.info().then(result=>{
        console.log(result);
    })
}
export function calc(arr,cube,options){
    var DNFnum=0;
    var list=[];
    var tempavg=[];
    options.stats.AvgsUsed.forEach(function(el,i){
        //first this will get the type of average calculated
        //if its a mean, it will take the average value of ALL solves or DNF it
        //if theres at least 1 DNF.
        //If its a average it will take out a percentage of solves (see avgs in OD)
        //and calculate a mean out of the remaining solves. This allows to
        //have a number of DNFs.
        if(el.startsWith('mo')==true){
            var avgtype ='mo';
            var avglength=parseInt(el.substr(2));
        }else{
            var avgtype = 'ao';
            var avglength=parseInt(el.substr(2));
        };
        var solveSize=0;
        arr.forEach(function(el){
            //will get the number of solves with the required cube
            if (el.type==cube){
                solveSize++;
            };
        });
        if(solveSize<avglength){
            //if there arent enough solves to make an avg
            //it will be null
            tempavg[i]=null;
        } else{
            var j=arr.length-1;
            while(list.length!=avglength){
                //loops backwards through the array, gets matching solves
                if(arr[j].type==cube){
                    if (arr[j].penalty==-1){
                        list.push(-1);
                    } else {
                        list.push(arr[j].result);
                    };
                };
                j--;
            };
            for (var j=0;j<list.length;j++){
                //checks for the number of DNFs, since they stored as -1
                if(list[j]==-1){
                    DNFnum++;
                };
            };
            switch (avgtype){
                case 'mo':
                    if (DNFnum>1){
                        tempavg[i] = -1;
                    } else{
                        for (var j=1;j<avglength;j++){
                            tempavg[i] = math.round((math.mean(list)),4);
                        };
                    };
                case 'ao':
                    switch (avglength){
                        case 5:
                        case 12:
                        if (DNFnum>=2){
                            tempavg[i]=-1;
                        } else {
                            var smallestValue = list.indexOf(Math.min(...list));
                            list.splice(smallestValue, 1);
                            var biggestValue = list.indexOf(Math.max(...list));
                            list.splice(biggestValue, 1);
                            tempavg[i] = math.round((math.mean(list)),4);
                        }
                        break;
                        default:
                        //any other avg
                        if(DNFnum>=Math.round(avglength*0.9)){
                            tempavg[i]=-1
                        } else {
                            for(var l=1;l<Math.round(avglength*0.1);l++){
                                // for ao50+ ~90% of solves are counting, rest discarded
                                smallestValue = list.indexOf(Math.min(...list));
                                list.splice(smallestValue, 1);
                                biggestValue = list.indexOf(Math.max(...list));
                                list.splice(biggestValue, 1);
                            };
                            tempavg[i] = math.round((math.mean(list)),4);
                        };
                        break;
                    };
            };
        };
    });
    return tempavg;
};

export function dateFormatter(time,decimals){
	console.log(decimals);
    var h=Math.trunc(time/3600);
    var result=( h > 0 ? h+':' :"");    
    time=time-(h*3600);
    var m=Math.trunc(time/60);
	result=(h > 0 ? result+(m>9 ? m+':':'0'+m+':' ) : (m>0 ? (m>9 ? m+':':'0'+m+':') : ""  ));
	if(decimals==3){
		var s=Math.floor((time-(m*60)) * 1000) / 1000; 
	} else{
		var s=Math.floor((time-(m*60)) * 100) / 100; 
	}      
     
    s=(s > 9 ? s : "0" + s );
    result=result+s;     
    return result;
};

export function Time(id,cube,time,scrambles,pen,decimals){
    this.position = id;
    this.type = cube;
    this.result = time;
    this.scramble = scrambles
	this.penalty = pen;  
	this.comment="";  
};

export function avg(avgs,avglist,empty){
    for (var i=0;i<avglist.length;i++){
        if(empty==true){
            this[avglist[i]]=null;
        }else{
            this[avglist[i]]=avgs[i];
        }
    };
    
}
export function side(){
    this.isBorder='on',
    this.borderS='1px',
    this.colour='#0D5C63',
    this.fontC='#000000';
    this.fontS='16px';
    this.isGradient='false';
	this.gradientD=''; 
	this.gradientC1='';
	this.gradientC2='';
	
}
export function applyColours(name,side){
	var e=document.getElementById(name);
	e.style.color=side.fontC;		
	e.style.fontSize=side.fontS;
	if(side.isBorder==true){
		e.style.borderWidth=tsidehis.borderS;
	};		
	if (side.isGradient==true){
		e.style.background=`linear-gradient(${side.gradientD},${side.gradientC1},${side.gradientC2}`;
	} else{
         e.style.backgroundColor=side.colour;
    };
};
export function HHtoFloat(time){
    let temp=time.split(':');   
    switch(temp.length){
    case 1:
        return parseFloat(temp[0]);
        break;
    case 2:
        return (parseFloat(temp[0])*60)+parseFloat(temp[1]);
        break;
    case 3:
        return (parseFloat(temp[0])*3600)+parseFloat(temp[1]*60)+parseFloat(temp[2]);
        break;
    }
};