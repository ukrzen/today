$(function () {
    var today = new Date();
    var months = " січня лютого березня квітня травня червня липня серпня вересня жовтня листопада грудня".split(" ");
    var AUTUMN_URLS = ["https://lh3.googleusercontent.com/Zl8Fo-vMumjS5hu7PSDffpZ2a3RnsBpT926pgaxBsK4=w547-h364-no",
        "https://lh3.googleusercontent.com/x62Uwx-W9wcplARwUlS1QikPIXy4FOC1Hyt7XVoGOiU=w1984-h1322-no",
        "https://lh3.googleusercontent.com/e0IuDAwHO4XSySwDSbAcOxyc1EIjLwVMrK-fY08laoA=w1600-h900-no",
        "https://lh3.googleusercontent.com/WWsjn9aGJ8CnYvlfjbyhDs2J6WEAp5uwaLFloGagaHI=w1000-h727-no",
        "https://lh3.googleusercontent.com/FpGGqH2ihrkuP7QGSnIzUh34J27INZcpUliBrvL-6Ts=w1920-h1280-no"];

    var addDays = function (date, num) {
        var value = date.valueOf();
        value += 86400000 * num;
        return new Date(value);
    };

    var random = function (list) {
        return list[Math.floor((Math.random() * list.length))];
    };


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

            $(".background").addClass("ready")
                .css("background-image", "url(" + imageUrl + ")");


            for (var type in h.data) {
                var isImportant = false;
                var text = h.data[type];
                var el = $(".day." + type);
                if (text) {
                    if (type != 'orthodox') {
                        text = text.replace(/\./ig, "<br>");
                    }

                    text = text.replace(/⊕/ig, "");
                    if (type == 'ukraine' && h.isHoliday ||
                        type == 'orthodox' && text.indexOf("⊕") != -1) {
                        isImportant = true;
                    }

                    el.html(text);
                }

                el.toggleClass("hidden", text == null);
                el.toggleClass("important", isImportant);
            }
            $(".info.hidden").removeClass("hidden");
        });
        $(".left.scroller").toggleClass("hidden",delta==-1);
        $(".right.scroller").toggleClass("hidden",delta==7);
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
    $(".content").on('swipeLeft',function(){

        $(".left.scroller:not(.hidden)").click();
        moveContent(0);
    });
    $(".content").on('swipeRight',function(){

        $(".right.scroller:not(.hidden)").click();
        moveContent(0);
    });
    var startX= 0;
    var moveContent=function(delta)
    {
        var allowed=true;
        var el = delta > 0? $(".left.scroller:not(.hidden)") : $(".right.scroller:not(.hidden)")

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