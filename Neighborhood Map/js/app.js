  var locations = [
{
    locationname: 'Town Hall',
    lat: 30.467288,
    lng:30.933914,
    selection: false,
    show: true,
    wikiID:'Liverpool_Town_Hall',
    
    
},

{
    
    locationname: 'General Hospital',
    lat: 30.472071,
    lng:30.927372,
    selection: false,
    show: true,
    wikiID:'Atutur_General_Hospital',
    
    
},

{
    locationname: 'Banque Misr',
    lat: 30.463944,
    lng:30.936163,
    selection: false,
    show: true,
    wikiID:'Banque_Misr',
},
{
    
    locationname: 'Cemetery',
    lat: 30.465811,
    lng:30.941416,
    selection: false,
    show: true,
    wikiID:'City_of_the_Dead_(Cairo)',
    
},

{
    locationname: 'Chruch',
    lat: 30.462833,
    lng: 30.929162,
    selection: false,
    show: true,
    wikiID:'Church_(building)',
    
    
}
];

var viewModel = function() {
    
    var self = this;
    self.location_input = ko.observable('');
    self.selectlocation = ko.observableArray([]);
    self.error=ko.observable('');
    self.visibleLocation = ko.observable(false);
    
    
    
    
    locations.forEach(function(item){
        
        var marker = new google.maps.Marker({
            locationname:item.locationname,
            position: {lat:item.lat, lng:item.lng},
            show: ko.observable(item.show),
            wikiID:item.wikiID,
            animation: google.maps.Animation.DROP,
            map: map
            
        });
        
        
        
        
        
        self.selectlocation.push(marker);
        
        marker.addListener('click', function(){
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1500);
                infowindow.close();
                self.populateInfoWindow(this, largeInfowindow);
                
                
            }
        });
        
        
        
        var largeInfowindow = new google.maps.InfoWindow();
        
        self.clickEventHandlerFunction = function(marker){
            if(marker.locationname){
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1500);
                infowindow.close();
                self.populateInfoWindow(this, largeInfowindow);
                
            }
        };
        
        
    });
    
    
    self.populateInfoWindow = function(marker, infowindow) {
        
        
        if (infowindow.marker != marker) {
            
            infowindow.marker = marker;
            //infowindow.setContent('<h2>' + marker.locationname + '</h2>');
            var wikiSource = 'https://en.wikipedia.org/wiki/' + marker.wikiID;
            
            var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + marker.wikiID;
            
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                data: {},
                url: wikiURL
            }).done(function(response) {
                console.log(marker);
                
                var extract = response.query.pages[Object.keys(response.query.pages)[0]].extract;
                infowindow.setContent('<div>' + '<h4>' + marker.locationname + '</h4>' + extract +'<br>(Source: ' + '<a href=' + wikiSource + '>Wikipedia)</a>' +'</div>');
                
                //Set Content if failure of AJAX request
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                infowindow.setContent('<div>' + 'No Service/ Connection Detected (Please try again later)' + '</div>');
            });
            
            infowindow.open(map, marker);
            
            infowindow.addListener('closeclick', function() {
                infowindow.close();
                if(infowindow.marker !== null)
                infowindow.marker.setAnimation(null);
                infowindow.marker = null;
            });
            
        }
        
    };
    
    
    self.clickMe = function(){
        self.visibleLocation(!this.visibleLocation());
    };



    
    
    self.alllocation=function(){
        for (var y = 0; y < self.selectlocation().length; y ++) {
            
            self.selectlocation()[y].setVisible(true);
            self.selectlocation()[y].show(true);
        }
        
    };
    self.filteredlocation=function(input){
        for (var x = 0; x < self.selectlocation().length; x ++) {
            if (self.selectlocation()[x].locationname.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                self.selectlocation()[x].show(true);
                self.selectlocation()[x].setVisible(true);
            }
            else {
                self.selectlocation()[x].show(false);
                self.selectlocation()[x].setVisible(false);
                
            }
        }
    };




    
    self.search = function(search) {
        
        var input=self.location_input();
        infowindow.close();
        
        if(input.length === 0) {
            self.alllocation();
        }
        
        else {
            self.filteredlocation(input);
        }
        infowindow.close();
    };
    
};

var map;
var infoWindow;

function initMap() {
    
    map = new google.maps.Map(
    document.getElementById('map'),{
        center: {lat:30.465928, lng:30.930580},
        zoom:15
        
    });
    
    
    infowindow = new google.maps.InfoWindow();
    ko.applyBindings(new viewModel());
}

function HandleError(){
    alert('Invalid Map');
}

