describe('Test angular suite',function(){

beforeEach(module('testApp'));
describe('testing angular controller',function(){

var scope,ctrl, httpBackend,timeout;
beforeEach(inject(function($controller,$rootScope,$httpBackend,$timeout){
	scope = $rootScope.$new();
httpBackend = $httpBackend;
			ctrl = $controller('testAppController',{$scope:scope});
			timeout = $timeout;

		}));

afterEach(function(){

httpBackend.verifyNoOutstandingExpectation();
httpBackend.verifyNoOutstandingRequest();
});

	it('should initialize the title in the scope',function(){


		expect(scope.title).toBeDefined();
		expect(scope.title).toBe('My angular app');

	});

	it('should add 2 destinations to the destination list',function(){

		expect(scope.destinations).toBeDefined();
		expect(scope.destinations.length).toBe(0);

		scope.newDestination = {
			city: "London",
			country : "England"
		};

		scope.addDestination();


		expect(scope.destinations.length).toBe(1);
		expect(scope.destinations[0].city).toBe("London");
		expect(scope.destinations[0].country).toBe("England");

scope.newDestination.city = "Lome";
scope.newDestination.country = "Togo";


scope.addDestination();

		expect(scope.destinations.length).toBe(2);
		expect(scope.destinations[1].city).toBe("Lome");
		expect(scope.destinations[1].country).toBe("Togo");





	});


it('should remove a destination from the destinations list',function(){

scope.destinations = [{
	city: "lome",
	country: "togo"
},
{
	city : "accra",
	country : "ghana"
}

];

expect(scope.destinations.length).toBe(2);

scope.removeDestination(0);

expect(scope.destinations.length).toBe(1);

expect(scope.destinations[0].city).toBe("accra");
expect(scope.destinations[0].country).toBe("ghana");


});


it('should update the weather for a specific destination',function(){

scope.destination = {
	city: "Melbourne",
	country: "Australia"
};

httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="  + scope.destination.city + "&appid=" + scope.apiKey).respond({
weather:[{main: 'Rain',detail: 'Light rain'}],
main:{temp: 288}

});

scope.getWeather(scope.destination);

httpBackend.flush();

expect(scope.destination.weather.main).toBe("Rain");
expect(scope.destination.weather.temp).toBe(15);
});



it('should remove error message after a fixed period of time',function(){

scope.message = "error";

expect(scope.message).toBe("error");


scope.$apply();
timeout.flush();

expect(scope.message).toBeNull();

});




});


describe('Testing angular filter',function(){


it('should return only warm destinations',inject(function($filter){

var warmest = $filter('warmestDestinations');

var destinations = [

{
	city: "Beijing",
	country : "China",
	weather : {
		temp: 21
	}
},

{

	city : "Moscow",
	country : "Russia"
},

{
	city: "Mexico City",
	country : "Mexico",
	
	weather : {
		temp: 12
	}
},

{
	city: "Lima",
	country:"Peru",
	
	weather : {
		temp: 15
	}
}
];

expect(destinations.length).toBe(4);
var warmestDestinations = warmest(destinations,15);

expect(warmestDestinations.length).toBe(2);

expect(warmestDestinations[0].city).toBe('Beijing');

}))
});


});