'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var connections = require('./connections');
var models = require('./models');
var cfg = require('config-keys');
var gridfs = require('gridfs-stream');

/**
 * Main class.
 *
 * @api public
 */

module.exports = {

  /*
   * Mongoose ODM module.
   */

  mongoose: mongoose,

  /**
   * Mongoose data types.
   */

  types: mongoose.Types,

  /*
   * Opens database connections and loads models.
   *
   * @param {object} opts
   * @api public
   */

  connect: function(opts) {
    // configuration
    var options = _.merge({
      configPath: process.cwd()+'/config/mongoose.js',
      modelsPath: process.cwd()+'/app/models',
      logger: false
    }, opts);
    // connection definition
    var config = cfg.read(options.configPath);
    // opening connections
    connections.connect(config, options);
    // defining models
    models.load(connections, options.modelsPath);
  },

  /*
   * Disconnects open connections and unloads models.
   *
   * @return {generator}
   * @api public
   */

  disconnect: function() {
    // destroying models
    models.unload();
    // closing connections
    connections.disconnect();
  },

  /*
   * Returns database connection.
   *
   * @param {string} name
   * @return {object}
   * @api public
   */

  connection: function(name) {
    return connections.object(name);
  },

  /*
   * Returns model.
   *
   * @param {string} name
   * @return {object}
   * @api public
   */

  model: function(name) {
    return models.object(name);
  },

  /*
   * Returns gridfs-stream instance for a connection.
   *
   * @param {string} name
   * @return {object}
   * @api public
   */

  gfs: function(name) {
    return gridfs(this.connection(name).db, this.mongoose.mongo);
  },

};
