'use strict';

(function () {
    /** создаем карточку обяьвления, начало */
    var articleCardTemplate = document.querySelector("template").content.querySelector(".map__card");

    var fragmentOfferAd = document.createDocumentFragment();
    var renderArticleCard = function (offerAd) {
        var articleItem = articleCardTemplate.cloneNode(true);
        articleItem.classList.add("hidden");
        articleItem.querySelector("h3").textContent = offerAd.offer.title;
        articleItem.querySelector("p>small").textContent = offerAd.offer.address;
        articleItem.querySelector(".popup__price").textContent = offerAd.offer.price + "\u20BD/ночь";
        articleItem.querySelector("h4").textContent = window.data.selections.ofeerTypesRussia[offerAd.offer.type];
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
            }
        }
        /* features, end */
        articleItem.querySelectorAll("p")[4].textContent = offerAd.offer.description;

        var srcAvatar = articleItem.querySelector(".popup__avatar").src = offerAd.author.avatar;

        var nameImage = srcAvatar.substring(srcAvatar.lastIndexOf("/") + 1);
        var idFromImg = nameImage.split(".")[0];

        articleItem.id = idFromImg; // добавляем id к карточке

        return articleItem;
    };
    /** создаем карточку обяьвления, конец */

    window.card = {
        fragmentOfferAd: fragmentOfferAd,
        renderArticleCard: renderArticleCard
    }
})();
