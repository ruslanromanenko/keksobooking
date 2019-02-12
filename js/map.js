'use strict';
(function () {

    var OFFER_TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];

    var OFFER_TYPES = ["flat", "house", "bungalo"];

    var OFFER_CHECKINS = ["12:00", "13:00", "14:00"];
    var OFFER_CHECKOUTS = ["12:00", "13:00", "14:00"];
    var OFFER_FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
    var similarAds = [];

    var getRandomNum = function (min, max){
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    };

    var getFeatures = function (array) {
        var features = [];
        for(var i = 0; i < getRandomNum(1, array.length); i++){

            var randomItem = array[getRandomNum(0, array.length - 1)];  //ищем рандомный елемент масива
            if( features.indexOf(randomItem) === -1 ){
                features.push(randomItem);
            }
        }
        return features;
    };
    var addAtrtibute = function (tag, attributeName, attributeValue, all = false, customSelector = document ) {
        if( all ){
            var allTags = customSelector.querySelectorAll( tag );
            for (var i = 0; i < allTags.length; i++){
                allTags[i].setAttribute(attributeName, attributeValue);
            }
        }else{
            customSelector.querySelector( tag ).setAttribute(attributeName, attributeValue);
        }
    };

    var removeAtrtibute = function(tag, attributeName){
        tag.removeAttribute(attributeName);
    };

    var addStyle = function (element, styleName, styleValue) {
        element.style[styleName] = styleValue;
    };

    for(var i = 0; i < 8; i++){

        var coordinates = {
            x: getRandomNum(300,900),
            y: getRandomNum(100,500)
        };
        similarAds[i] = {
            "author": {
                "avatar": "img/avatars/user0" + (i+1) + ".png"
            },
            "offer": {
                "title": OFFER_TITLES[i],
                "address": coordinates.x + "," + coordinates.y,
                "price": getRandomNum(1000, 1000000),
                "type": OFFER_TYPES[getRandomNum(0, 2)],
                "rooms":  getRandomNum(1, 5),
                "guests": getRandomNum(1, 10),
                "checkin": OFFER_CHECKINS[getRandomNum(0, OFFER_CHECKINS.length - 1)],
                "checkout": OFFER_CHECKOUTS[getRandomNum(0, OFFER_CHECKOUTS.length - 1)],
                "features": getFeatures(OFFER_FEATURES),
                "description": "",
                "photos": []
            },
            "location": {
                "x": coordinates.x,
                "y": coordinates.y
            }
        }
    }


    for(var i = 0; i < similarAds.length; i++){
        window.pins.fragment.appendChild( window.pins.render(similarAds[i]) ); //создаем нужное количество пинов на карте
        window.card.fragmentOfferAd.appendChild( window.card.renderArticleCard(similarAds[i]) ); //создаем нужное количество карточек
    }
    window.pins.areaPins.appendChild(window.pins.fragment); //отрисовуем пины на карте
    window.pins.areaPins.appendChild(window.card.fragmentOfferAd); //отрисовуем карточку обьявления


    /**---------------------------------------------------- EVENTS ------------------------------------------------------------------------------------------  */
    
    var allSelects = document.querySelectorAll("select");
    var classMap = document.querySelector(".map");
    var pinsMap = document.querySelectorAll(".map__pin");
    var popupsCard = document.querySelectorAll(".popup"); //выбираем карточкы обявления
    var fieldsSet = document.querySelectorAll("fieldset");


    for(var i = 0; i < allSelects.length; i++){
        addStyle(allSelects[i], "pointerEvents", "none"); // делаем неактивными все селекты
    }
    addAtrtibute("fieldset", "disabled", "disabled", true); // делаем неактивнымы все поля формы

    window.data.selections.pinMapMain.addEventListener( "mouseup", function (evt) {    //событие при отпускании кнопки мыши на главном маркете
        classMap.classList.remove("map--faded");
        document.querySelector(".notice__form").classList.remove("notice__form--disabled");

        for(var i = 0; i < fieldsSet.length; i++){
            var itemFieldSet = fieldsSet[i];
            removeAtrtibute(itemFieldSet, "disabled");
        }

        for(var i = 0; i < pinsMap.length; i++){
            window.popup.openPopup(pinsMap[i]);                  //показываем на карте все пины
        }

        for(var i = 0; i < allSelects.length; i++){
            addStyle(allSelects[i], "pointerEvents", "auto");
        }
    });

    classMap.addEventListener("click", function (evt) {
        var elementTargetParent = evt.target.parentElement; // выбираем родителя елемента по которому кликнули

        if( elementTargetParent.classList.contains("map__pin") ){

            window.pins.deactivate();

            var i;
            for(i = 0; i < popupsCard.length; i++){
                if(!popupsCard[i].classList.contains("hidden")){
                    window.popup.closePopup(popupsCard[i]); //скрываем активные карточки
                }
            }

            for(i = 0; i < popupsCard.length; i++ ){
                if(evt.target.src.indexOf(popupsCard[i].id) !== -1){
                    window.popup.openPopup(popupsCard[i]);   //открываем карточку
                    break;
                }
            }
            elementTargetParent.classList.add("map__pin--active"); //делаем активным родителя елемента по которому кликнули
        }

        /**   закритые карточки обьявления, начало    */

        if(evt.target.classList.contains("popup__close")){
            for(i = 0; i < window.pins.length; i++){
                window.pins[i].classList.remove("map__pin--active");
            }

            var containsHidden = "";
            for(i = 0; i < popupsCard.length; i++){
                containsHidden = popupsCard[i].classList.contains("hidden");
                if( !containsHidden ) {
                   window.popup.closePopup( popupsCard[i] );
                };
            }
        }
        /**   закритые карточки обьявления, конец    */
    });

    for(var i = 0; i < pinsMap.length; i++){
        /** открываем карточку обьявления при нажатии Enter, начало */
        pinsMap[i].addEventListener("keydown", function (evt) {
            if(evt.keyCode === window.constants.KeyCode.ENTER ){

                window.pins.deactivate(); //удаляем активные пины

                for(i = 0; i < popupsCard.length; i++){
                    if(!popupsCard[i].classList.contains("hidden")){
                        window.popup.closePopup(popupsCard[i]); //скрываем активные карточки
                    }
                }

                for(var i = 0; i < popupsCard.length; i++ ){
                    if(evt.target.children[0].src.indexOf(popupsCard[i].id) !== -1){
                        window.popup.openPopup(popupsCard[i]);   //открываем карточку
                        break;
                    }
                }

                var currentElement = evt.target;
                if(currentElement.classList.contains("map__pin") && !currentElement.classList.contains("map__pin--active")){
                    currentElement.classList.add("map__pin--active");    //делаем текущий пин активным
                }
            }
        });
        /** открываем карточку обьявления при нажатии Enter, конец */
    }

    /** событие при отпускании клавиши Enter на главном пине, начало */
    window.data.selections.pinMapMain.addEventListener( "keyup", function (evt) {    //событие при отпускании кнопки мыши на главном маркете
        if(evt.keyCode === window.constants.KeyCode.ENTER){
            classMap.classList.remove("map--faded");

            document.querySelector(".notice__form").classList.remove("notice__form--disabled");

            for(var i = 0; i < fieldsSet.length; i++){
                var fieldSet = fieldsSet[i];
                removeAtrtibute(fieldSet, "disabled"); //делаем активными все поля форм
            };

            for(var i = 0; i < pinsMap.length; i++){
                window.popup.openPopup(pinsMap[i]);                  //показываем на карте все пины
            }

            for(var i = 0; i < allSelects.length; i++){
                addStyle(allSelects[i], "pointerEvents", "auto");
            }
        }
    });
    /** событие при отпускании клавиши Enter на главном пине, конец */


    /**  поведение главноего пина на мапе, начало **/

    var pinMapMain = window.data.selections.pinMapMain;
    var overlayElem = document.querySelector('.map__pinsoverlay');
    var NEEDLE_HEIGHT = 22;
    var USER_PIN_NEEDLE_POSITION = pinMapMain.offsetWidth / 2;
    var USER_PIN_HEIGHT = pinMapMain.offsetHeight + NEEDLE_HEIGHT;


    // var PIN_LIMITS = {
    //     y: {
    //         top: 100,
    //         /** Нижний предел рассчитывается через
    //          *  высоту отца - высоту таскаемого элемента - 500 */
    //         bottom: overlayElem.offsetHeight - pinMapMain.offsetHeight - 500
    //     }
    // };
    //
    // var getPinMainElemPosition = function () {
    //     return {
    //         x: pinMapMain.offsetLeft,
    //         y: pinMapMain.offsetTop
    //     };
    // };
    //
    //
    // /**
    //  * Получает координаты пина, вычисляет координаты иголки пина, передает их в поле адреса
    //  * @param {Object} position
    //  */
    // var getPinElemNeedleCoords = function (position) {
    //     var updatedCoords = {
    //         x: position.x + USER_PIN_NEEDLE_POSITION,
    //         y: position.y + USER_PIN_HEIGHT
    //     };
    //
    //     // window.forms.onCoordsChange(updatedCoords);
    // };
    //
    // var setAddressCoords = function () {
    //     getPinElemNeedleCoords(getPinMainElemPosition());
    // };

    // function getCoords(elem) {   // кроме IE8-
    //     var box = elem.getBoundingClientRect();
    //     return {
    //         top: box.top + pageYOffset,
    //         left: box.left + pageXOffset
    //     };
    // }
    //
    // var ball = document.getElementsByClassName('map__pin--main')[0];
    //
    // ball.onmousedown = function(e) {
    //
    //     var coords = getCoords(ball);
    //     var shiftX = e.pageX - coords.left;
    //     var shiftY = e.pageY - coords.top;
    //
    //     ball.style.position = 'absolute';
    //     moveAt(e);
    //
    //     ball.style.zIndex = 1000; // над другими элементами
    //
    //     function moveAt(e) {
    //         ball.style.left = e.pageX - shiftX + 'px';
    //         ball.style.top = e.pageY - shiftY + 'px';
    //     }
    //
    //     document.onmousemove = function(e) {
    //         moveAt(e);
    //     };
    //
    //     ball.onmouseup = function() {
    //         document.onmousemove = null;
    //         ball.onmouseup = null;
    //     };
    //
    // }
    //
    // ball.ondragstart = function() {
    //     return false;
    // };


    pinMapMain.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
        const shift = {
            x: evt.pageX - evt.currentTarget.offsetLeft,
            y: evt.pageY - evt.currentTarget.offsetTop,
        };

        var onMouseMove = function(moveEvt){
            moveEvt.preventDefault();
            pinMapMain.style.left = moveEvt.pageX - shift.x + 'px';
            pinMapMain.style.top = moveEvt.pageY - shift.y + 'px';

        };

        var onMouseUp = function(upEvt){
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
    /**  поведение главноего пина на мапе, конец **/

})();