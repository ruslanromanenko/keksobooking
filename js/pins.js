'use strict';

(function () {

    var similarListElement = document.querySelector(".map__pins"); // выбираем в какой фрагмент кода нужно вставлять елементы

    var elementsPinActive = document.getElementsByClassName("map__pin--active");  //выбираем активные пины

    var removeClassActivePins = function(){
        for(var i = 0; i < elementsPinActive.length; i++){
            elementsPinActive[i].classList.remove("map__pin--active"); //удаляем активные пины
        }
    };

    /**  создем  маркеры на карте, начало */
    var fragmentAd = document.createDocumentFragment();
    var similarAdTemplate = document.querySelector("template").content.querySelector(".map__pin");  // выбираем фрагмент кода из темплейта который нужно клонировать

    var renderAd = function (ad) {
        var adElement = similarAdTemplate.cloneNode(true); // создаем новый елемент обьявления
        adElement.style.left =  ad.location.x + "px";  // меняем координату x
        adElement.style.top =  ad.location.y + "px";    // меняем координату y
        adElement.querySelector("img").src =  ad.author.avatar; // меняем аватарку на кнопке
        adElement.classList.add("hidden");
        return adElement;
    };

    /**  создем  маркеры на карте, конец */

    window.pins = {
        deactivate: removeClassActivePins,
        active: elementsPinActive,
        areaPins: similarListElement,
        fragment: fragmentAd,
        render: renderAd,
    };
})();
