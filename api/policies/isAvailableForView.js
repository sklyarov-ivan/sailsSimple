module.exports = function(req, res, next) {

  var isAdmin = req.session.authenticated && req.session.user && req.session.user.admin;
  var isOwner = req.session.authenticated && req.session.user && (req.session.user.id = req.param('id'));

  if (isAdmin || isOwner) {
    return next();
  }
  else {
    req.session.flash = {
        err: [{name:'permissionDenied'},{'message':'permission denied'}]
    };
    return res.redirect('/session/new');
  }
};
