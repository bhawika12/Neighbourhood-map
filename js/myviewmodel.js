var Location = function(data){
        this.title = data.title;
        this.line = data.line;
        this.marker = data.marker;
        this.isVisible = ko.observable(true);
    };

var ViewModel = function() {
    var self = this;

    self.locationList = ko.observableArray([]);

    places.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    self.locationOptions = ['all', 'religious', 'beach', 'national park', 'mountain'];

    self.selectedLocation = ko.observable(self.locationOptions[0]);

    self.filterItems = ko.computed(function() {
        var listItem = self.locationList();
        var selectedLocation = self.selectedLocation();
        for(var i=0; i<listItem.length; i++) {
            if(selectedLocation === self.locationOptions[0]) {
                listItem[i].isVisible(true);
                if(marker) {
                    listItem[i].marker.setVisible(true);
                }
            } else if (selectedLocation !== listItem[i].line) {
                listItem[i].isVisible(false);
                listItem[i].marker.setVisible(false);
            } else {
                listItem[i].isVisible(true);
                listItem[i].marker.setVisible(true);
            }
        }
    });

    self.openWindow = function(place) {
        google.maps.event.trigger(place.marker, 'click');
    };
    //Close View Model
};

var vm = new ViewModel();
