//const express = require('express');
//const router = express.Router();
//const Books = require("../models").Book;


'use strict';
var dateFormat = require('dateformat');

module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    title:{
      
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: "Tite is required"
      }
    }
  },
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
        return dateFormat(this.createdAt, "ddd,mmm dS, yyyy, h:MMTT");
      },
      shortDescription: function(){
        return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
      }
    }
  });
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};