const express = require('express');
const router = express.Router();

/** 관리자 페이지 공통 라우터  */
router.use((req, res, next) => {
    /* 관리자가 아니면 접속 불가 */
    if (!req.isLogin || !req.member.isAdmin) {
        return res.redirect("/");
    }
    next();
});

router.get("/", (req, res, next) => {
    return res.render("admin/main/index");
});



module.exports = router;