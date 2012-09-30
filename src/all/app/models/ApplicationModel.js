module.exports = function (app, config) {
  return app.getModel('Base', true).extend(function () {
    this.mongoose = require('mongoose');
    this.Schema = this.mongoose.Schema;
    this.db = this.mongoose.createConnection('mongodb://localhost:27017/' + config.dbname);
  });
};