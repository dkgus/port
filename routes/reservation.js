const express = require('express');
const router = express.Router();

/** /reservation 등록, 수정, 삭제 */
router.route("/")
    /** 예약 양식 */
    .get((req, res, next) => {

    })
    /** 예약 등록 처리 */
    .post((req, res, next) => {

    })
    /** 예약 등록 수정  */
    .patch((req, res, next) => {

    })
    /** 예약 등록 삭제 */
    .delete((req, res, next) => {

    });


router.get('/list', (req, res, next) => {

});

module.exports = router;