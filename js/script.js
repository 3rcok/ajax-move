function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiAreaElem = $('#wikipedia-area-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $wikiAreaElem.text("");
    $nytElem.text("");

    /*
    * Street View
     */
    var $street = $("#street").val();
    var $city = $('#city').val();
    var capitaliseFirstLetter = function(string) {
        var names = string.split(' ');
        var newName = '';
        for(var i = 0, len = names.length; i < len; i++) {
            var name = names.pop();
            name = name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase();
            newName = name + ' ' + newName;
        }
        return newName;
    };
    $city = capitaliseFirstLetter($city);
    $city = $.trim($city);
    $street = capitaliseFirstLetter($street);
    $street = $.trim($street);
    var address = $street + ', ' + $city;
    if($street === "") {
        $greeting.text('So you want to live in ' + $city + '?');
    } else {
        $greeting.text('So you want to live at ' + address + '?');
    }
    address = encodeURIComponent(address.trim());
    var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=AIzaSyB-hQ9XSdTmxybMtadlYOCsMkH5Yi6cBoI';
    var HTMLimage = '<img class="bgimg" src="' + streetViewUrl + '">';
    $body.append(HTMLimage);

    /*
    * Retrieving articles from the New York Times API
     */
    var nyTimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=@@searchstring@@&api-key=d393bf7813f33b17c0a07f4e7e7c304b:4:70237256';
    $.getJSON(nyTimesUrl.replace('@@searchstring@@', $city), function(data) {
        //console.log(data.response.docs);
        $nytHeaderElem.text('New York Times Articles About ' + $city);
        var articles = data.response.docs;
        for(var i = 0; i < articles.length; i++) {
            if(articles[i].snippet !== null) {
                var HTMLlink = '<li class="article"><a href="'+articles[i].web_url+'" target=_blank>'+articles[i].headline.main+'</a><br/>';
                var HTMLarticle = '<p>'+articles[i].snippet+'</p></li>';
                $nytElem.append(HTMLlink, HTMLarticle);
            }
        }
    }).error(function() {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    /*
    * Retrieving information from Wikipedia
     */
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia resources');
    }, 8000);

    var wikiUrl = 'http://en.wikiasdfasdfpedia.org/w/api.php?action=query&generator=links&prop=info&continue=&format=json&titles=@@searchstring@@';
    $.ajax({
        crossOrigin: true,
        url: wikiUrl.replace('@@searchstring@@', $city),
        dataType: 'jsonp'
    }).success(function(data) {
        var HTMLtitles = data.query.pages;
        for(var item in HTMLtitles){
            var HTMLtitle = HTMLtitles[item].title;
            var HTMLUrl = '<li><a href="http://en.wikipedia.org/wiki/'+ HTMLtitle + '" target="_blank">' + HTMLtitle + '</li>';
            $wikiElem.append(HTMLUrl);
        }
        clearTimeout(wikiRequestTimeout);
    });
    var wikiAreaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=@@searchstring@@&format=json&callback=wikiCallback';
    $.ajax({
        crossOrigin: true,
        url: wikiAreaUrl.replace('@@searchstring@@', $city),
        dataType: 'jsonp'
    }).success(function(data) {
        console.log(data);
        window.data = data;
        var HTMLtitles = data[1];
        console.log(HTMLtitles);
        for(var i = 0, len = HTMLtitles.length; i < len; i++){
            var HTMLtitle = HTMLtitles[i];
            console.log(HTMLtitle);
            var HTMLUrl = '<li><a href="http://en.wikipedia.org/wiki/'+ HTMLtitle + '" target="_blank">' + HTMLtitle + '</li>';
            $wikiAreaElem.append(HTMLUrl);
        }
    });

    return false;
}

$('#form-container').submit(loadData);

//loadData();


