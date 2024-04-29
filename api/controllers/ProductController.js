/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  addProduct: async(req, res) => {
    const {title, description, category, price, stockquantity, manufacturer, image, review} = req.body;
    if(!title || !description || !category || !price || !stockquantity || !manufacturer || !image || !review){
      return res.json({
        message:'All fields are required',
      });
    }
    const checkTableQuery = 'SHOW TABLES LIKE "Product"';
    const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);
    if(tableExistsResult.rows.length===0){
      const createTableQuery = `
        CREATE TABLE Product (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(255) NOT NULL,
            price INT NOT NULL,
            stockquantity INT NOT NULL,
            manufacturer VARCHAR(255),
            image VARCHAR(255),
            review INT NOT NULL
        )`;
      await sails.sendNativeQuery(createTableQuery);
    }
    const addProductQuery = 'INSERT INTO Product(title, description, category, price, stockquantity, manufacturer, image, review) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const addProductParams = [title, description, category, price, stockquantity, manufacturer, image, review];
    const addProductResult = await sails.sendNativeQuery(addProductQuery, addProductParams);
    if(addProductResult.affectedRows>0){
      const id = addProductResult.insertId;
      const getProductQuery ='SELECT * FROM Product WHERE id = $1';
      const getProductParams = [id];
      const getProductResult = await sails.sendNativeQuery(getProductQuery, getProductParams);
      return res.json({
        message:'Product has been added',
        Product:getProductResult.rows[0],
      });
    }
  },

  getProductById: async(req, res) => {
    const id = req.params.id;
    const getProductQuery = 'SELECT * FROM Product WHERE id = $1';
    const getProductParams = [id];
    const getProductResult = await sails.sendNativeQuery(getProductQuery, getProductParams);
    if(getProductResult.rows.length<=0){
      return res.json({
        message:'No Product with this id has been found',
      });
    }
    else{
      return res.json({
        message:'Here is the Product',
        Product:getProductResult.rows[0],
      });
    }
  },

  getAllProducts: async(req, res) => {
    const getAllProductsQuery = 'SELECT * FROM Product';
    const getAllProductsResult = await sails.sendNativeQuery(getAllProductsQuery);
    if(getAllProductsResult.rows.length>0){
      return res.json({
        message:'All Products are shown here',
        AllProducts:getAllProductsResult.rows,
      });
    }
    else{
      return res.json({
        message:'No Products found',
      });
    }
  },

  updateProduct: async(req,res) => {
    const id = req.params.id;
    const {title, description, category, price, stockquantity, manufacturer, image, review} = req.body;
    let updateProductQuery = 'UPDATE Product SET ';
    const updateProductParams = [];

    if (title) {
      updateProductQuery += 'title = $1, ';
      updateProductParams.push(title);
    }
    if (description) {
      updateProductQuery += 'description = $2, ';
      updateProductParams.push(description);
    }
    if (category) {
      updateProductQuery += 'category = $3, ';
      updateProductParams.push(category);
    }
    if (price) {
      updateProductQuery += 'price = $4, ';
      updateProductParams.push(price);
    }
    if (stockquantity) {
      updateProductQuery += 'stockquantity = $5, ';
      updateProductParams.push(stockquantity);
    }
    if (manufacturer) {
      updateProductQuery += 'manufacturer = $6, ';
      updateProductParams.push(manufacturer);
    }
    if (image) {
      updateProductQuery += 'image = $7, ';
      updateProductParams.push(image);
    }
    if (review) {
      updateProductQuery += 'review = $8, ';
      updateProductParams.push(review);
    }
    updateProductQuery = updateProductQuery.slice(0, -2);
    const lengthOfArray = updateProductParams.length;
    updateProductQuery += ` WHERE id = $${lengthOfArray + 1}`;
    updateProductParams.push(id);
    const updateResult = await sails.sendNativeQuery(updateProductQuery, updateProductParams);

    const getUpdatedProductQuery = `SELECT * FROM Product where id=$1`;
    const getUpdatedProductParams = [id];
    const getUpdatedProductResult = await sails.sendNativeQuery(getUpdatedProductQuery, getUpdatedProductParams);
    console.log(getUpdatedProductResult);
    if(updateResult.affectedRows>0){
      return res.json({
        message:'Product has been updated successfully',
        UpdatedProduct:getUpdatedProductResult.rows[0],
      });
    }
  },

  deleteProduct: async(req, res) => {
    const id = req.params.id;
    const findProductQuery = 'SELECT * FROM Product WHERE id = $1';
    const findProductParams = [id];
    const findProductResult = await sails.sendNativeQuery(findProductQuery, findProductParams);
    if(findProductResult.rows.length<=0){
      return res.json({
        message:'No Product with this id has been found',
      });
    }
    const deleteProductQuery = 'DELETE FROM Product WHERE id = $1';
    const deleteProductParams = [id];
    const deleteProductResult = await sails.sendNativeQuery(deleteProductQuery, deleteProductParams);
    if(deleteProductResult.affectedRows>0){
      return res.json({
        message:'Product has been deleted successfully',
        DeletedProduct:findProductResult.rows,
      });
    }
  },

  searchProduct: async(req, res) => {
    const searchTerm = req.param('q');
    const searchProductQuery = await sails.sendNativeQuery(`SELECT * FROM Product WHERE title LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%'`);
    if(searchProductQuery.rows.length>0){
      return res.json({
        message:'Your search is as follows',
        Search:searchProductQuery.rows,
      });
    }
    else{
      return res.json({
        message:'No product found',
      });
    }
  }
};

