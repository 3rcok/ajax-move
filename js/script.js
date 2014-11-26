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
    var address = $street + ', ' + $city;
    $greeting.text('So you want to live at ' + address + '?');
    address = encodeURIComponent(address.trim());
    var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=AIzaSyB-hQ9XSdTmxybMtadlYOCsMkH5Yi6cBoI';
    var HTMLimage = '<img class="bgimg" src="' + streetViewUrl + '">';
    $body.append(HTMLimage);

    $.getJSON(URL, function(data) {
        console.log(data);
    });

    var nyTimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=@@searchstring@@&api-key=d393bf7813f33b17c0a07f4e7e7c304b:4:70237256';
    $.getJSON(nyTimesUrl.replace('@@searchstring@@', 'new+york'), function(data) {
        console.log(data);
    });
    return false;
};

$('#form-container').submit(loadData);

//loadData();


