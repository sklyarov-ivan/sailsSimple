/**
 * SessionController
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
    
  
    new : function(req,res) {
        // var oldDate = new Date();
        // var newDate = new Date(oldDate.getTime()*60000);
        // req.session.cookie.expires = newDate;
        // req.session.authenticated = true;
        // console.log(req.session);
        res.view();
    },
    create: function(req,res,next){
        if (!req.param('email') || !req.param('password')) {
            req.session.flash = {
                err:[{name:'emailPasswordRequired'},{message:'email and password required'}]
            };
            return res.redirect('/session/new');
        }
        User.findOneByEmail(req.param('email')).done(function userFound(err,user){
            if (err) return next(err);
            if (!user) {
                req.session.flash = {
                    err:[{name:'noAccount',mesage:'wrong email or account dosn\'t exist'}]
                };
                return res.redirect('/session/new');
            }

            var bcrypt = require('bcrypt');
            bcrypt.compare(req.param('password'),user.cryptedPassword,function checked(err,valid){
                if (!valid){
                    req.session.flash = {
                        err: [{name:'wrongPassword'},{message:'wrong password'}]
                    };
                    return res.redirect('/session/new');
                }
                req.session.authenticated = true;
                req.session.user = user;

                user.online = true;
                user.save(function(err){
                    if (err) return next(err);

                    User.publishUpdate(user.id,{
                        loggedIn:true,
                        id:user.id
                    });


                    if (user.admin) {
                        return res.redirect('/user');
                    }
                    return res.redirect('/user/show/'+user.id);
                });
            });

        });
    },
    destroy: function(req,res,next) {
        var userid = req.session.user.id;
        User.update(userid,{online:false},function(err){
            if (err) return next(err);

            User.publishUpdate(userid,{
                loggedIn:false,
                id:userid
            });

            req.session.destroy();
            return res.redirect('/');
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}

  
};
