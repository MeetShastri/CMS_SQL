/**
 * Message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    senderid:{
      model:'User',
      required:true
    },
    recieverid:{
      model:'User',
      required:true
    },
    message:{
      type:'string',
      required:true
    }
  },
};

