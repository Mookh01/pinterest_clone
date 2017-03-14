//THIS FILE WILL BE TRIGGERED DUE TO USER ACTIONS
var socket = io.connect();
var form = document.querySelector('form'); //this will get our content from the form area
var booklist = []; // booklist will have communial book list from all users. 

//User submits book name
form.addEventListener('submit', function(event) {
    event.preventDefault();
    var input = this.querySelector('input');
    var text = input.value;
    input.value = '';
    socket.emit('add', text);
    return false;
});
//Book Info is Dynamically created from API
var counter = [];
socket.on('create', function(results) {
    $('#book_cover').empty();
    var ul = $('<ul>')
    for (var i = 0; i < results.length; i++) {
        counter.push(results[i]);
        if (counter.length > 10) {
            counter.shift();
        };
        if (i == results.length - 1) {
            for (var j = 0; j < counter.length; j++) {
                var bks = counter[j];
                var firstAuthor = bks[2];
                if (bks[2] == null) {
                    firstAuthor = bks[2];
                } else if (bks[2].length < 1) {
                    firstAuthor = bks[2];
                } else if (null !== bks[2].length && bks[2].length > 1) {
                    var authorSorting = bks[2];
                    firstAuthor = authorSorting[0];
                }
                var bookimg = $('<div class="col-xs-6 col-md-4"><li><div class="wrapper"><img src="' + bks[0] + '" width=80px height=100px > <a class="btn-small okgo" id="' + firstAuthor + '" name="' + bks[1] + '" onClick="clic(this);"><span class="glyphicon glyphicon-ok"></span></a></div><h5>' + bks[1] + '</h5><p>' + firstAuthor + '</p></li></div>');
                $(ul).append(bookimg);
                $('#book_cover').append(ul);
            }
        }
    }
});

//Handles Incorrect or null inputs
socket.on('code_error', function() {
        alert("This Code Does Not Exist")
    })
    //A User chose a book to add to their list of "My Books"
function clic(n) {
    var auth = n.id;
    var i = n.previousElementSibling.src;
    var tit = n.name;
    $.ajax({
        type: 'POST',
        url: 'pages/chosen',
        dataType: 'JSON',
        data: { 'image': i, 'title': tit, 'author': auth },
        success: function(data) {
            window.location = data.redirect;
        },
    });
    window.location.reload();
};
//User is requesting a book
function reQuest(r) {
    var x = r.id;
    var i = r.name;
    var info = [x, i];
    $.ajax({
        type: 'POST',
        url: 'pages/request',
        dataType: 'JSON',
        data: { 'author': info[1], 'title': info[0] },
        success: function(data) {
            window.location = data.redirect;
        }
    })
    window.location.reload();
};

//User removes a book from their request. 
function remove(rmv) {
    $.ajax({
        type: 'POST',
        url: 'pages/remove',
        dataType: 'JSON',
        data: { 'author': rmv.name, 'title': rmv.id },
        success: function(data) {
            window.location = data.redirect;
        }
    })
    window.location.reload();
}
//User allows other members to borrow book
function letMhaveIt(take) {
    $.ajax({
        type: 'POST',
        url: 'pages/borrowed',
        dataType: 'JSON',
        data: { 'author': take.name, 'title': take.id },
        success: function(data) {
            window.location = data.redirect;
        }
    })
    window.location.reload();
}


//User declines a request. 
function decline(dcln) {
    console.log('author: ', dcln.name, 'title: ', dcln.id);
    $.ajax({
        type: 'POST',
        url: 'pages/decline',
        dataType: 'JSON',
        data: { 'author': dcln.name, 'title': dcln.id },
        success: function(data) {
            window.location = data.redirect;
        }
    })
    window.location.reload();
}
//User removes book from book club library
function permanentRemoval(rmv) {
    $.ajax({
        type: 'POST',
        url: 'pages/permanentRemoval',
        dataType: 'JSON',
        data: { 'author': rmv.name, 'title': rmv.id },
        success: function(data) {
            window.location = data.redirect;
        }
    })
    window.location.reload();
}