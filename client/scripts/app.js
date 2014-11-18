var app = {
  init: function(){
    $(document).ready(function(){
      app.fetch();
      $('#sendButton').on('click', function() {
        var message = app.getMessage();
        app.send(message);
        app.fetch();
      });
    //  $('.requestMsg').on('click', app.fetch);
      $('.refreshButton, .requestMsg').on('click', function() {
        app.clearMessages();
        app.fetch();
      });
      setInterval(function() {
        $('#chats').html('');
        app.fetch();
      }, 30000);
    });
  },
  server: 'http://127.0.0.1:1337/classes',
  fetch : function() {
    $.ajax({
      // always use this url
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
  //    data: 'order=-createdAt',
      success: function (data) {
        var arr = data.results;
        var storage = {};

        app.clearMessages();
        $('#roomSelect').html('');
        for(var i = 0; i < arr.length; i++){
          app.addMessage(arr[i]);
          storage[arr[i].roomname] = arr[i].roomname;
        }
        //adding chat rooms
        for (x in storage) {
          app.addRoom(storage[x]);
        }

       $('.username').on('click', function() {
          var boldName = $(this).text();
          $('.'+boldName).toggleClass('bold');
        });


        $('.rooms').on('click', function(){
          app.clearMessages();
          var targetRoom = $(this).text();
          for (var i = 0; i < arr.length; i++) {
            if(arr[i].roomname === targetRoom){
              app.addMessage(arr[i]);
            }
          };

        });
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      },
      complete:function(){
        console.log('complete');
      }
    });
  },
  send : function(message){
    $.ajax({
      // always use this url
      url: 'http://127.0.0.1:1337/classes',
      type: 'POST',
      data: message,
      contentType: 'application/json',

      success : function (data) {
        $('#chats').html(JSON.stringify(data));
        console.log('success!!!');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      },
      complete:function(){
        console.log('send complete');
      }
    });
  },
  clearMessages : function() {
    $('#chats').html('');

  },
  addMessage : function(message) {
    var chat = "";
    for(var prop in message){
      if(message[prop] === null){
        message[prop] = '';
      }else{
        message[prop] =  message[prop].replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
    }
    chat += "<span class='username "+ message.username +"'>" + message.username + "</span> says: " + message.text
              + "<span class='room-in-post'>"+ message.roomname+"</span>";
    $('#chats').append('<div class="message">'+chat+'</div>');

  },
  addRoom : function(roomname){
    $('#roomSelect').append('<div class="rooms">'+roomname+'</div>');
  },
  // addFriend : function(username) {
  //   console.log('toggleClass');
  //   username.toggleClass('bold');
  // },
  getMessage : function() {
    var message = document.getElementById('inputMessage').value;
    var obj = {'username': 'Silvia',
              'text' : message,
              'roomname' : $('#createRoom').val()
              };
    return JSON.stringify(obj);
  }
};
app.init();
