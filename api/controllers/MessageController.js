/**
 * MessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  sendMessage:async(req, res) => {
    // const senderid = req.params.senderid;
    // const recieverid = req.params.recieverid;
    const {senderid, recieverid, message} = req.body;
    if(!senderid || !recieverid || !message){
      return res.json({
        message:'All fields are required',
      });
    }
    const checkTableQuery = 'SHOW TABLES LIKE "Message"';
    const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);
    if(tableExistsResult.rows.length===0){
      const createTableQuery = `
        CREATE TABLE Message (
            id INT AUTO_INCREMENT PRIMARY KEY,
            senderid VARCHAR(255) NOT NULL,
            recieverid VARCHAR(255) NOT NULL,
            message VARCHAR(255) NOT NULL
        )`;
      await sails.sendNativeQuery(createTableQuery);
    }
    const findSenderQuery = 'SELECT * FROM User WHERE id = $1';
    const findSenderParams = [senderid];
    const findSenderResult = await sails.sendNativeQuery(findSenderQuery, findSenderParams);
    if(findSenderResult.rows.length<=0){
      return res.json({
        message:'Senders id is not found',
      });
    }
    else{
      const findRecieverQuery = 'SELECT * FROM User WHERE id = $1';
      const findRecieverParams = [recieverid];
      const findRecieverResult = await sails.sendNativeQuery(findRecieverQuery, findRecieverParams);
      if(findRecieverResult.rows.length<=0){
        return res.json({
          message:'Recievers id is not found',
        });
      }
      console.log(findSenderResult.rows,findRecieverResult.rows);
    }
    const sendMessageQuery = 'INSERT INTO Message (senderid, recieverid, message) VALUES ($1, $2, $3)';
    const sendMessageParams = [senderid, recieverid, message];
    const sendMessageResult = await sails.sendNativeQuery(sendMessageQuery, sendMessageParams);
    console.log(sendMessageResult);
    if(sendMessageResult.affectedRows>0){
      const id = sendMessageResult.insertId;
      const getMessageQuery = 'SELECT * FROM Message WHERE id = $1';
      const getMessageParams = [id];
      const getMessageResult = await sails.sendNativeQuery(getMessageQuery, getMessageParams);
      if(getMessageResult.rows.length>0){
        return res.json({
          message:'Your message has been sent successfully',
          Message:getMessageResult.rows,
        });
      }
    }
  },

  getMessage: async(req, res) => {
    const senderid = req.params.senderid;
    const recieverid = req.params.recieverid;
    const findSenderQuery = 'SELECT * FROM User WHERE id = $1';
    const findSenderParams = [senderid];
    const findSenderResult = await sails.sendNativeQuery(findSenderQuery, findSenderParams);
    if(findSenderResult.rows.length<=0){
      return res.json({
        message:'Senders id is not found',
      });
    }
    else{
      const findRecieverQuery = 'SELECT * FROM User WHERE id = $1';
      const findRecieverParams = [recieverid];
      const findRecieverResult = await sails.sendNativeQuery(findRecieverQuery, findRecieverParams);
      if(findRecieverResult.rows.length<=0){
        return res.json({
          message:'Recievers id is not found',
        });
      }
      console.log(findSenderResult.rows,findRecieverResult.rows);
    }
    const getMessagesQuery = `SELECT * FROM Message WHERE (senderid = ${senderid} AND recieverid = ${recieverid}) OR (senderid = ${recieverid} AND recieverid = ${senderid})`;
    const getMessagesResult = await sails.sendNativeQuery(getMessagesQuery);
    console.log(getMessagesResult.rows);
    if(getMessagesResult.rows.length>0){
      return res.json({
        message:'Messages between sender and reciever are as follows',
        Messages:getMessagesResult.rows,
      });
    }
    else{
      return res.json({
        message:'No Chat found between this users',
      });
    }
  },

  updateMessage: async(req, res) => {
    const {message} = req.body;
    const id = req.params.messageid;
    const findMessageQuery = 'SELECT * FROM Message WHERE id = $1';
    const findMessageParams = [id];
    const findMessageResult = await sails.sendNativeQuery(findMessageQuery, findMessageParams);
    if(findMessageResult.rows.length<=0){
      return res.json({
        message:`Message's id is not found`,
      });
    }
    const updateMessageQuery = 'UPDATE Message SET message = $1 WHERE id = $2';
    const updateMessageParams = [message,id];
    const updateMessageResult = await sails.sendNativeQuery(updateMessageQuery, updateMessageParams);
    if(updateMessageResult.affectedRows>0){
      const getUpdatedMessageQuery = 'SELECT * FROM Message WHERE id = $1';
      const getUpdatedMessageParams = [id];
      const getUpdatedCategoryResult = await sails.sendNativeQuery(getUpdatedMessageQuery, getUpdatedMessageParams);
      return res.json({
        message:'Your message has been updated',
        UpdatedMessage:getUpdatedCategoryResult.rows,
      });
    }
  },

  deleteMessage: async(req, res) => {
    const id = req.params.messageid;
    const findMessageQuery = 'SELECT * FROM Message WHERE id = $1';
    const findMessageParams = [id];
    const findMessageResult = await sails.sendNativeQuery(findMessageQuery, findMessageParams);
    if(findMessageResult.rows.length<=0){
      return res.json({
        message:'No message with this id is found',
      });
    }
    const deleteMessageQuery = 'DELETE FROM Message WHERE id = $1';
    const deleteMessageParams = [id];
    const deleteMessageResult = await sails.sendNativeQuery(deleteMessageQuery, deleteMessageParams);
    if(deleteMessageResult.affectedRows>0){

      return res.json({
        message:'Message has been deleted successfully',
        DeletedMessage:findMessageResult.rows,
      });
    }
  }
};

