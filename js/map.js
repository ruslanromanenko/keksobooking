'use strict';
(function () {

    var OFFER_TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];

    var OFFER_TYPES = ["flat", "house", "bungalo"];

    var OFFER_CHECKINS = ["12:00", "13:00", "14:00"];
    var OFFER_CHECKOUTS = ["12:00", "13:00", "14:00"];
    var OFFER_FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

    var OFFER_TYPES_RUSSIA = {
        "flat": "Квартира",
        "house": "Дом",
        "bungalo": "Бунгало"
    }
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
    /** создаем карточку обяьвления, начало */
    var articleCardTemplate = document.querySelector("template").content.querySelector(".map__card");

    var fragmentOfferAd = document.createDocumentFragment();
    var renderArticleCard = function (offerAd) {
        var articleItem = articleCardTemplate.cloneNode(true);
        articleItem.classList.add("hidden");
        articleItem.querySelector("h3").textContent = offerAd.offer.title;
        articleItem.querySelector("p>small").textContent = offerAd.offer.address;
        articleItem.querySelector(".popup__price").textContent = offerAd.offer.price + "\u20BD/ночь";
        articleItem.querySelector("h4").textContent = OFFER_TYPES_RUSSIA[offerAd.offer.type];
        articleItem.querySelectorAll("p")[2].textContent = offerAd.offer.rooms + " комнаты для " + offerAd.offer.guests + " гостей";
        articleItem.querySelectorAll("p")[3].textContent = "Заезд после " + offerAd.offer.checkin + ", выезд до" + offerAd.offer.checkout;
        /* features, start */
        var featureElements = articleItem.querySelectorAll(".popup__features li");
        var lengthFeaturesArray = featureElements.length;
        for(var i = 0; i < lengthFeaturesArray; i++ ){
            var currentElement = featureElements[i];
            var currentElementClass = currentElement.classList[1].split("--")[1];

            if( offerAd.offer.features.indexOf(currentElementClass) === -1 ){
                currentElement.remove();
            };
        }
        /* features, end */
        articleItem.querySelectorAll("p")[4].textContent = offerAd.offer.description;

        var srcAvatar = articleItem.querySelector(".popup__avatar").src = offerAd.author.avatar;

        var nameImage = srcAvatar.substring(srcAvatar.lastIndexOf("/") + 1);
        var idFromImg = nameImage.split(".")[0];

        articleItem.id = idFromImg; // добавляем id к карточке

        return articleItem;
    };

    for(var i = 0; i < similarAds.length; i++){
        window.pins.fragment.appendChild( window.pins.render(similarAds[i]) ); //создаем нужное количество пинов на карте
        fragmentOfferAd.appendChild( renderArticleCard(similarAds[i]) ); //создаем нужное количество карточек
    }
    window.pins.areaPins.appendChild(window.pins.fragment); //отрисовуем пины на карте
    window.pins.areaPins.appendChild(fragmentOfferAd); //отрисовуем карточку обьявления
    /** создаем карточку обяьвления, конец */

    /**---------------------------------------------------- EVENTS ------------------------------------------------------------------------------------------  */
    var pinMapMain = document.querySelector(".map__pin--main");
    var allSelects = document.querySelectorAll("select");
    var classMap = document.querySelector(".map");
    var pinsMap = document.querySelectorAll(".map__pin");
    var popupsCard = document.querySelectorAll(".popup"); //выбираем карточкы обявления
    var fieldsSet = document.querySelectorAll("fieldset");


    for(var i = 0; i < allSelects.length; i++){
        addStyle(allSelects[i], "pointerEvents", "none"); // делаем неактивными все селекты
    }
    addAtrtibute("fieldset", "disabled", "disabled", true); // делаем неактивнымы все поля формы

    pinMapMain.addEventListener( "mouseup", function (evt) {    //событие при отпускании кнопки мыши на главном маркете
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
    pinMapMain.addEventListener( "keyup", function (evt) {    //событие при отпускании кнопки мыши на главном маркете
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

})();