var express = require('express');
var router = express.Router();
// var Books = require("../models").Book;

'use strict';
var dateFormat = require('dateformat');

module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        //associations can be defined here
      }
    },
    instanceMethods: {
      publishedAt: function() {
        return dateFormat(this.createdAt,"dddd,mmm dS, yyyy, h:MM TT");
      },
       shortDescription: function() {
          return this.body.length > 30 ? this.body.substr(0.30) + "..." : this.body;
      }
    }
  });
  return Book;
};
  