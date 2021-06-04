/**
 * 메인메뉴 미들웨어 
 * 
 */

module.exports.mainMenu = (req, res, next) => {
    res.locals.mainMenu = [
        {
            menu : 'package Tour', 
            url : '/menu1', 
            subMenu : [
                { menu : '얼음 동굴 투어', url : '/smenu1', },
                { menu : '남부 해안 투어', url : '/smenu2', },
                { menu : '스노쿨링 투어', url : '/smenu3', },
                { menu : '자전거 투어', url : '/smenu3', },
                { menu : '지열 온실 투어', url : '/smenu3', }
            
            ],
        },

        {
            menu : 'Bus Tour', 
            url : '/menu2', 
            subMenu : [
                { menu : '30인 이하', url : '/smenu1', },
                { menu : '20인 이하', url : '/smenu2', },
                { menu : '프라이빗 투어', url : '/smenu3', },
            ],
        },

        {
            menu : 'Photo', 
            url : '/menu3', 
            subMenu : [
                { menu : 'Picture Award', url : '/smenu1', },
                { menu : '응모하기', url : '/smenu2', },
            ],
        },



        {
            menu : 'Reservation', 
            url : '/menu4', 
            subMenu : [
                { menu : '예약하기', url : '/smenu1', },
                { menu : '예약 확인하기', url : '/smenu2', },
                { menu : '예약 수정하기', url : '/smenu3', },
                { menu : '예약 취소하기', url : '/smenu3', },
            
            ],
        },

        {
            menu : 'Q & A', 
            url : '/menu5', 
            subMenu : [
                { menu : '게시판 가기', url : '/smenu1', },
               
            ],
        },


    ];

    next();
};