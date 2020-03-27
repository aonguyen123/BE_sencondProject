const router = require('express').Router();
const path = require('path');

router.get('/:fileName', (req, res) => {
	const fileName = req.params.fileName;
    if (fileName) {
		res.sendFile(path.resolve(`./public/uploads/${fileName}`));
    }
})

module.exports = router;
