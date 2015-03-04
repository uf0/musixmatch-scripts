var fs = require('fs'),
    musixMatch = require('./musixmatch.js'),
    CONFIG = require('./config.js'),
    csv = require('csv-write-stream');

var musix = new musixMatch.MusixMatch(CONFIG.api);

var words = JSON.parse(fs.readFileSync('data/words2.json', encoding='utf8'))

var writer = csv({separator: '\t'});
writer.pipe(fs.createWriteStream('data/tracks.csv'))

wordsTot = words.length-1;
wordsCount = 0;

var research = function(params){
  musix.track().search(params,function(n){

    var status = n.message.header.status_code;

    if(status == 200){

      var total = n.message.header.available;
          pages = Math.ceil(total/100);

      var tracks = n.message.body.track_list;

        if(tracks.length){
          tracks.forEach(function(e){
            var track = e.track;

            track.genres =  []

            track["primary_genres"]["music_genre_list"].forEach(function(f){
              track.genres.push(f["music_genre"]["music_genre_name"])
            })

            track.genres = track.genres.join(",")
            track.word = params.q_lyrics;

            delete track["artist_mbid"];
            delete track["album_coverart_100x100"];
            delete track["album_coverart_350x350"];
            delete track["album_coverart_500x500"];
            delete track["album_coverart_800x800"];
            delete track["track_share_url"];
            delete track["track_edit_url"];
            delete track["primary_genres"];
            delete track["secondary_genres"];
            delete track["track_mbid"]

            writer.write(track)
            console.log(track.track_id, params.q_lyrics)
          })

          if(params.page < pages){
            params.page = params.page + 1;
            research(params)
          }else{
            wordsCount = wordsCount+1
            if(wordsCount <= wordsTot){
              params = {q_lyrics:words[wordsCount], s_track_rating:'desc', g_common_track:1, page_size:100, page:1}
              research(params)
            }else{
              writer.end()
              console.log("finished")
            }
          }
        }else{
          console.log("something odd happened")
          writer.end()
        }
    }else{
      console.log('oops some problems occured, maybe you reach the API rate limit...error code: ' + status)
      writer.end()
    }

  });
}

var params = {q_lyrics:words[wordsCount], s_track_rating:'desc', g_common_track:1, page_size:100, page:1}

research(params)
