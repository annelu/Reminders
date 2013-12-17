angular.module('longTermApp', [])
.controller('createNewReminder', function($scope, $http){
  $scope.createNewReminder = function(){
    var now = new Date();
    var date = new Date(now.getTime() + $scope.interval * $scope.time);
    $scope.reminder = {task: $scope.reminderName,
    interval: $scope.interval * $scope.time,
    duedate: date.toISOString()
    };

    $http({
      method: 'POST',
      url: '/reminders',
      data: $scope.reminder
    }).then(function(data){
      $scope.reminders = data;
    })

    delete $scope.reminderName;
    delete $scope.interval;
  };
})
.controller('currentReminders', function($scope, $http){
  var now = new Date();
  now = Date.parse(now.toISOString());
  var updatePage = function(){
    $http({
      method: 'GET',
      url: '/reminders'
    }).then(function(data){
      $scope.reminders = data.data;
    });
  };

  $scope.beforePresent = function(reminder){
    var otherdate = Date.parse(reminder.duedate);
    if (otherdate < now) {
      return reminder;
    }
  }
  $scope.afterPresent = function(reminder){
    var otherdate = Date.parse(reminder.duedate);
    if (otherdate > now) {
      return reminder;
    }
  }
  $scope.cancel = function(id){
    //delete entry
    $http({
      method: 'POST',
      url: '/cancel',
      data: id
    }).then(function(data) {
      $scope.reminders = data.data;
    })
  };
  $scope.done = function(id, interval){
    //change entry duedate +interval into the future
    var now = new Date();
    var date = new Date(now.getTime() + interval);
    var newduedate = date.toISOString();
    var body = {};
    body.id = id;
    body.duedate = newduedate;
    $http({
      method: 'POST',
      url: '/done',
      data: body
    }).then(function(data){
      $scope.reminders = data.data;
    })
  };
  updatePage();
  setInterval(updatePage, 1000);

})