const Router = require('express').Router();
const personController = require('../../controllers/person');

Router.post('/createPerson', personController.createPerson);
Router.get('/getAuthor', personController.getAuthor);
Router.get('/fieldSelection', personController.getFieldSelection);
Router.get('/populateMulti', personController.populateMulti);
Router.get('/queryCondition', personController.queryCondition);

Router.get('/getAuthorByStory', personController.getAuthorByStory);

module.exports = Router;
