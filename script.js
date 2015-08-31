$(function(){
    var today = new Date();
    var months=" січня лютого березня квітня травня червня липня серпня вересня жовтня листопада грудня".split(" ");
    var month =today.getMonth() + 1;
    var day =today.getDate();
    $(".date .month").text(months[month]);
    $(".date .day").text(day);

    $.get("days/" + month + "/" + day + ".json",function(h){
        var imageUrl = h.imageUrl;
        if(!imageUrl)
        {
            imageUrl="http://c1.staticflickr.com/9/8638/15391727113_3d5348808f_h.jpg";
        }

        $(".background").addClass("ready")
            .css("background-image","url(" +imageUrl + ")");



        for(var type in h.data)
        {
            var isImportant=false;
            var text = h.data[type];
            var el = $(".day." + type);
            if(text)
            {
                if(type != 'orthodox')
                {
                    text = text.replace( /\./ig,"<br>");
                }

                text = text.replace( /⊕/ig,"");
                if(type == 'ukraine' && h.isHoliday ||
                    type == 'orthodox' && text.indexOf("⊕") != -1)
                {
                    isImportant=true;
                }

                el.html(text);
            }

            el.toggleClass("hidden",text == null);
            el.toggleClass("important",isImportant);
        }
        $(".info.hidden").removeClass("hidden");
    }) ;


});