const travel = require('../models/travel');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res, next) => {
	const mainGoods = await travel.getMainDisplayGoods();

	const data = {
		mainGoods,
        addCss : ['main'],
        addScript : ['main'],
    }
	
    return res.render("main/index", data);
});


module.exports = router;