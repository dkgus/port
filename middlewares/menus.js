/**
 * 메인메뉴 미들웨어 
 * 
 */

module.exports.mainMenu = (req, res, next) => {
    res.locals.mainMenu = [
        {
            menu : 'package Tour', 
            url : '/board/list/packagetour', 
            subMenu : [
                { menu : '얼음 동굴 투어', url : '/board/list/packagetour?category=얼음%20동굴%20투어', },
                { menu : '남부 해안 투어', url : '/board/list/packagetour?category=남부%20해안%20투어', },
                { menu : '스노쿨링 투어', url : '/board/list/packagetour?category=스노쿨링%20투어', },
                { menu : '자전거 투어', url : '/board/list/packagetour?category=자전거%20투어', },
                { menu : '지열 온실 투어', url : '/board/list/packagetour?category=지열%20온실%20투어', }
            
            ],
        },

        {
            menu : 'Bus Tour', 
            url : '/board/list/bustour', 
            subMenu : [
                { menu : '30인 이하', url : '/board/list/bustour?category=30인%20이하' },
                { menu : '20인 이하', url : '/board/list/bustour?category=20인%20이하' },
                { menu : '프라이빗 투어', url : '/board/list/bustour?category=프라이빗%20투어' },
            ],
        },

        {
            menu : 'Photo', 
            url : '/board/list/photo', 
            subMenu : [
                { menu : 'Picture Award', url : '/board/list/photo?category=Picture%20Award', },
                { menu : '응모하기', url : '/board/list/photo?category=응모하기', },
            ],
        },



        {
            menu : 'Reservation', 
            url : '/travel', 
        },

        {
            menu : 'Q & A', 
            url : '/board/list/qna', 
        },


    ];

    next();
};