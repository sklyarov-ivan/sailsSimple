/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', messageReceivedFromServer);

    socket.get('/user/subscribe');
    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

    function messageReceivedFromServer(message) {

      ///////////////////////////////////////////////////////////
      // Replace the following with your own custom logic
      // to run when a new message arrives from the Sails.js
      // server.
      ///////////////////////////////////////////////////////////
      log('New comet message received :: ', message);
      //////////////////////////////////////////////////////
      if (message.model === 'user') {
        var userId = message.id;
        updateUserInDom(userId,message);
      }
    }

    function updateUserInDom(userId, message) {
        var page = document.location.pathname;
        page = page.replace(/(\/)$/,'');
        switch (page) {
          case '/user':
            if (message.verb === 'update'){
              UserIndexPage.updateUser(userId,message);
            }
            if (message.verb === 'create'){
              UserIndexPage.createUser(userId,message);
            }
            if (message.verb === 'destroy'){
              UserIndexPage.deleteUser(userId,message);
            }
            break;
        }
    }


    var UserIndexPage = {
      updateUser: function(userId,message) {
        if (message.data.loggedIn) {
          $('tr[data-id='+userId+'] td').first().html('<i class="glyphicon glyphicon-plus-sign green"></i>');
        } else {
          $('tr[data-id='+userId+'] td').first().html('<i class="glyphicon glyphicon-minus-sign red"></i>');
        }
      },
      createUser: function(userId,message){
        var obj = {
            user : message.data,
            _csrf : window.overlord.csrf
        }
        $('td:last').after(
            JST('assets/linker/templates/addUser.ejs')(obj)
          );
      },
      deleteUser: function(userId,message){
          $('tr[data-id='+userId+'] td').remove();

      }
    };


})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io


);
