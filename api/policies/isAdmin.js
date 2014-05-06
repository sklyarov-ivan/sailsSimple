module.exports = function(req, res, next) {

  if (req.session.user && req.session.user.admin) {
    return next();
  }

  else {
    req.session.flash = {
        err: [{name:'notEnoughPermission'},{'message':'user dosn\'t have enough permission'}]
    };
    return res.redirect('/session/new');
  }
};
