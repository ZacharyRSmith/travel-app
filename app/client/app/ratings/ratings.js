angular.module('travel.ratings', [])

.controller('RatingsController', function ($scope, $window, $rootScope, $state, CurrentInfo, Venues, City, Groups, Util) {
  var destination = $rootScope.destinationPermalink || CurrentInfo.destination.name;
  $scope.filteredUserRatings = [];
  $scope.filteredGroupRatings  = [];
  $scope.city = null;
  $scope.heading = null;
  $scope.ratings = [];
  $scope.groups = [];


  ////////////////// GET ALL THE GROUPS OF A USER //////////////////////


  $scope.getUserGroups = function() {
    var query = {
      userInfo: $rootScope.currentUser
    };
    Groups.getUserGroups(query)
      .then(function(groupsInfo){
        $scope.groups = groupsInfo;
      });
  };
  // $scope.getUserGroups();


  ////////////////// SELECTING A GROUP WILL REROUTE TO RESULTS PAGE //////////////////////


  $scope.selectGroup = function(groupInfo) {
    Groups.selectGroup(groupInfo, $rootScope);
    $rootScope.destinationPermalink = groupInfo.destination;
    $state.go('favorites');
  };


  ////////////////// FILTER FOR RESTAURANTS/ATTRACTIONS/HOTELS //////////////////////

  //FIXME: need updated data response object
  $scope.filterRatings = function (filterType) {
    var groupRatings = [];
    var userRatings = [];

    // set heading to appropriate value
    if (filterType === 1) {
      $scope.heading = 'Hotels';
    } else if (filterType === 2) {
      $scope.heading = 'Restaurants';
    } else if (filterType === 3) {
      $scope.heading = 'Attractions';
    }

    // populate venues with appropriate results
    // not working with groups removed this code...
    // if (favorite.userInfo === $rootScope.currentUser) {
    //   console.log(favorite.venue);
    // } else {
    //   GroupRatings.push(favorite);
    // }

    $scope.ratings.forEach(function(venue) {
      if (venue.venue_type_id === filterType) {
        groupRatings.push(rating.venue);
      }
    });
    $scope.filteredGroupRatings = groupRatings;
    $scope.filteredUserRatings  = userRatings;
  };


  ////////////////// GET ALL RATINGS OF THE GROUP //////////////////////

  //FIXME: need updated data response object
  $scope.getRatings = function() {
    var userId = $rootScope.currentUser._id;
    var groupId = $rootScope.currentGroup._id;
    var query = {
      userId : userId,
      groupId : groupId
    };
    Venues.getRatings(query)
      .then(function(venuesInfo){
        $scope.ratings = venuesInfo;
        $scope.filterRatings(1);
      });
  };

  // $scope.fetchUserFavorites = function () {
  //   var userId = $rootScope.currentUser._id;
  //   Venues.getUserFavorites(userId)
  //   .then(function(favorites) {
  //     $scope.ratings = favorites;
  //     console.log('favorites', $scope.ratings);
  //     $scope.filterRatings(1);
  //   });
  // };

  $scope.getRatings();

  ////////////////// GET BASIC DESTINATION CITY INFO //////////////////////


  $scope.getCity = function () {
    City.getCity(destination)
      .then(function(cityInfo) {
        $scope.city = cityInfo;
        CurrentInfo.destination.basicInfo = cityInfo;
    })
      .catch(function(error){
        console.error(error);
      });
  };
  $scope.getCity();

  ////////////////// USER ADD RATING //////////////////////


  $scope.addRating = function(venueData, rating) {
    var data = {
      venue : venueData,
      userId : $rootScope.currentUser._id,
      groupId : $rootScope.currentGroup._id,
      rating : rating
    };
    Venues.addRating(data);j
  };


  ////////////////// ADMIN ONLY //////////////////////


  $scope.addtoItinerary = function(venueData) {
    var data = {
      venue : venueData,
      userId : $rootScope.currentUser._id,
      groupId : $rootScope.currentGroup._id
    };
    Venues.addtoItinerary(data);
  };
})


////////////////// DYNAMIC STAR RATING //////////////////////


.directive('starRating', function () {
  var restrict = 'A';
  var template = '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>';
  var scope = {
    ratingValue: '=',
    max: '=',
    onRatingSelected: '&'
  };
  var link = function (scope, elem, attrs) {
    var updateStars = function () {
      scope.stars = [];
      for (var i = 0; i < scope.max; i++) {
        scope.stars.push({
          filled: i < scope.ratingValue
        });
      }
    };
    scope.toggle = function (index) {
      scope.ratingValue = index + 1;
      scope.onRatingSelected({
        rating: index + 1
      });
    };
    scope.$watch('ratingValue', function (oldVal, newVal) {
      if (newVal) {
        updateStars();
      }
    });
  };
  return {
    restrict: restrict,
    template: template,
    scope: scope,
    link: link
  };
});
