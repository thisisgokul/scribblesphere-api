const post = require('../models/post');
const User = require('../models/user');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const createPost = async (req, res) => {
    try {
        const { title, caption, description, author } = req.body;
        const { token } = req.cookies;


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;


        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const postDoc = await post.create({
            owner: user,
            title,
            caption,
            description,
            author
        });

        res.json({ message: 'Post created successfully', post: postDoc });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the post', details: error.message });
    }
}

const userpost = (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'JWT verification failed' });
        }
        const { id } = userData;
        try {
            const postData = await post.find({ owner: id });
            res.json(postData)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch place data' });
        }
    })
}

const deletepost = async (req, res) => {
    const { id } = req.params;
    try {
        await post.findByIdAndDelete(id);
        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting post' });
    }
}
const postdataid = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await post.findById(id)
        res.json(data);
    } catch (error) {
        res.status(404).json(error);
    }
}

const postupdate = (req, res) => {
    const { token } = req.cookies;
    const {
        id,
        title,
        caption,
        author,
        description,

    } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userdata) => {
        if (err) throw err;

        try {
            const postDoc = await post.findById(id);

            if (userdata.id === postDoc.owner.toString()) {
                postDoc.title = title;
                postDoc.caption = caption;
                postDoc.author = author;

                postDoc.description = description;

            }

            await postDoc.save();
            res.json('ok');
        } catch (error) {
            console.error(error);
            res.status(500).json('Error occurred');
        }
    });
};

const allPostData = async (req, res) => {
    try {
        const data = await post.find({}, 'title description author caption');

        res.json(data);
    } catch (error) {
        res.status(501).json(error);
    }
}


module.exports = { userpost, createPost, deletepost, postdataid, postupdate, allPostData };
