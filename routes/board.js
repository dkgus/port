const express = require('express');
const router = express.Router();

/** /board/write*/
router.route("/write")
    /** 게시글 양식 */
    .get((req, res, next) => {

    })
    /** 게시글 등록  */
    .post((req, res, next) => {

    })
    /** 게시글 수정  */
    .patch((req, res, next) => {

    })
    /** 게시글 삭제  */
    .delete((req, res, next) => {

    })

/** 게시글 보기  */
router.get("/view", (req, res, next) => {

});

/** 게시글 목록 */
router.get("/list", (req, res, next) => {

});

module.exports = router;