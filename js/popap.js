'use strict';
var ENTER_KEYCODE = 13;

var onPopupEscPress = function (evt) {
        if(evt.keyCode === window.constants.KeyCode.ESC){

            for(var i = 0; i < popupsCard.length; i++ ){
                popupsCard[i].classList.add('hidden');
            }
            removeClassActivePins();
        }
    };

var openPopup = function (where) {
    where.classList.remove("hidden");
    document.addEventListener('keydown', onPopupEscPress);
};
var closePopup = function (where) {
    where.classList.add("hidden");
    document.removeEventListener('keydown', onPopupEscPress);
};