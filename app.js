/**
 * Module dependencies.
 */

var express = require ('express')
  , routes = require('./routes')
  , ejs = require ('ejs')
  , fs = require ('fs')
  // , youtubedl = require('youtube-dl')
  , ytdl = require ('ytdl')
  // , jsdom = require ('jsdom')
  , yt = require ('./lib/yt.js') 
  , request = require ('request') ;

var sys = require('sys')
var exec = require('child_process').exec;
var exec1 = require('child_process').exec;
// var child;

var app = express();

// Configu ration

app.configure(function(){
  app.use (express.logger ('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.set ('views', __dirname + '/views');
  app.set ('view engine', 'ejs');
  app.set("view options", { layout: false }) 
});

app.get('/favicon.ico',function(){});

app.get('/',function(){
  res.sendfile('index.html');
})

app.post('/kill',function(req,res){
    exec1('killall vlc',
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
  
})

app.post('/play',function(req,res){
  var q = req.body.q;
  console.log('q: '+q);
  yt.search(q,function(track){

    // res.render('search',{
    //  cont: cont
    // });
 
    var VId = track.id.videoId;
    var title = track.snippet.title;
    console.log(title + ' ' + VId);

    // ytdl('http://www.youtube.com/watch?v='+VId)
          // .pipe(fs.createWriteStream('./videos/'+VId+'.flv'));
          // console.log("yoyo"+VId);

    // var scriptRun = 0;
    exec('./deploy.sh ' + VId,
      function (error,stdout,stderr) {
        // scriptRun = 0;
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
    // scriptRun = 1;
    // function endRes(res)
    // {
      
    //   console.log("sr " + scriptRun);
    //   if (scriptRun == 1 )
    //     {
    //       setTimeout(endRes, 50);
    //     }
	   //  else 
    //     res.end(title);
    // }
    // endRes();
    res.end(title);
	});
})

app.post('/volup',function(req,res){
    exec1('vol +',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr); 
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
  res.end();
})

app.post('/voldown',function(req,res){

    exec1('vol -',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
  res.end();
})
var kill30Check = 1;
app.post('/killAfter',function(req,res){
	var temp = req.body.t;
	var t = temp*60*1000;
	console.log("kill after "+temp );
	if(kill30Check==1)
	{
		kill30Check = 0;
		setTimeout(function(){
			kill30Check = 1;
			exec1('killall vlc',
     				 function (error, stdout, stderr) {
        				console.log(stdout); 
        				console.log('stderr: ' + stderr);
 		       			if (error !== null) {
         					 console.log('exec error: ' + error);
       					 }
   			 });
		},t);
		res.end("Killing in "+ temp);
	}
	res.end("Already initiated killing seq");
})

app.listen(3000);
