const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    /*
    const data = {
        addCss : ["member/test", 'order/test1'],
        addScript : ['member/test', 'order/test'],

    };
    */
    return res.render("main/index");
});


module.exports = router;