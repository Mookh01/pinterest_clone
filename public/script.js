$(function() {


    //----- OPEN
    $('[data-popup-open]').on('click', function(e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

        e.preventDefault();
    });

    //----- CLOSE
    $('[data-popup-close]').on('click', function(e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

        e.preventDefault();
        window.location.reload();
    });
});

function imgError(image) {
    image.onerror = "";
    image.src = "./image/broken_image.png";
    return true;
}

$("#fname").on('input', function() {
    var image = this.value
    $('#magic').append('<img src="' + image + '"/>');
});

$('[data-popup-open]').on('click', function(e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    var image = e.target.currentSrc;
    // var image = this.innerHTML;
    var lgImage = "<img src='" + image + "'/>"
        // console.log(image);
    $('#lgrview').append(lgImage);
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

});

function clic(n) {
    var i = n.id;
    var ttl = n.name;
    // console.log(ttl);
    $.ajax({
        type: 'POST',
        url: 'pages/likes',
        dataType: 'JSON',
        data: { 'image': i, 'title': ttl },

        success: function(data) {
            window.location = data.redirect;
        },
    });
    window.location.reload();
};

function permanentRemoval(rmv) {
    $.ajax({
        type: 'POST',
        url: 'pages/permanentRemoval',
        dataType: 'JSON',
        data: { 'title': rmv.id },
        success: function(data) {
            window.location = data.redirect;
        }
    })
    window.location.reload();
}

function redirectVote() {
    alert("Go To Home Page To Like The Picture.");
}