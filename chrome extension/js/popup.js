var renderReminders = function(){
  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:8080/reminders'
  }).done(function(data){
    data = JSON.parse(data);
    var now = new Date();
    now = Date.parse(now.toISOString());
    for (var i = 0; i < data.length; i++) {
      var then = Date.parse(data[i].duedate);
      if (then < now) {
        $('.reminders').append('<div>' + data[i].task + '</div>');
      }
    }
  })
};

document.addEventListener('DOMContentLoaded', function () {
  renderReminders();
  $('button').on('click', function(e){
    e.preventDefault();
    var toSend = {};
    var now = new Date();
    var interval = $('.number').val() * 60000;
    var date = new Date(now.getTime() + interval);
    toSend.task = $('.task').val();
    toSend.interval = interval;
    toSend.duedate = date.toISOString();
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:8080/reminders',
      data: JSON.stringify(toSend)
    })
  })
});


