'use strict';

(function () {
    var close = function () {
        window.pins.deactivate();
        for(var i = 0; i < window.data.selections.popupsCard.length; i++ ){
            window.data.selections.popupsCard[i].classList.add('hidden');
        }
    };

    var onPopupEscPress = function (evt) {
        if(evt.keyCode === window.constants.KeyCode.ESC){
            close();
        }
    };

    var openPopup = function (where) {
        where.classList.remove("hidden");
        document.addEventListener('keydown', onPopupEscPress);
    };

    var closePopup = function (where) {
        where.classList.add("hidden");
        document.addEventListener('keydown', onPopupEscPress);
    };

    window.popup = {
      openPopup: openPopup,
      closePopup: closePopup
    };
})();
