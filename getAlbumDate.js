var fs = require('fs'),
    musixMatch = require('./musixmatch.js'),
    CONFIG = require('./config.js'),
    csv = require('csv-write-stream');

var musix = new musixMatch.MusixMatch(CONFIG.api);

var albumIDS = JSON.parse(fs.readFileSync('data/album_id.json', encoding='utf8'))

var writer = csv({separator: '\t'});
writer.pipe(fs.createWriteStream('data/album_date.csv'))

albumsTot = albumIDS.length-1;
albumsCount = 0;

var research = function(params){
  musix.album().get(params,function(n){

    var status = n.message.header.status_code;

    if(status == 200){

      var album = n.message.body.album;


      writer.write({album_id: params.album_id, date: album.album_release_date})
      console.log(params.album_id, album.album_release_date)


      albumsCount = albumsCount+1
      if(albumsCount <= albumsTot){
        params = {album_id:albumIDS[albumsCount]}
        research(params)
      }else{
        writer.end()
        console.log("finished")
      }

    }else{
      console.log('oops some problems occured, maybe you reach the API rate limit...error code: ' + status)
      writer.end()
    }

  });
}

var params = {album_id:albumIDS[albumsCount]}

research(params)
