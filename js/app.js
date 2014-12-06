Parse.initialize("D09HDt6HuQzXIeXzkPi5rTLfQ8KMPUBwrORQlbBo", "pmEX9dbQy1YmCb9nw7ekEOko2eSntIMbvr3LgZqV");

$(document).ready(function () {
    currentUser = Parse.User.current();
    if (currentUser == null) {
        $('#signUp').show();
        $('#logIn').show();
        $('#display').hide();
        $('#logout').hide();
    } else {
        $('#signUp').hide();
        $('#logIn').hide();
        $('#display').show();
        $('#logout').show();
        $('#userDisplay').text(currentUser.attributes.username);
        $('#display').click(function () {
            window.location = "account.html";
        });
    }

    $('#logout').click(function () {
        Parse.User.logOut();
        window.location = "index.html";
    });





    $('#submit').click(function () {
        var user = new Parse.User();
        user.set("username", $('#username').val());
        user.set("password", $("#password").val());
        user.set("email", $('#email').val());
        user.signUp(null, {
            success: function (user) {
                alert('You have successfully made an EcoCommuter account');
                Parse.User.logIn($('#username').val(), $("#password").val(), {
                    success: function (user) {
                        window.location = "account.html";
                        var currentUser = Parse.User.current();
                        $('#uName').text(currentUser.attributes.username);

                    }
                });
            }
        });
    });

    $("#loginsubmit").click(function () {
        Parse.User.logIn($('#loginusername').val(), $("#loginpassword").val(), {
            success: function (user) {
                window.location = "account.html";
                var currentUser = Parse.User.current();
                $('#uName').text(currentUser.attributes.username);
            },
            error: function (user, error) {
                alert('Wrong Password. Please Try Again')
            }
        })
    });


    $('body').scrollspy({target: '.navbar-custom'});


/*    function sendMail() {
        var link = "mailto:mkpc@uw.edu"
                + "&subject=" + escape("This is my subject")
                + "&body=" + escape(document.getElementById('message').value)
            ;
        window.location.href = link;
    }*/

    $('#sendMail').click(function() {
        var Contact = Parse.Object.extend("contactUs");
        var contact = new Contact();
        contact.set("Name", $('#contactname').val());
        contact.set("Email Address", $('#contactemail').val());
        contact.set("Message", $('#message').val());
        contact.save(null, {
            success: function () {
                alert('Your Message Has Been Saved')
            },
            error: function (emissionData, error) {
                console.log(error.message);
            }
        });
     });


    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh')
    });

    var map;
    var geocoder;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var addr1;
    var addr2;
    var mode;
    var distance;
    var value;
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    $("#calculate").click(function () {
        initialize();
        addr1 = $("#startaddress").val();
        addr2 = $("#endaddress").val();
        mode = $('input[name="options"]:checked').val();
        if (mode == undefined) {
            mode = "DRIVING";
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
        geocoder.geocode({address: addr1}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var coords = results[0].geometry.location;
                var marker = new google.maps.Marker({
                    position: coords,
                    map: map
                });
            }

        });
        geocoder.geocode({address: addr2}, function (results, status) {
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
        if (mode == "DRIVING" || mode == "CARPOOL") {
            travel = google.maps.TravelMode.DRIVING;
        } else if (mode == "BIKE") {
            travel = google.maps.TravelMode.BICYCLING;
        } else if (mode == "TRANSIT") {
            travel = google.maps.TravelMode.TRANSIT;
        } else {
            travel = google.maps.TravelMode.WALKING;
        }

        var request = {
            origin: addr1,
            destination: addr2,
            travelMode: travel
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

    function calculateDistances() {
        var travel;
        console.log(mode);
        if (mode == "DRIVING" || mode == "CARPOOL" || mode == "TRANSIT") {
            travel = google.maps.TravelMode.DRIVING;
        } else if (mode == "WALK") {
            travel = google.maps.TravelMode.WALKING;
        } else {
            travel = google.maps.TravelMode.BICYCLING;
        }

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
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
                    distance = results[j].distance.text;
                }
            }
        }
    }

    function calculateEmissions(distance) {
        var result = 0;
        if (mode == "DRIVING") {
            result = (0.96 * distance);
        } else if (mode == "TRANSIT") {
            result = (0.64 * distance);
        } else if (mode == "CARPOOL") {
            result = (0.96 * distance);
        } else {
            result = 0.0;
        }
        var total = (result / 1609.344);
        value = total.toFixed(2);
        var emissions = document.getElementById('emissions');
        emissions.innerHTML = "You released " + value + " pounds of carbon emissions into the environment!";

        var data = Parse.Object.extend("emissionData");
        var emissionData = new data();
        emissionData.set("StartAddress", $("#startaddress").val());
        emissionData.set("DestinationAddress", $("#endaddress").val());
        emissionData.set("DistancedTraveled", (Math.floor(distance * 0.0621371) / 100));

        emissionData.set("Emissions", value);
        emissionData.set("transportationMode", mode);
        emissionData.set("Username", currentUser.attributes.username);
        emissionData.save(null, {
            success: function () {
                console.log('it worked!');
            },
            error: function (emissionData, error) {
                console.log(error.message);
            }
        });
    }
});
$('#fullpage').fullpage({
    sectionsColor: ['#393939', '#393939', '#393939', '#393939', '#393939', '#393939'],
    slidesNavigation: true,
    slidesNavPosition: 'bottom',
    scrollingSpeed: 700,
    autoScrolling: true,
    resize: false

});
//full page
//$('#fullpage').fullpage({
//    //Navigation
//    //menu: '#menu',
//    //anchors:['1', '2','3','4'],
//    navigation: false,
//    navigationPosition: 'right',
//    //navigationTooltips: ['firstSlide', 'secondSlide'],

//
//    //Scrolling
//    css3: true,
//    scrollingSpeed: 700,
//    autoScrolling: true,
//    scrollBar: false,
//    easing: 'easeInQuart',
//    easingcss3: 'ease',
//    loopBottom: false,
//    loopTop: false,
//    loopHorizontal: true,
//    continuousVertical: false,
//    normalScrollElements: '#element1, .element2',
//    scrollOverflow: false,
//    touchSensitivity: 15,
//    normalScrollElementTouchThreshold: 5,
//
//    //Accessibility
//    keyboardScrolling: true,
//    animateAnchor: true,
//
//    //Design
//    verticalCentered: true,
//    resize : false,
//
//    sectionsColor : ['#393939', '#393939','#393939','#393939','#393939','#393939'],
//
//    paddingTop: '3em',
//    paddingBottom: '10em',
//    fixedElements: '#header, .footer',
//    responsive: 0,
//
//    //Custom selectors
//    sectionSelector: '.section',
//    slideSelector: '.slide',
//
//    //events
//    onLeave: function(index, nextIndex, direction){},
//    afterLoad: function(anchorLink, index){},
//    afterRender: function(){},
//    afterResize: function(){},
//    afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
//    onSlideLeave: function(anchorLink, index, slideIndex, direction){}
//});
