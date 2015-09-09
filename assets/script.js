$(function () {
    var today = new Date();
    var months = " січня лютого березня квітня травня червня липня серпня вересня жовтня листопада грудня".split(" ");
    var AUTUMN_URLS = ["https://lh3.googleusercontent.com/-98GKcNlTdNA/Ve9kltS7qXI/AAAAAAAAAc8/h79hBVnDN9g/s{width}-Ic42/Autumn_in_Dresden.jpg",
        "https://lh3.googleusercontent.com/-BsY3ZsMKkJA/Ve9klmRQZtI/AAAAAAAAAc8/VDBVPPe15fY/s{width}-Ic42/15391727113_3d5348808f_h.jpg",
        "https://lh3.googleusercontent.com/-6iuz9gxozco/Ve9klngoW6I/AAAAAAAAAc8/VxtGfBuZYjU/s{width}-Ic42/Autumn_in_Toronto.jpg",
        "https://lh3.googleusercontent.com/-LXX6XwkxHl8/Ve9kln1OdgI/AAAAAAAAAc8/R9LwsN--84M/s{width}-Ic42/maple-leaves-background.jpg",
        "https://lh3.googleusercontent.com/-tPP99Wyj_wE/Ve9kloYKOLI/AAAAAAAAAc8/4TCukX7hxw4/s{width}-Ic42/autumn-leaves-wallpapers-hd.jpg"];
    var width = function(){
       var dpi = window.devicePixelRatio ||1;
       return parseInt(Math.round(($("body").width() / 640),0)) * 640 * dpi ;
    };
    var addDays = function (date, num) {
        var value = date.valueOf();
        value += 86400000 * num;
        return new Date(value);
    };

    var random = function (list) {
        return list[Math.floor((Math.random() * list.length))];
    };
    var twoDigits = function(number){
        return number < 10? "0" + number : number;
    };

    $("body").css("background-image","url(https://lh3.googleusercontent.com/-eVQXXrQI0hs/Ve9klglf_rI/AAAAAAAAAc8/soYpriN1exk/s{width}-Ic42/b73bcc559cb7886e72b7fd6ed101a3a71.jpg)".replace("{width}",width()));
    var delta =0;
    var showDate = function (date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        $(".date .month").text(months[month]);
        $(".date .day").text(day);
        $(".background").removeClass("ready");
        $.get("days/" + month + "/" + day + ".json", function (h) {
            var imageUrl = h.imageUrl;
            if (!imageUrl) {
                imageUrl = random(AUTUMN_URLS);
            }
            imageUrl= imageUrl.replace("{width}",width());
            $(".background").addClass("ready")
                .css("background-image", "url(" + imageUrl + ")");


            for (var type in h.data) {
                var isImportant = false;
                var text = h.data[type];
                var el = $(".day." + type);
                if (text) {

                        text = text.replace(/\./ig, "<br>");


                    text = text.replace(/⊕/ig, "");
                    if (type == 'ukraine' && h.isHoliday ||
                        type == 'orthodox' && text.indexOf("⊕") != -1) {
                        isImportant = true;
                    }

                    if(type=='kalendar')
                    {
                        text = "<a target='_blank' href='http://www.kalen-dar.ru/calendar/"  +twoDigits(month) + "/" + twoDigits(day) + "'>" + text + "</a>";
                    }
                    el.html(text);
                }

                el.toggleClass("hidden", text == null);
                el.toggleClass("important", isImportant);
            }
            $(".info.hidden").removeClass("hidden");
        });
        $(".left.scroller").toggleClass("hidden",day==1 && month == 8);
        $(".right.scroller").toggleClass("hidden",day ==31 && month==12);
    };
    showDate(today);

    $(".left.scroller").on("click",function(){
        delta--;
        showDate(addDays(today,delta));
    });
    $(".right.scroller").on("click",function(){
        delta++;
        showDate(addDays(today,delta));
    });
    $(document).on('swipeLeft',function(){

        $(".right.scroller:not(.hidden)").click();
        moveContent(0);
    });
    $(document).on('swipeRight',function(){
        $(".left.scroller:not(.hidden)").click();

        moveContent(0);
    });
    var startX= 0;
    var moveContent=function(delta)
    {
        var allowed=true;
        var el = delta < 0? $(".left.scroller:not(.hidden)") : $(".right.scroller:not(.hidden)")

        allowed=el.length!=0;
        if(allowed)
        {

            $(".content").css("-webkit-transform","translateX(" + -delta + "px)");

        }

    };
    $(".content").on("touchstart",function(e){
        startX=e.changedTouches[0].pageX;
    });
    $(".content").on("touchmove",function(e){
        moveContent(startX- e.changedTouches[0].pageX);
    });
    $(".content").on("touchend",function(e){
        moveContent(0);
    });


});