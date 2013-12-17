angular.module('longTermApp', [])
.controller('createNewReminder', function($scope, $http){
  $scope.createNewReminder = function(){
    var now = new Date();
    var date = new Date(now.getTime() + $scope.interval * 60000);
    $scope.reminder = {task: $scope.reminderName,
    interval: $scope.interval,
    duedate: date.toISOString()
    };

    $http({
      method: 'POST',
      url: '/reminders',
      data: $scope.reminder
    }).then(function(data){
      $scope.reminders = data;
    })
  };
})
.controller('currentReminders', function($scope, $http){
  $http({
    method: 'GET',
    url: '/reminders'
  }).then(function(data){
    $scope.currentReminders = [];
    var now = new Date();
    now = Date.parse(now.toISOString());
    $scope.now = now;
    $scope.upcomingReminders = [];

    for (var i = 0; i < data.data.length; i++) {
      if (Date.parse(data.data[i].duedate) < now) {
        $scope.currentReminders.push(data.data[i]);
      } else {
        $scope.upcomingReminders.push(data.data[i]);
      }
    }
  });
  $scope.cancel = function(){
    //delete entry
  };
  $scope.done = function(id){
    console.log(id);
    //change duedate of entry to be currentime + interval
  };



})