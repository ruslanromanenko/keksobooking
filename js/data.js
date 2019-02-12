'use strict';

(function () {
    var OFFER_TYPES_RUSSIA = {
        "flat": "Квартира",
        "house": "Дом",
        "bungalo": "Бунгало"
    };
    window.data = {
        selections: {
            popupsCard: document.getElementsByClassName('popup'),
            popupsClose: document.getElementsByClassName('popup__close'),
            ofeerTypesRussia: OFFER_TYPES_RUSSIA,
            pinMapMain:document.querySelector(".map__pin--main"),
        }
    };
})();
