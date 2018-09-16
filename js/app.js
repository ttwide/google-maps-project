// the original to this is in final Project app3.js


var initialLocations = [
  {title: 'Pestle Rock',location: {lat: 47.668505, lng: -122.386498}, yelpId: '3jYycHbe2BHzTzh8KZK_tg', infowindowcontent: ""},
  {title: 'No Bones Beach Club', location: { lat: 47.668328, lng: -122.378718}, yelpId: 's9alani4rCYMXMWTI5xS7w'},
  {title: 'D\'Ambrosio Gelato', location: { lat: 47.667195, lng: -122.384326}, yelpId: 'qM0ZfTB-ZaHTJ58wMMt5Sw'},
  {title: 'The Hi-life', location: { lat: 47.668376, lng: -122.383034 }, yelpId: 'O7e1J6VZUK0DrPXGRwNZyA'},
  {title: 'La Isla Cuisine', location: { lat: 47.668938, lng: -122.387215}, yelpId: 'heIRbeGgquFtkGX1XFyMBA', infowindowcontent: ""},
  {title: 'Stoneburner', location: { lat: 47.666245, lng: -122.382524}, yelpId: '0HGzdQ2HjA95IFQPQXb1vg', infowindowcontent: ""},
  {title: 'Bastille Cafe & Bar', location: { lat: 47.666437, lng: -122.383666}, yelpId: '4ta8miJkO0e6Qa9rGnC0iQ', infowindowcontent: ""}
];

// same data as initial locations split for yelp api calls
var initialLocations1 = [
  {title: 'Pestle Rock',location: {lat: 47.668505, lng: -122.386498}, yelpId: '3jYycHbe2BHzTzh8KZK_tg', infowindowcontent: ""},
  {title: 'No Bones Beach Club', location: { lat: 47.668328, lng: -122.378718}, yelpId: 's9alani4rCYMXMWTI5xS7w'},
  {title: 'D\'Ambrosio Gelato', location: { lat: 47.667195, lng: -122.384326}, yelpId: 'qM0ZfTB-ZaHTJ58wMMt5Sw'},
  {title: 'The Hi-life', location: { lat: 47.668376, lng: -122.383034 }, yelpId: 'O7e1J6VZUK0DrPXGRwNZyA'},
  {title: 'La Isla Cuisine', location: { lat: 47.668938, lng: -122.387215}, yelpId: 'heIRbeGgquFtkGX1XFyMBA', infowindowcontent: ""}
];

var initialLocations2 = [
  {title: 'Stoneburner', location: { lat: 47.666245, lng: -122.382524}, yelpId: '0HGzdQ2HjA95IFQPQXb1vg', infowindowcontent: ""},
  {title: 'Bastille Cafe & Bar', location: { lat: 47.666437, lng: -122.383666}, yelpId: '4ta8miJkO0e6Qa9rGnC0iQ', infowindowcontent: ""}
];


var ViewModel = function () {
  var self = this;

  // init map is called by the callback function, makes map
  this.initMap = function() {
    //marker and infowindow will be used further down
    var map, marker;
    var largeInfoWindow = new google.maps.InfoWindow();
    // use for extending the bounds if the marker is outside the initial zoom area
    var bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.668674, lng: -122.379626},
      zoom: 16
  });

  // create an empty observableArray to store the markers once created
  this.allMarkers = ko.observableArray([]);

  initialLocations.forEach(function(loc){
    marker = new google.maps.Marker({
        position: loc.location,
        map: map,
        title: loc.title,
        customInfo: loc.infowindowcontent
  });
  this.allMarkers.push(marker);

}); // end of forEach

  allMarkers().forEach(function(mk){
      mk.addListener('click', function() {
        //console.log(mk.title);
        self.populateInfoWindow(this, largeInfoWindow);
      });
  });

  this.populateInfoWindow = function(marker, infowindow){
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent(marker.infowindowcontent);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      }); // end of closeclick
    } // end of if statment
  } // end of populateInfoWindow

  this.runAjax = function(businessId){
    // cors anywhere herokuapp takes care of cross origin domain requests
    var yelpUrl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/";
    var token = "Bearer YOUR_YELP_API_KEY";
    $.ajax({
      url: yelpUrl + businessId,
      headers: { 'Authorization': token },
      success: handleYelpData
    });
    function handleYelpData(data){
      // iterate through all the markers
      for (let i = 0; i < self.allMarkers().length; i++){
        // if the name on the ajax call matches the marker title set that infowindow content to the matching content
        if (data.name == self.allMarkers()[i].title ) {
          // set the rating picture to the correct img source before setting the infowindow content
          var src = "img/small/loading.png";
          switch (data.rating) {
            case 0:
              src = "img/small/small_0.png";
              break;
            case 1:
              src = "img/small/small_1.png";
              break;
            case 1.5:
              src = "img/small/small_1_half.png";
              break;
            case 2:
              src = "img/small/small_2.png";
              break;
            case 2.5:
              src = "img/small/small_2_half.png";
              break;
            case 3:
              src = "img/small/small_3.png";
              break;
            case 3.5:
              src = "img/small/small_3_half.png";
              break;
            case 4:
              src = "img/small/small_4.png";
              break;
            case 4.5:
              src = "img/small/small_4_half.png";
              break;
            case 5:
              src = "img/small/small_5.png";
              break;
            default:
              src = "img/small/loading.png";
              break;
          }


          var contentString = '<a href="' + data.url + '" target="_blank">'+data.name+'</a>' +  '<div>Price: '+data.price+'</div>' + '<img class="stars" id="rating" src="' + src +'"">' + '<div>' + data.review_count + ' reviews<div>' +
                              '<img class="display-pic" src="'+data.image_url+'"><br>' + '<img src="img/yelp_logo.png">';
          self.allMarkers()[i].infowindowcontent = contentString;

        } // end of if
      } // end of for
    } //end of handleYelpData
  } // end of runAjax


/*

  // yelp only allows 5 api calls so split do 5 here
  initialLocations1.forEach(function(loc){
    self.runAjax(loc.yelpId);
  }); //end of forEach

  // wait 2 seconds and do 2 more here
  setTimeout(function() {
  initialLocations2.forEach(function(loc){
    self.runAjax(loc.yelpId);
  }); //end of forEach
}, 2000);

*/

} // end of initMap

} // end of ViewModel


ko.applyBindings(ViewModel);
