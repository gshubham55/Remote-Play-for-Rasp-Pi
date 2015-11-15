var request = require ('request')
  , root="https://www.googleapis.com/youtube/v3/";

var search = function(q,cb){
	var url = root + "search?part=snippet&regionCode=GB&maxResults=1&q="+q+"&key=AIzaSyA1exyfcjPLIKK1zhQkrVfR0pzrKxCMsak";
	request.get(url,function(err,res,body){
		if(!err && res.statusCode==200){
			temp = JSON.parse(body);
			// console.log(temp.items[1].snippet.title);
			// res.send(body);
			cb(temp.items[0]);
		}
	})
}

module.exports = {
	search: search
}