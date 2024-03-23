
var voices = window.speechSynthesis.getVoices();


var vowel=['a','e','i','o','u','y'];
var twoStrings=['sh','wh','th','ch','cr','ss','ck', 'di', 'lk', 'bl'];
var threeStrings=['rkn','thn','thw','chn','shn','rdm','lkm'];
var neverSplit=['tch'];
var vowelSplit=['ing','ate'];


var pSymbols = [',', '.', '\''];

function isVowel(x) {
  for (var i=0;i<vowel.length;++i) {if (x==vowel[i]) {return(1)};};
  return(0);
}


function subStr(s,a,index) {
for(i=0;i<a.length;i++) 
{
 var find = s.indexOf(a[i],index)
 if(find == index) {
	    return true;
 } 
}
 return false; 
}



	






//Identify all vowels (treat y as a vowel)
//Rule 1: If there are 3 vowels in a row, create a new syllable with the second vowel onwards
//Rule 2: If there are 2 vowels in a row and the second is the beginning of a substring in vowelSplit, then create 
//   a new syllable with the second one
//Next take maximal stretches of consonants in between two vowels
//Rule 4: If there is only 1 consonant in a stretch, then start a new syllable at that consonant
//Rule 5: If there are 2 consonants in a stretch, start a new syllable at the second of these consonants unless
//   the consonant pair is in twoStrings in which case start a new syllable after the first
//Rule 6: If there are 3 consonants in a stretch, start a new syllable at the second of these consonants unless
//   this consonant triple is in threeStrings in which case start a new syllable after the third or it is in
//   neverSplit in which create a new syllable after the first
//Rule 7: Finally if the last syllable is a consonant followed by a vowel e and preced by a vowel, then merge this syllable into the previous one
function getSyllable(s) {
    s=s.toLowerCase();
    s=s.split(".")[0];

    console.log(s);

    var x=s.split("");
    var vMask=new Array();
    var firstV=-1;				   
    var firstC=-1;

    //mark vowels with vMask=1, remember the first Vowel index in firstV
    for (var i=0;i<x.length;++i) {
				 if (isVowel(x[i])) 
				    {vMask[i]=1; 
				     if (firstV==-1) {firstV=i};
                                    } 
				 else 
				    {vMask[i]=0;
				     if (firstC==-1) {firstC=i};
				    };
				 }
    
    //rules 1 and 2
    //process maximal vowels stretches sandwiched by consonants
    var pC=firstC;
    for (var i=0;i<vMask.length;++i) {
	if ((vMask[i]==0) && (i-pC>1)) {
	  switch(i-pC-1) {
           case 3: vMask[i-2] = 2; break;
 	   case 2: if (subStr(s,vowelSplit,i-1)) {vMask[i-1] = 2}; break;
          }
        }	
        if (vMask[i]==0) {pC=i;};
    }


    //rules 4, 5 and 6
    //process maximal consonant stretches sandwiched by vowels
    var pV=firstV;
    for (var i=0;i<vMask.length;++i) {
	if ((vMask[i]==1) && (i-pV>1)) {
	  switch(i-pV-1) {
           case 1: vMask[i-1] = 2;  break;
 	   case 2: if (!subStr(s,twoStrings,i-2)) {vMask[i-1] = 2} else {vMask[i-2]=2}; break;
           case 3: if (subStr(s,threeStrings,i-3)) {vMask[i-1] = 2}  else {if (subStr(s,neverSplit,i-3)) {vMask[i-3]=2}   else {vMask[i-2] = 2}}; break;
           default: vMask[pV+3] = 2; break;
          }
        }	
        if (vMask[i]==1) {pV=i;};
    }


    //rule 7
    for (var i=vMask.length-1;i>=0;--i) {
	if (vMask[i]==2) {break}
    }
    if ((i==vMask.length-2) && (!isVowel(x[i])) && (isVowel(x[i-1])) && (x[i+1]==='e')) {vMask[i]=1};

    console.log(vMask);
   
    var str = "";
    for(var i=0;i<vMask.length;i++) {
	if((vMask[i] == 2) && (i!=0)) {str=str.concat("-")};
        str=str.concat(x[i]);
    }
    return str;    
}


function button_clicked() {

	    if (event.target.id == "b") {
                   if (current!=null) {spanList[current].className="special1"};
                   current=Math.min(current+1,spanList.length-1);
                   spanList[current].className="special";
            var msg = new SpeechSynthesisUtterance(spanList[current].title);



            msg.voice = voices[3];
            speechSynthesis.speak(msg);


			wS();

	    }
		
              

}

function button_clicked2() {
		  if (event.target.id == "n") {
			       console.log(current);
                   if (current!=null) {spanList[current].className="special1"}; 
         		   current=Math.max(current-1,0);
                   spanList[current].className="special";
              var msg = new SpeechSynthesisUtterance(spanList[current].title);



              msg.voice = voices[3];
              speechSynthesis.speak(msg);


              wS();
            }                 
				
}

function gothere() {
	$("#gbar").load("file.html");

}


function speak() {
    var a=document.getElementsByTagName("span")[current];
    var url = 'http://www.google.co.in/search?q=define%3A'+a.getAttribute("id");
    popitup(url);

}

function proceed() 
{ 
 
  if (event.keyCode==110) {
	    if (current!=null) {spanList[current].className="special1"};
	    if (spanList==null) {spanList=event.target.getElementsByTagName('span');current=0}
	    else  {current=Math.min(current+1,spanList.length-1)};
	    
	    spanList[current].className="special";

      var msg = new SpeechSynthesisUtterance(spanList[current].title);



      msg.voice = voices[3];
      speechSynthesis.speak(msg);

           wS();
	    console.log('KeyPressed'+spanList[current].className);
	    }
    
  if (event.keyCode==98) {
	    if (current!=null) {spanList[current].className="special1"};
	    if (spanList==null) {spanList=event.target.getElementsByTagName('span');current=0}
	    else  {current=Math.max(current-1,0)};
	    
	    spanList[current].className="special";
      var msg = new SpeechSynthesisUtterance(spanList[current].title);



      msg.voice = voices[3];
      speechSynthesis.speak(msg);

      wS();
	    console.log('KeyPressed'+spanList[current].className);
	    
	    }
}




function saccent() {

    var info = prompt("Would you like an Indian or American accent:");
}

function CustomAlert(){
	this.render = function(dialog){
		var winW = window.innerWidth;
	    var winH = window.innerHeight;
		var dialogoverlay = document.getElementById('dialogoverlay');
	    var dialogbox = document.getElementById('dialogbox');
		dialogoverlay.style.display = "block";
	    dialogoverlay.style.height = winH+"px";
		dialogbox.style.left = (winW/2) - (560 * .5)+"px";
	    dialogbox.style.top = "100px";
	    dialogbox.style.display = "block";
		document.getElementById('dialogboxhead').innerHTML = "Acknowledge This Message";
	    document.getElementById('dialogboxbody').innerHTML = dialog;
		document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
	}
	this.ok = function(){
		document.getElementById('dialogbox').style.display = "none";
		document.getElementById('dialogoverlay').style.display = "none";
	}
}






function popitup(url) {
	newwindow=window.open(url,'name','height=300,width=700');
	
	if (window.focus) {newwindow.focus()}
	return false
}

function popmeup(url) {
	newwindow=window.open(url,'name','height=400,width=700');
	
	if (window.focus) {newwindow.focus()}
	return false;
} 

function sound() {
		
		var word  =  event.target.title;
		var skill = word.toLowerCase();
		
		skill = skill.replace("'", "");

		skill = skill.replace(",", "");
		skill = skill.replace(".", "");
		skill = skill.replace("'", "");
		skill = skill.replace("ed", "");
	
	
	try {	
		var url = "https://ssl.gstatic.com/dictionary/static/sounds/de/0/";
		var final = url + skill + ".mp3";
		popup = popitup(final);
	
		return popup;
	} catch(err) {
			console.log("The word you have click on is a noun, look on your right side for the pronounciation of such words");
	}

}




function meaning() {
	var word = prompt("Enter the word:");
	
	
	
	console.log(word);
	
	var first = "http://www.oxforddictionaries.com/definition/english/";
	
	
	final = first + word;
	popup = popmeup(final);
	
	return popup;
	

	
}
function create_text(story,title) {
    var words = story.split(" ");
    var myNode = document.getElementById("text");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    for (var i=0;i<words.length;i++) {
        var rawWord=words[i].replace(/[^A-Za-z0-9]/g,"");
        $(".story").append('<span class="special1"  onclick="go();" id="'+rawWord+'" syllable='+getSyllable(rawWord)+' title="'+rawWord+'">'+words[i] + ' </span>');
    }
    document.getElementById("title").innerHTML=title;
    spanList =  document.getElementById('text').getElementsByTagName('span');
    current=0;
    spanList[current].className="special";



    wS();

}

function Listen() {

	
    var a=document.getElementsByTagName("span")[current];

    var msg = new SpeechSynthesisUtterance(a.getAttribute("title"));



     msg.voice = voices[3];
    speechSynthesis.speak(msg);



}




function wS() {
	
	var a=document.getElementsByTagName("span")[current];
	document.getElementById("demo").innerHTML=a.getAttribute("syllable");

}

function home() {
	window.location = "vMask.html";
}

function go() {
	
	var a = event.target; a.className = "special";
	
	setTimeout(function() {a.className = "special1"}, 5900);
}
function talk() {

    if (current!=null) {spanList[current].className="special1"};
    if (spanList==null) {spanList=event.target.getElementsByTagName('span');current=0}
    else  {current=Math.max(current-1,0)};

    spanList[current].className="special";
    spanList[current].onmouseover = function() {
        var a=document.getElementsByTagName("span")[current];


        var msg = new SpeechSynthesisUtterance(a.getAttribute("title"));
        speechSynthesis.speak(msg);

    };
}
