/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
  new : function(req,res){
    res.view();
  },
  create: function(req,res,next){
    User.create(req.params.all(),function userCreated(err, user){
      if(err) {
        req.session.flash = {
          err:err
        };
        return res.redirect('/user/new');
      }

      // res.json(user);
      // res.session.flash = {};
      req.session.authenticated = true;
      req.session.user = user;
      user.online = true;
      user.save(function(err){
        if (err) return next(err);
        return res.redirect('/user/show/'+user.id);
      });
    });
  },
  show: function(req,res,next){
    User.findOne(req.param('id'), function foundUser(err,user){
      if (err) return next(err);
      if (!user) return next('User dosn\'t exist');
      res.view({
        user:user
      });
    });
  },
  edit: function(req,res,next){
    User.findOne(req.param('id'), function userFound(err,user){
      if (err) return next(err);
      if (!user) return next('User dosn\'t exist');
      res.view({
        user:user
      });
    });
  },
  update: function(req,res,next){
    if (req.session.user && req.session.user.id) {
      userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        password: req.param('password'),
        pass_confirmation: req.param('pass_confirmation'),
        admin: req.param('admin')
      };
    } else {
      userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        password: req.param('password'),
        pass_confirmation: req.param('pass_confirmation')
      };
    }
    User.update(req.param('id'),req.params.all(),function userUpdated(err){
      if (err){
        return res.redirect('/user/edit/'+req.param('id'));
      }
      res.redirect('/user/show/'+req.param('id'));
    });
  },
  destroy: function(req,res,next){
    User.findOne(req.param('id'), function userFound(err,user){
      if (err) return next(err);
      if (!user) return next('User dosn\'t exist');

      User.destroy(req.param('id'),function userDestroyed(err){
        if (err) return next(err);
        return res.redirect('/user');
      });
    });
  },
  index: function(req,res,next){
    User.find(function usersFound(err,users){
      if (err) return next(err);
      res.view({
        users:users
      });
    });
  },
  subscribe: function(req,res,next){
    User.find(function getUsers(err,user){
      if (err) next(err);

      User.subscribe(req.socket);

      User.subscribe(req.socket,user);
    })
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
