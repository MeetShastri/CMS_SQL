/**
 * Post.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title:{
      type:'string',
      required:true
    },
    content:{
      type:'string',
      required:true
    },
    author:{
      type:'string',
      required:true
    },
    publishedDate:{
      type: 'ref',
      columnType: 'date',
      required: true
    },
    status:{
      type:'string',
      required:true
    },
    image:{
      type:'string',
      allowNull: true
    },
    createdBy:{
      model:'User',
      required:true
    }
  },

};

