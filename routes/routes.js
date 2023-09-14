const express = require('express');
const router = express.Router();
const { getAll, signup, login, profile, logout } = require('../controllers/users');
const { createPost, userpost, deletepost, postdataid, postupdate, allPostData } = require('../controllers/postController');


router.get('/api', getAll);
router.get('/api/profile', profile);
router.post('/api/signup', signup);
router.post('/api/login', login);
router.post('/api/logout', logout);
router.post('/api/createpost', createPost);
router.get('/api/userpost', userpost);
router.get('/api/postdataid/:id', postdataid)
router.put('/api/postupdate', postupdate)
router.delete('/api/deletepost/:id', deletepost);
router.get('/api/allpostdata', allPostData);



module.exports = router;