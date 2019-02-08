/**------------------------------------------------------------- работа с формой -----------------------------------------------------*/

/**  зависимость минимальной цены от типа жилья, начало */
var typeHousing = document.getElementById("type");
var priceNight = document.getElementById("price");

typeHousing.onchange = function() {
    switch (this.value) {
        case "flat":
            priceNight.min = 1000;
            break;
        case "bungalo":
            priceNight.min =  0;
            break;
        case "house":
            priceNight.min = 5000;
            break;
        case "palace":
            priceNight.min = 10000;
            break;
    }
};
/**  зависимость минимальной цены от типа жилья, конец */


var timeIn = document.getElementById("timein");
var timeOut = document.getElementById("timeout");
var roomNumber = document.getElementById("room_number");
var capacity = document.getElementById("capacity");

document.querySelector(".notice__form").addEventListener("change", function (evt) {

    /** синхронизация время заезда и выезда, начало **/
    if(evt.target.id === "timein" ){
        timeOut.value = timeIn.value;
    }
    if(evt.target.id === "timeout"){
        timeIn.value = timeOut.value;
    }
    /** синхронизация время заезда и выезда, конец **/

    /** синхронизация количества комнат и гостей, начало **/
    if(evt.target.id === "room_number"){
        switch (roomNumber.value) {
            case "1":
                capacity.value = "1";
                break;
            case "2":
                capacity.value =  "2";
                break;
            case "3":
                capacity.value = "3";
                break;
            case "100":
                capacity.value = "0";
                break;
        }
    }
    /** синхронизация количества комнат и гостей, конец **/
});