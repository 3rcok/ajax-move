function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    /*
    * Street View
     */
    var $street = $("#street").val();
    var $city = $('#city').val();
    var capitaliseFirstLetter = function(string) {
        var newName = '';
        var names = string.split(' ');
        for(var i = 0; i <= names.length; i++) {
            console.log(names);
            var name = names.pop();
            console.log(names);
            console.log(names.length);
            console.log(name);
            name = name.slice(0,1).toUpperCase() + name.slice(1).toLocaleLowerCase();
            newName = name+ ' ' + newName;
            console.log(newName);
        }
        return newName;
    };
    $city = capitaliseFirstLetter($city);
    $city = $.trim($city);
    console.log($city);
    $street = capitaliseFirstLetter($street);
    $street = $.trim($street);
    console.log($street);
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

    var nyTimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=@@searchstring@@&api-key=d393bf7813f33b17c0a07f4e7e7c304b:4:70237256';
    $.getJSON(nyTimesUrl.replace('@@searchstring@@', $city), function(data) {
        console.log(data.response.docs);
        $nytHeaderElem.text('New York Times Articles About ' + $city);
        var articles = data.response.docs;
        for(var i = 0; i < articles.length; i++) {
            if(articles[i].snippet !== null) {
                var HTMLlink = '<li class="article"><a href="'+articles[i].web_url+'" target=_blank>'+articles[i].headline.main+'</a><br/>';
                var HTMLarticle = '<p>'+articles[i].snippet+'</p></li>';
                $nytElem.append(HTMLlink, HTMLarticle);
            }
        }
    });
    return false;
}

$('#form-container').submit(loadData);

//loadData();


