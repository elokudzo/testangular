var testApp = angular.module('testApp',[]);


testApp.controller('testAppController',['$rootScope','$scope','$http','$timeout',function($rootScope,$scope,$http,$timeout){

$scope.apiKey = '5e46b996a591529197a7dd5b0ff1d1c3';

$scope.title = "My angular app";


$scope.destinations = [];

$scope.newDestination = {

	city : undefined,
	country : undefined
};

$scope.addDestination = function(){

$scope.destinations.push(
{
	city: $scope.newDestination.city,
	country : $scope.newDestination.country
}
	);
};

$scope.removeDestination = function(index){
	$scope.destinations.splice(index,1);
}




$rootScope.messageWatcher = $rootScope.$watch('message',function(){

if($rootScope.message){

	$timeout(function(){
		$rootScope.message = null;
	},3000);
}
});

}]);


testApp.filter("warmestDestinations",function(){

return function(destinations,minimumTemp){

var warmestDestinations = [];

angular.forEach(destinations,function(destination){

if(destination.weather && destination.weather.temp && destination.weather.temp >= minimumTemp){
	warmestDestinations.push(destination);
}
});

return warmestDestinations;
}
});



testApp.directive('destinationDirective',function(){

	return {

		
		scope:{
			destination: '=',
			apiKey: '=',
			onRemove: '&'
		},

		template:

'<span>{{destination.city}},{{destination.country}}</span>'+
'<span ng-if="destination.weather"> - {{destination.weather.main}}, {{destination.weather.temp}}</span>'+
'<button ng-click="onRemove()">Remove</button>' + 
'<button ng-click="getWeather(destination)">Update weather</button>',

controller: function($http,$rootScope,$scope){


	$scope.getWeather = function(destination){

$http.get("http://api.openweathermap.org/data/2.5/weather?q="  + destination.city + "&appid=" + $scope.apiKey)
.then(

function successCallback(response){

if(response.data.weather){

	destination.weather = {};
	destination.weather.main = response.data.weather[0].main;
	destination.weather.temp = $scope.convertToCelcius(response.data.main.temp);

}
else{
	$rootScope.message = "City not found";
}
},
function errorCallback(error){
	$rootScope.message = "Server error";
}

	);
};


$scope.convertToCelcius = function(temp){

	return Math.round(temp-273);
};

}

	}
})