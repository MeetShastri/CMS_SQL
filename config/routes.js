/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  //Routes for UserController
  'POST /users/registeruser' : 'UserController.registerUser',
  'POST /users/loginuser' : 'UserController.loginUser',
  'POST /users/resetuserpassword' : 'UserController.resetUserPassword',
  'POST /users/userlogout' : 'UserController.userLogout',

  //Routes for PostController
  'POST /posts/addpost' : 'PostController.addPost',
  'GET /posts/getpost' : 'PostController.getPost',
  'GET /posts/getpostofuser/:id' : 'PostController.getPostOfUser',
  'PATCH /posts/updatepostofuser/:id' : 'PostController.updatePost',
  'DELETE /posts/deletepost/:id' : 'PostController.deletePost',
  'GET /posts/searchpost' : 'PostController.searchPost',

  //Routes for ProductController
  'POST /products/addproduct' : 'ProductController.addProduct',
  'GET /products/getproduct/:id' : 'ProductController.getProductById',
  'GET /products/getallproducts' : 'ProductController.getAllProducts',
  'PATCH /products/updateproduct/:id' : 'ProductController.updateProduct',
  'DELETE /products/deleteproduct/:id' : 'ProductController.deleteProduct',
  'GET /products/searchproduct/' : 'ProductController.searchProduct',

  //Routes for CategoryController
  'POST /categories/addcategory' : 'CategoryController.addCategory',
  'GET /categories/getcategory' : 'CategoryController.getCategory',
  'POST /categories/updatecategory/:id' : 'CategoryController.updateCategory',
  'POST /categories/deletecategory/:id' : 'CategoryController.deleteCategory',

  //Routes for MessageController
  'POST /messages/sendmessage' : 'MessageController.sendMessage',
  'GET /messages/getmessages/:senderid/:recieverid' : 'MessageController.getMessage',
  'PATCH /messages/updatemessage/:messageid' : 'MessageController.updateMessage',
  'DELETE /messages/deletemessage/:messageid' : 'MessageController.deleteMessage',
};
