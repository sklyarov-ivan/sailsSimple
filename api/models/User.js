/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  schema: true,
  attributes: {
    name: {
      type:'string',
      required: true
    },
    title: {
      type:'string'
    },
    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    cryptedPassword: {
      type:'string'
    }
  },
  beforeCreate: function(values,next){
    if (!values.password || values.password != values.pass_confirmation){
      return next({err:'wrong password or confirmation password dosn\'t match password'});
    }
    var bcrypt = require('bcrypt');
    values.cryptedPassword = bcrypt.hash(values.password,10,function bcryptedPassword(err,cryptedPass){
      if (err) return next(err);
      values.cryptedPassword = cryptedPass;
      next();
    });
  }


};
