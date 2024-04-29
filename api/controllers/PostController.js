/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addPost: async(req, res) => {
    const {title, content, author, publishedDate, status, image, createdBy} = req.body;
    if(!title || !content || !author || !publishedDate || !status || !image || !createdBy){
      return res.json({
        message:'All fields are required'
      });
    }

    console.log(title, content, author, publishedDate, status, image);
    const checkTableQuery = 'SHOW TABLES LIKE "Post"';
    const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);
    if(tableExistsResult.rows.length===0){
      const createTableQuery = `
        CREATE TABLE Post (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author VARCHAR(255) NOT NULL,
            publishedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
            image VARCHAR(255),
            createdBy varchar(255) NOT NULL
        )`;
      await sails.sendNativeQuery(createTableQuery);
    }
    const addPostQuery = 'INSERT INTO Post (title, content, author, publishedDate, status, image, createdBy) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const addPostParams = [title, content, author, publishedDate, status, image, createdBy];
    const addPostResult = await sails.sendNativeQuery(addPostQuery, addPostParams);
    if(addPostResult.affectedRows>0){
      const id = addPostResult.insertId;
      const getPostQuery = 'SELECT * FROM Post WHERE id=$1';
      const getPostParams = [id];
      const getPostResult = await sails.sendNativeQuery(getPostQuery, getPostParams);
      return res.json({
        message:'Post has been added successfully',
        Post:getPostResult.rows,
      });
    }
  },

  getPost: async(req, res) => {
    const getPostQuery = 'SELECT * FROM Post';
    const getPostResult = await sails.sendNativeQuery(getPostQuery);
    if(getPostResult.rows.length<=0){
      return res.json('No post found');
    }
    else{
      return res.json({
        Posts:getPostResult.rows,
      });
    }
  },

  getPostOfUser: async(req, res) => {
    const createdBy = req.params.id;
    const findUserQuery = 'SELECT * FROM User WHERE id = $1';
    const findUserParams = [createdBy];
    const findUserResult = await sails.sendNativeQuery(findUserQuery, findUserParams);
    if(findUserResult.rows.length === 0){
      return res.json({
        message:'No User found with this id'
      });
    }
    const getPostQuery = 'SELECT * FROM Post where createdBy = $1';
    const getPostParams = [createdBy];
    const getPostResult = await sails.sendNativeQuery(getPostQuery, getPostParams);
    if(getPostResult.rows.length<=0){
      return res.json({
        message:'No Post for this id found',
      });
    }
    else{
      return res.json({
        Post:getPostResult.rows,
      });
    }
  },

  updatePost: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { title, content, author, publishedDate, status, image } = req.body;

    let updatePostQuery = 'UPDATE Post SET ';
    const updatePostParams = [];

    if (title) {
      updatePostQuery += 'title = $1, ';
      updatePostParams.push(title);
    }
    if (content) {
      updatePostQuery += 'content = $2, ';
      updatePostParams.push(content);
    }
    if (author) {
      updatePostQuery += 'author = $3, ';
      updatePostParams.push(author);
    }
    if (publishedDate) {
      updatePostQuery += 'publishedDate = $4, ';
      updatePostParams.push(publishedDate);
    }
    if (status) {
      updatePostQuery += 'status = $5, ';
      updatePostParams.push(status);
    }
    if (image) {
      updatePostQuery += 'image = $6, ';
      updatePostParams.push(image);
    }
    updatePostQuery = updatePostQuery.slice(0, -2);
    const lengthOfArray = updatePostParams.length;
    updatePostQuery += ` WHERE id = $${lengthOfArray + 1}`;
    updatePostParams.push(id);
    const updateResult = await sails.sendNativeQuery(updatePostQuery, updatePostParams);

    const getUpdatedPostQuery = `SELECT * FROM Post where id=$1`;
    const getUpdatedPostParams = [id];
    const getUpdatedPostResult = await sails.sendNativeQuery(getUpdatedPostQuery, getUpdatedPostParams);
    if(updateResult.affectedRows>0){
      return res.json({
        message:'Post has been updated successfully',
        UpdatedPost: getUpdatedPostResult.rows,
      });
    }
  },

  deletePost: async(req, res) => {
    const id = req.params.id;
    const findPostQuery = 'SELECT * FROM Post WHERE id = $1';
    const findPostParams = [id];
    const findPostResult = await sails.sendNativeQuery(findPostQuery, findPostParams);
    if(findPostResult.rows.length<=0){
      return res.json({
        message:'No Post with this id has been found',
      });
    }
    const deletePostQuery = 'DELETE FROM Post WHERE id = $1';
    const deletePostParams = [id];
    const deletePostResult = await sails.sendNativeQuery(deletePostQuery, deletePostParams);
    if(deletePostResult.affectedRows>0){
      return res.json({
        message:'Your Post has been deleted successfully',
        DeletedPost:findPostResult.rows,
      });
    }
  },

  searchPost: async(req, res) => {
    const searchTerm = req.param('q');
    const searchPostQuery = await sails.sendNativeQuery(`SELECT * FROM Post WHERE title LIKE '%${searchTerm}%' OR author LIKE '%${searchTerm}%' OR content LIKE '%${searchTerm}%'`);
    if(searchPostQuery.rows.length>0){
      return res.json({
        message:'Your search is as follows',
        Search:searchPostQuery.rows,
      });
    }
    else{
      return res.json({
        message:'No product found',
      });
    }
  }

};
