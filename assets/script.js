$(function () {
    var currentDate = new Date();
    var today = currentDate;
    if(location.hash) {
        var args = location.hash.split("/");
        currentDate.setDate(parseInt(args[2]));
        currentDate.setMonth(parseInt(args[1])-1);
    }

    var months = " січня лютого березня квітня травня червня липня серпня вересня жовтня листопада грудня".split(" ");
    var AUTUMN_URLS = ["https://lh3.googleusercontent.com/-98GKcNlTdNA/Ve9kltS7qXI/AAAAAAAAAc8/h79hBVnDN9g/s{width}-Ic42/Autumn_in_Dresden.jpg",
        "https://lh3.googleusercontent.com/-BsY3ZsMKkJA/Ve9klmRQZtI/AAAAAAAAAc8/VDBVPPe15fY/s{width}-Ic42/15391727113_3d5348808f_h.jpg",
        "https://lh3.googleusercontent.com/-6iuz9gxozco/Ve9klngoW6I/AAAAAAAAAc8/VxtGfBuZYjU/s{width}-Ic42/Autumn_in_Toronto.jpg",
        "https://lh3.googleusercontent.com/-LXX6XwkxHl8/Ve9kln1OdgI/AAAAAAAAAc8/R9LwsN--84M/s{width}-Ic42/maple-leaves-background.jpg",
        "https://lh3.googleusercontent.com/-tPP99Wyj_wE/Ve9kloYKOLI/AAAAAAAAAc8/4TCukX7hxw4/s{width}-Ic42/autumn-leaves-wallpapers-hd.jpg"];
    var WINTER_URLS = ["https://lh3.googleusercontent.com/-I3kk8e6O-SY/VfBh4kod5JI/AAAAAAAAAe0/5eAEJuL_HYs/s{width}-Ic42/winter-fairy-tale-carpathians-ukraine-1.jpg",
        "https://lh3.googleusercontent.com/-SH5FgnMc-44/VfBh44INFpI/AAAAAAAAAe4/uaK_vg6anoQ/s640-Ic42/tumblr_mg43zaN8j71s2vya6o1_1280.jpg"];
    var SPRING_URLS=[],SUMMER_URLS=[];
    var defaultImages = {
        1:WINTER_URLS,2:WINTER_URLS,
        3:SPRING_URLS,4:SPRING_URLS,5:SPRING_URLS,
        6:SUMMER_URLS,7:SUMMER_URLS,8:SUMMER_URLS,
        9:AUTUMN_URLS,10:AUTUMN_URLS,11:AUTUMN_URLS,
        12:WINTER_URLS
    };
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
    var changingDate = function(){
        return $(".calendar:not(.hidden)").length==1;
    }

    $("body").css("background-image","url(https://lh3.googleusercontent.com/-hsvH3qBMxw4/VfBj2LTfEfI/AAAAAAAAAfM/K1xWGXVihEg/s{width}-Ic42/field-summer-sun-meadow.jpg)".replace("{width}",width()));
    var delta =0;
    var showDate = function (date) {

        currentDate=date;
        var month = date.getMonth() + 1;
        var day = date.getDate();

        $(".date .month").text(months[month]);
        $(".date .day").text(day);
        if(currentDate!=today)
        {
            location.hash = "/" + month + "/" + day;
        }
        $(".info").addClass("hidden");
        $(".background").removeClass("ready");
        $.get("days/" + month + "/" + day + ".json", function (h) {
            $(".info").removeClass("hidden");
            var imageUrl = h.imageUrl;
            if (!imageUrl) {
                imageUrl = random(defaultImages[month]);
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
        var d = new Date();
        d.setMonth(month-1);
        d.setDate(day);

        calendar.setDates(d);
        ga('send', {
            'hitType': 'event',          // Required.
            'eventCategory': 'Main',   // Required.
            'eventAction':'Look date' ,      // Required.
            'eventLabel': day + "/" + month,
            'eventValue': 1
        });
    };
    showDate(currentDate);
    $(".calendar").on("dateChanged",function(){
        if($(this).data("startdate"))
        {
            showDate(new Date( Date.parse($(this).data("startdate"))));
            $(".calendar").addClass("hidden");
        }

    });
    $(".background-overlay").on("click",function(){
        $(".calendar").addClass("hidden");
    });
    $(".date").on("click",function(){
        $(".calendar").removeClass("hidden");
    });
    $(".left.scroller").on("click",function(){
        if(changingDate()) return;

        showDate( addDays(currentDate,-1));
    });
    $(".right.scroller").on("click",function(){
        if(changingDate()) return;

        showDate(addDays(currentDate,+1));
    });
    $(document).on('swipeLeft',function(){
        if(changingDate()) return;
        $(".right.scroller:not(.hidden)").click();
        moveContent(0);
    });
    $(document).on('swipeRight',function(){
        if(changingDate()) return;
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