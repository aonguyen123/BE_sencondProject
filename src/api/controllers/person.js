const Person = require('../models/person');
const Story = require('../models/story');
const mongoose = require('mongoose');

module.exports = {
    createPerson: async (req, res) => {
        const { name, age } = req.body;
        const _id = new mongoose.Types.ObjectId();

        const author = new Person({
            _id,
            name,
            age
        });
        author.save(err => {
            if(err)
            return err;

            const { title } = req.body;
            const story1 = new Story({
                title,
                author: author._id,
                fans: author._id
            });

            story1.save((err, rs) => {
                if(err) return err;
                res.status(200).json(rs);
            });
        });
    },

    getAuthor: async (req, res) => {
        const { title, name } = req.query;

        await Person.deleteMany({name});

        const rs = await Story.findOne({title}).populate('author');
        if(!rs)
        {
            return res.status(400).json({error: 'wrong title'});
        }
        return res.status(200).json({result: rs});
    },

    getFieldSelection: async (req, res) => {
        const { title } = req.query;

        const rs = await Story.findOne({title}).populate('author', 'name');
        if(!rs)
        return res.status(400).json({error: 'wrong title'});
        return res.status(200).json(rs);
    },

    populateMulti: async (req, res) => {
        const rs = await Story.find().populate('fans').populate('author');
        if(!rs)
        {
            return res.status(400).json({error: 'server error'});
        }
        return res.status(200).json(rs)
    },

    queryCondition: async (req, res) => {
        const rs = await Story.find({}).populate({path: 'fans', match: { age: { $gte: 20 } }, select: 'name -_id' });
        //const kq = rs.filter(item => item.fans.length !== 0);
        return res.status(200).json(rs);
    },

    getAuthorByStory: async (req, res) => {
        const {title} = req.query;

        const rs = await Story.findOne({title}).populate({path: 'author', } );
        if(!rs)
        {
            return res.json({rs: 'loi'})
        }
        return res.json(rs.author);
    },

}
