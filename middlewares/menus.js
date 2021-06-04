/**
 * 메인메뉴 미들웨어 
 * 
 */

module.exports.mainMenu = (req, res, next) => {
    res.locals.mainMenu = [
        {
            menu : '메뉴1', 
            url : '/menu1', 
            subMenu : [
                { menu : '서브 메뉴1', url : '/smenu1', },
                { menu : '서브 메뉴2', url : '/smenu2', },
                { menu : '서브 메뉴3', url : '/smenu3', }
            ],
        },
        {menu : '메뉴2', url : '/menu2' },
        {menu : '메뉴3', url : '/menu3' },
        {menu : '메뉴4', url : '/menu4' },
        {menu : '메뉴5', url : '/menu5' },
    ];

    next();
};