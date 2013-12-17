angular.module('longTermApp', [])
.controller('createNewReminder', function($scope, $http){
  $scope.createNewReminder = function(){
    $scope.reminder = {task: $scope.reminderName,
    interval: $scope.interval,
    duedate: null};

    $http({
      method: 'POST',
      url: '/reminders',
      data: $scope.reminder
    }).then(function(data){
      $scope.reminders = data;
      console.log($scope.reminders);
    })
  };
})
.controller('currentReminders', function($scope, $http){
  $http({
    method: 'GET',
    url: '/reminders'
  }).then(function(data){
    $scope.reminders = data.data;
    console.log($scope.reminders);
  })
})
.controller('upcomingReminders', function(){})
