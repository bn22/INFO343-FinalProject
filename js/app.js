/**
 * Created by marcocheng on 11/26/14.
 */
$(document).ready(function() {

    $('body').scrollspy({ target: '.navbar-custom' })

    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh')
    })


    $('#fullpage').fullpage({
    });
        var mapElem = document.getElementById('map');


    function createMap(elem, center, zoom){
        var map =new google.maps.Map(elem,{
            center: center,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });
        var marker = new google.maps.Marker({
            position: center,
            map: map,
            animation : google.maps.Animation.DROP
        });

        var infoWindow = new  google.maps.InfoWindow();
        infoWindow.setContent("<h2>Here I am!</h2><p>Don't you wish you were here.</p>")

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.open(map, marker);
        });

    }

    var center ={
        lat:47.655,
        lng: -122.3080
    };

 createMap(mapElem, center, 14);
});

//
//$(document).ready(function() {
//    $('#fullpage').fullpage({
//        //Navigation
//        menu: false,
//        anchors:['firstSlide', 'secondSlide'],
//        navigation: false,
//        navigationPosition: 'right',
//        navigationTooltips: ['firstSlide', 'secondSlide'],
//        slidesNavigation: true,
//        slidesNavPosition: 'bottom',
//
//        //Scrolling
//        css3: true,
//        scrollingSpeed: 700,
//        autoScrolling: true,
//        scrollBar: false,
//        easing: 'easeInQuart',
//        easingcss3: 'ease',
//        loopBottom: false,
//        loopTop: false,
//        loopHorizontal: true,
//        continuousVertical: false,
//        normalScrollElements: '#element1, .element2',
//        scrollOverflow: false,
//        touchSensitivity: 15,
//        normalScrollElementTouchThreshold: 5,
//
//        //Accessibility
//        keyboardScrolling: true,
//        animateAnchor: true,
//
//        //Design
//        verticalCentered: true,
//        resize : true,
//        //sectionsColor : ['#ccc', '#fff'],
//        paddingTop: '3em',
//        paddingBottom: '10px',
//        fixedElements: '#header, .footer',
//        responsive: 0,
//
//        //Custom selectors
//        sectionSelector: '.section',
//        slideSelector: '.slide',
//
//        //events
//        onLeave: function(index, nextIndex, direction){},
//        afterLoad: function(anchorLink, index){},
//        afterRender: function(){},
//        afterResize: function(){},
//        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
//        onSlideLeave: function(anchorLink, index, slideIndex, direction){}
//    });
//});