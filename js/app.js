/**
 * Created by marcocheng on 11/26/14.
 */
$(document).ready(function() {


    $('#submit').click(function() {
        var carbonEmission = Parse.Object.extend("CO2Emissions");
        var CO2 =new carbonEmission();
        CO2.set("Username", $('#username').val()) ;
        CO2.set("Password", $('#password').val());
        CO2.set("Email", $('#email').val());
        CO2.save(null, {
            success: function() {
                alert('it works!');
            },
            error: function(CO2, error) {
                console.log(error.message);
            }
        });
    });

    $('body').scrollspy({ target: '.navbar-custom' });


    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh')
    });

//    $(document).ready(function() {
//        $('#fullpage').fullpage();
//
//    });

    var map;
    var geocoder;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var addr1;
    var addr2;
    var mode;
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    $("#calculate").click(function() {
        initialize();
        addr1 = $("#startaddress").val();
        addr2 = $("#endaddress").val();
        mode = $('input[name="options"]:checked').val();
        if(mode == undefined) {
            mode="DRIVING";
        }
        placeMarkers();
        calcRoute();
        calculateDistances();
    });

    function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var center = {
            lat: 47.6,
            lng: -122.3
        };
        map = new google.maps.Map(mapElem, {
            center: center,
            zoom: 12
        });
        geocoder = new google.maps.Geocoder();
        directionsDisplay.setMap(map);
        mode = "";
        addr1 = "";
        addr2 = "";
    }

    function placeMarkers() {
        geocoder.geocode({address: addr1}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var coords = results[0].geometry.location;
                var marker = new google.maps.Marker({
                    position: coords,
                    map: map
                });
            }

        });
        geocoder.geocode({address: addr2}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var coords = results[0].geometry.location;
                var marker = new google.maps.Marker({
                    position: coords,
                    map: map
                });
            }

        });
    }

    function calcRoute() {
        var travel;
        //console.log(mode);
        if(mode == "DRIVING" || mode == "CARPOOL") {
            console.log("DRIVING/CARPOOL");
            travel = google.maps.TravelMode.DRIVING;
        } else if (mode == "BIKE")  {
            console.log("BIKE");
            travel = google.maps.TravelMode.BICYCLING;
        } else if(mode == "TRANSIT") {
            console.log("TRANSIT");
            travel = google.maps.TravelMode.TRANSIT;
        } else {
            console.log("WALK");
            travel = google.maps.TravelMode.WALKING;
        }

        var request = {
            origin:addr1,
            destination: addr2,
            travelMode: travel
        };
        directionsService.route(request, function(response, status) {
            if(status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

    function calculateDistances() {
        var travel;
        console.log(mode);
        if(mode == "DRIVING" || mode == "CARPOOL" || mode == "TRANSIT") {
            console.log("DRIVING/CARPOOL/TRANSIT");
            travel = google.maps.TravelMode.DRIVING;
        } else if (mode =="WALK"){
            console.log("WALKING");
            travel = google.maps.TravelMode.WALKING;
        } else {
            console.log("BIKE");
            travel = google.maps.TravelMode.BICYCLING;
        }
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix ({
            origins: [addr1],
            destinations: [addr2],
            travelMode: travel,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
        }, callback);
    }

    function callback(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
        } else {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
            var outputDiv = document.getElementById('outputDiv');
            outputDiv.innerHTML = '';

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
                        + ': ' + results[j].distance.text + ' in '
                        + results[j].duration.text + '<br>';
                    calculateEmissions(results[j].distance.value);
                }
            }
        }
    }

    function calculateEmissions(distance) {
        var result = 0;
        if(mode == "DRIVING") {
            result = (0.96 * distance);
        } else if(mode == "TRANSIT") {
            result = (0.64 * distance);
        } else if(mode == "CARPOOL") {
            result = (0.96 * distance);
        } else {
            result = 0.0;
        }
        var total = (result / 1609.344);
        var value = total.toFixed(2);
        var emissions = document.getElementById('emissions');
        emissions.innerHTML = "You released " + value + " pounds of carbon emissions into the environment!";
    }
});

//
//$(document).ready(function() {

    $('#fullpage').fullpage({
        //Navigation
        menu: '#menu',
        anchors:['1', '2','3','4'],
        navigation: false,
        navigationPosition: 'right',
        navigationTooltips: ['firstSlide', 'secondSlide'],
        slidesNavigation: true,
        slidesNavPosition: 'bottom',

        //Scrolling
        css3: true,
        scrollingSpeed: 700,
        autoScrolling: true,
        scrollBar: false,
        easing: 'easeInQuart',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        continuousVertical: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        touchSensitivity: 15,
        normalScrollElementTouchThreshold: 5,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,

        //Design
        verticalCentered: true,
        resize : true,

        sectionsColor : ['#393939', '#393939','#393939','#393939','#393939','#393939'],

        paddingTop: '3em',
        paddingBottom: '10em',
        fixedElements: '#header, .footer',
        responsive: 0,

        //Custom selectors
        sectionSelector: '.section',
        slideSelector: '.slide',

        //events
        onLeave: function(index, nextIndex, direction){},
        afterLoad: function(anchorLink, index){},
        afterRender: function(){},
        afterResize: function(){},
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
        onSlideLeave: function(anchorLink, index, slideIndex, direction){}
    });

//});