angular.module('longTermApp', [])
.controller('createNewReminder', function($scope){
  $scope.createNewReminder = function(){
    $scope.reminder = {reminderName: $scope.reminderName,
    interval: $scope.interval};
  };
  
  
})
.controller('currentReminders', function(){})
.controller('upcomingReminders', function(){})
