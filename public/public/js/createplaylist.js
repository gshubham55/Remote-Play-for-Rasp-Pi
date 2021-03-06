var selectedSongs = {items: [
	]};

$(document).ready(function(){
	$("#nameplaylist").focus();
	$("#searchbox").hide();
	var playlistname;
	$("#nameplaylist").bind('keydown',function(e){
		if(e.keyCode===13){
			playlistname=this.value;
			$("#nameplaylist").hide();
			$("#searchbox").show();
			$("#searchbox").focus();
			$("#playlistname").html(playlistname);
			console.log(playlistname);
		}
	})
	$('.data').delegate('#tracks ol li','click',function(e){
    	console.log('hola man');
    })	
    $("#Create").click(function(){
	 // sends song data to node backend
	    var url = document.URL + "";
	    console.log(url);
	    $.ajax({
	      type: "POST",
	      url: url,
	      data: {"list":selectedSongs, "name": playlistname}
	    }).done(function(msg){
	      console.log(msg);
	    })
	      var url = document.URL + "/../" +playlistname;
	      console.log(url);
	      // window.location.replace(url);

    })
})

$.getJSON('../config.json',function(config){
  $("#searchbox").bind('keydown',function(e){
    if(e.keyCode===13){
      var text=this.value;
      
      if(text.substr(0,4)==="http"){
        //We have a youtube link for us
        $.post('/youtube',{link:text});
      }
      else{
        $.get(config.muzi_root+"ajax/search/index.php",{search:text},function(data){
          $('#artists').remove();
          $('#tracks').remove();
          $('#albums').remove();
          $('.data').append('<div id="tracks" class="span4"><h2>Tracks</h2><ol></ol></div>');
          $('.data').append('<div id="artists" class="span4"><h2>Artists</h2><ol></ol></div>');
          $('.data').append('<div id="albums" class="span4"><h2>Albums</h2><ol></ol></div>');
          

          html='';
          for(i in data.tracks){
            html+='<li mid="'+data.tracks[i].id
              +'" albumid="'
              +data.tracks[i].albumId
              +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
              +config.pics_root
              +data.tracks[i].albumId
              +'.jpg"><div class="entry1">'
              +data.tracks[i].title
              +'</div><div class="entry2">'
              +data.tracks[i].artist
              +'</div><div style="clear:both">'
              +'</div></li>'
          }
          console.log(html);
          $('#tracks ol').html(html);

          html='';
          for(i in data.artists){
            html+='<li mt="artist" mid="'
            +data.artists[i].id+
            '"><img style="float:left" class="thumbnail" width="50" height="50" src="'
            +config.pics_root
            +data.artists[i].id
            +'.jpg"><div class="entry1">'
            +data.artists[i].name
            +'</div><div style="clear:both"></div></li>'
          }
          $('#artists ol').html(html);

          html='';
          for(i in data.albums){
            html+='<li mt="album" mid="'
            +data.albums[i].id
            +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
            +config.pics_root
            +data.albums[i].id
            +'.jpg"><div class="entry1">'
            +data.albums[i].name
            +'</div><div class="entry2">'
            +data.albums[i].band
            +'</div><div style="clear:both">'
            +'</div></li>'

          }
          $('#albums ol').html(html);
        });
      }
    }
  });

  $('.stop').click(function(){
    $.get("/kill");
  });
  
  $('.data').delegate('#tracks ol li','click',function(e){
    // console.log('We clicked on a song!');
    var trackId=this.getAttribute('mid')
    // $.get(config.muzi_root+"ajax/track/",{id:trackId},function(data){
    //   var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
    //   $.post('/play',{url:config.music_root+url,id:data.id},function(){
    //     console.log("Sent a play request");
    //     $.get(config.muzi_root+'ajax/track/log.php',{id:data.id});
    //   })
    // })


    var trackName = $(this).find('div.entry1').html();
    var artistName = $(this).find('div.entry2').html();
    var picId = trackId;
    // only case when mid isn't the same as pic id
    if(this.getAttribute('albumid'))
    {
      picId = this.getAttribute('albumid');
      console.log("im in");
    }
    // incase the album is open
    if (!$(this).find('div.entry2').html())
    {
      picId = $("#tracksonly").attr("mid");
    }
    if(this.getAttribute('mt') == "track")
    {
      artistName = $(this).parent().find('h3').html();
    }
	function getObjects(obj, key, val) {
	    var objects = [];
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(getObjects(obj[i], key, val));
	        } else if (i == key && obj[key] == val) {
	            objects.push(obj);
	        }
	    }
	    return objects;
	}
	function findAndRemove(array, property, value) {
	   $.each(array, function(index, result) {
	      if(result[property] == value) {
	          //Remove from array
	          array.splice(index, 1);
	      }    
	   });
	}
	var temp = getObjects(selectedSongs,"id",trackId);
	if (temp.length==0)
	{
		selectedSongs.items.push(
			{"song":trackName,"artist":artistName,"TrackId":trackId,"picId":picId}
		);
  		$(this).addClass('blueBack');
	}
	else 
	{
		findAndRemove(selectedSongs.items,"id",trackId);
  		$(this).removeClass('blueBack');
	}
	
  });
  
  $('.data').delegate('#artists ol li','click',function(e){
    //We clicked on an artist!
    //console.log('We clicked on an artist!');

    var artistId=this.getAttribute('mid');
    $.get(config.muzi_root+"ajax/band/albums.php",{id:artistId},function(data){
      $('#artists').remove();
      $('#tracks').remove();
      $('#albums').removeClass().addClass('span4 offset4');
      html='';
      for(i in data.albums){
        html+='<li mt="album" mid="'
        +data.albums[i].id
        +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
        +config.pics_root
        +data.albums[i].id
        +'.jpg"><div class="entry1">'
        +data.albums[i].name
        +'</div><div class="entry2">'
        +data.albums[i].band
        +'</div><div style="clear: both"></div></li>'
      }
      $('#albums ol').html(html);
    })
  });
  
  $('.data').delegate('#albums ol li','click',function(e){
    //console.log('We clicked on an album!');

    var albumId=this.getAttribute('mid');
    $.get(config.muzi_root+"ajax/album/index.php",{id:albumId},function(data){
      $('#albums').remove();
      $('#artists').remove();
      $('#tracks').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Tracks</h2><ol></ol></div>');
      $('#tracks').removeClass().addClass('span4 offset4 single');
      html='<div id="tracksonly" mid="'
        +data.id
        +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
        +config.pics_root
        +data.id
        +'.jpg"><h3>'
        +data.band
        +'</h3></div><div style="clear: both"><h4>'
        +data.name
        +'</h4></div>';
      for(i in data.tracks){
        html+='<li mt="track" mid="'
        +data.tracks[i].id
        +'"><div class="entry1">'
        +data.tracks[i].title
        +'</div></li>'
      }
      $('#tracks ol').html(html);
    })
  });
})