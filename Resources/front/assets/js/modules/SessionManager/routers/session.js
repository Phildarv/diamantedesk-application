define(['app'], function(App){

  return App.module('SessionManager', function(SessionManager, App, Backbone, Marionette, $, _){

    SessionManager.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login" : "login",
        "logout" : "logout"
      }
    });

    var API = {
      login: function(){
        require(['modules/SessionManager/controllers/login'], function(){
          SessionManager.LoginController();
        });
      },
      logout: function(){
        App.session.logout();
      }
    };

    App.on('session:login', function(){
      App.navigate("login");
      API.login();
    });

    App.on('session:logout', function(){
      App.navigate("logout");
      API.logout();
    });

    App.addInitializer(function(){
      new SessionManager.Router({
        controller: API
      });
    });

  });

});