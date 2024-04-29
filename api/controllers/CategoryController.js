/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  addCategory: async(req, res) => {
    const {name, type, description } = req.body;
    if(!name || !type || !description){
      return res.json({
        message:'All fields are required',
      });
    }
    const checkTableQuery = 'SHOW TABLES LIKE "Category"';
    const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);
    if(tableExistsResult.rows.length===0){
      const createTableQuery = `
        CREATE TABLE Category (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL
        )`;
      await sails.sendNativeQuery(createTableQuery);
    }
    const addCategoryQuery = 'INSERT INTO Category (name, type, description) VALUES ($1, $2, $3)';
    const addCategoryParams = [name, type, description];
    const addCategoryResult = await sails.sendNativeQuery(addCategoryQuery, addCategoryParams);
    if(addCategoryResult.affectedRows>0){
      const id = addCategoryResult.insertId;
      const getCategoryQuery = 'SELECT * FROM Category WHERE id = $1';
      const getCategoryParams = [id];
      const getCategoryResult = await sails.sendNativeQuery(getCategoryQuery, getCategoryParams);
      if(getCategoryResult.rows.length>0){
        return res.json({
          message:'Category has been added',
          Category:getCategoryResult.rows,
        });
      }
    }
  },

  getCategory: async(req, res) => {
    const getCategoryQuery = 'SELECT * FROM Category';
    const getCategoryResult = await sails.sendNativeQuery(getCategoryQuery);
    if(getCategoryResult.rows.length>0){
      return res.json({
        message:'All categories are here',
        Categories:getCategoryResult.rows,
      });
    }
    else{
      return res.json({
        message:'No category found',
      });
    }
  },

  updateCategory: async(req, res) => {
    const id = req.params.id;
    const {name, type, description} = req.body;
    let updateCategoryQuery = 'UPDATE Category SET ';
    const updateCategoryParams = [];
    if (name) {
      updateCategoryQuery += 'name = $1, ';
      updateCategoryParams.push(name);
    }
    if (type) {
      updateCategoryQuery += 'type = $2, ';
      updateCategoryParams.push(type);
    }
    if (description) {
      updateCategoryQuery += 'description = $3, ';
      updateCategoryParams.push(description);
    }
    updateCategoryQuery = updateCategoryQuery.slice(0, -2);
    const lengthOfArray = updateCategoryParams.length;
    updateCategoryQuery += ` WHERE id = $${lengthOfArray + 1}`;
    updateCategoryParams.push(id);
    const updateCategoryResult = await sails.sendNativeQuery(updateCategoryQuery, updateCategoryParams);
    if(updateCategoryResult.affectedRows>0){
      const getUpdatedCategoryQuery = 'SELECT * FROM Category WHERE id = $1';
      const getUpdatedCategoryParams = [id];
      const getUpdatedCategoryResult = await sails.sendNativeQuery(getUpdatedCategoryQuery, getUpdatedCategoryParams);
      return res.json({
        message:'Your category has been updated successfully',
        updatedCategory:getUpdatedCategoryResult.rows,
      });
    }
  },

  deleteCategory: async(req, res) => {
    const id = req.params.id;
    const getDeletedCategoryQuery = 'SELECT * FROM Category WHERE id = $1';
    const getDeletedCategoryParams = [id];
    const getDeletedCategoryResult = await sails.sendNativeQuery(getDeletedCategoryQuery, getDeletedCategoryParams);
    const deleteCategoryQuery = 'DELETE FROM Category WHERE id = $1';
    const deleteCategoryParams= [id];
    const deleteCategoryResult = await sails.sendNativeQuery(deleteCategoryQuery, deleteCategoryParams);
    if(deleteCategoryResult.affectedRows>0){

      return res.json({
        message:'Category has been deleted successfully',
        DeletedCategory: getDeletedCategoryResult.rows,
      });
    }
    else{
      return res.json({
        message:'No category with id is found',
      });
    }
  }
};

