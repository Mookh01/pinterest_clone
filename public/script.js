//THIS FILE WILL BE TRIGGERED DUE TO USER ACTIONS
var socket = io.connect();
var form = document.querySelector('form'); //this will get our content from the form area
var ul = document.querySelector('ul'); //potential to add the list of books with selector
var booklist = []; // booklist will have communial book list from all users. 


form.addEventListener('submit', function(event) {
    event.preventDefault();
    //querySelector gets the Letters we put into input
    var input = this.querySelector('input');
    var text = input.value;
    input.value = '';

    // document.getElementById("book_cover").outerHTML = "";
    //We're sent off to our socket('add') in index.js;
    socket.emit('add', text);
    return false;
});
//creates the table element


var counter = [];
socket.on('create', function(results) {
    var t = document.createElement('table');
    r = t.insertRow(0)
    document.getElementById("book_cover").innerHTML = "";
    for (var i = 0; i < results.length; i++) {
        counter.push(results[i]);
        if (counter.length > 10) {
            counter.shift();
        };
        if (i == results.length - 1) {
            for (var j = 0; j < counter.length; j++) {
                addElem(counter[j]);

                function addElem(elem) {
                    var c = r.insertCell(0);
                    c.innerHTML = "<input type='image' src=" + elem[0] + " width=80px, height=100px onClick='clic(this);' name=" + elem[1] + "><h5>" + elem[1] + "</h5><p>" + elem[2] + "</p>";
                    document.getElementById("book_cover").appendChild(t);
                }
            }
        }
    }
});

//Handles Incorrect or null inputs
socket.on('code_error', function() {
        alert("This Code Does Not Exist")
    })
    //When User clicks to add book. 
function clic(n) {
    var x = n.nextElementSibling.innerHTML;
    var i = n.src;
    var a = n.nextElementSibling.nextSibling.textContent;
    $.ajax({
        type: 'POST',
        url: 'pages/chosen',
        dataType: 'JSON',
        data: { 'image': i, 'title': x, 'author': a },
        success: function(data) {
            console.log("DATA:  ", data)
            window.location = data.redirect;
        }
    })

    // socket.emit('store', inventory);
};

function reQuest(r) {
    var x = r.id;
    var i = r.name;
    var info = [x, i];
    //html is created for display. 
    var t = document.createElement('table');
    r = t.insertRow(0);
    document.getElementById("book_request").innerHTML = "";
    var c = r.insertCell(0);
    c.innerHTML = "<h5>" + info[0] + "</h5><p>" + info[1] + "</p>";
    document.getElementById("book_request").appendChild(t);
    //Then book info is sent to pages/request..
    $.ajax({
        type: 'POST',
        url: 'pages/request',
        dataType: 'JSON',
        data: { 'author': info[1], 'title': info[0] },
        success: function(data) {
            console.log("DATA:  ", data)
            window.location = data.redirect;
        }
    })

    // });
};