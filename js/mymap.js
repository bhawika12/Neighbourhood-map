var map;
var marker;
var markers=[];

function initMap(){

    map=new google.maps.Map(document.getElementById('map'),{
        center: {lat:9.591441, lng:76.522171},
        zoom: 11,
    });

    var infoWindow = new google.maps.InfoWindow({
        maxWidth:200
    });
    var bounds = new google.maps.LatLngBounds();

    for(i=0; i<places.length; i++) {
        var position = places[i].location;
        var title = places[i].title;

        marker = new google.maps.Marker({
            map:map,
            position:position,
            title:title,
            animation: google.maps.Animation.DROP,
            icon: {
            url: 'images/marker.png',
            },
        });
        bounds.extend(marker.position);
        vm.locationList()[i].marker = marker;

        marker.addListener('click', function(){
            toggleBounce(this);
            populateInfoWindow(this,infoWindow);
        });

        function toggleBounce(marker) {
            setTimeout(function() {
                marker.setAnimation(null)
            },900);
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        function populateInfoWindow(marker, infowindow) {
            var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&imlimit=5&format=json&callback=wikiCallback';

            var wikiRequestTimeout = setTimeout(function(){
                infowindow.setContent("Failed to get the Required Resources");
            },900);
            //WIKI AJAX request
            $.ajax({
                url:wikiUrl,
                dataType:'jsonp',
                success: function(data){

                    var infoUrl = data[3][0];
                    var infodescr = data[2][0];

                    //Error handle
                    if(infoUrl !== undefined) {
                        infowindow.marker = marker;
                        infowindow.setContent('<div><strong>'+marker.title+'</strong><p>'+infodescr+'</p></div>');
                        infowindow.open(map, marker);
                    }else{
                        infowindow.setContent('<div>'+ marker.title+'<p>SORRYY!!!! Cannot find WIKIPEDIA content</p></div>');
                        infowindow.open(map, marker);
                    }
                    clearTimeout(wikiRequestTimeout);
                },
                error: function(){
                    infowindow.setContent('<div>'+ marker.title+'<p>SORRYY!!!! Cannot find WIKIPEDIA content</p></div>');
                    infowindow.open(map, marker);
                }
            });
            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter({
                lat: 9.591441,lng: 76.522171
                });
            map.fitBounds(bounds);
            });
        }
        map.fitBounds(bounds);
    }
    ko.applyBindings(vm);
}

function mapError(){
    //$( document ).ajaxError(function() {
        window.alert( "AJAX ERROR HANDLING!!" );
    //});
}
