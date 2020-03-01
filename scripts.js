const xhr = new XMLHttpRequest();
let accessKey = localStorage.getItem('accessKey');
let url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + accessKey;
let responseKey = '';

// EventListeners for buttons.
document.getElementById('submitBookButton').addEventListener('click', HandleInputFieldData);
document.getElementById('registerNewUser').addEventListener('click', GenerateNewAccessKey);


function HandleInputFieldData() {
    // add error checks here (such as is field empty, if checks pass, then call AddNewBook function)
    AddNewBook(document.getElementById('bookTitleInput').value,
        document.getElementById('bookAuthorInput').value)
}

function AddNewBook(bookTitleInput, bookAuthorInput) {
    if (document.getElementById('bookTitleInput') == "" || document.getElementById('bookAuthorInput') == "") {
        alert("The input is invalid, both fields must be filled.");
        return;
    }
    // else if (book title & author combination already exists) { alert("That title/author combination already exists.")}
    else {
        fetch();
    }
}

function DisplayAllBooks() {
    let output = '';

    for (let i in bookList) {
        output += '<ul>' +
            '<li> ID: ' + bookList[i].id + '</li>' +
            '<li> Title: ' + bookList[i].title + '</li>' +
            '<li> Author: ' + bookList[i].author + '</li>' +
            '</ul>';
    }

    document.getElementById('bookListDiv').innerHTML = output;
}


function GenerateNewAccessKey() {
    xhr.open("GET", "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey", true);
    xhr.onload = function () {
        if (this.status == 200)
            responseKey = JSON.parse(xhr.responseText).key;

        alert(responseKey);
    }
    xhr.send();
    localStorage.setItem('accessKey', responseKey);
}

//function GenerateNewAccessKey() {
//    fetch('https://raw.githubusercontent.com/SMAPPNYU/ProgrammerGroup/master/LargeDataSets/sample-tweet.raw.json')
//        .then((response) => {
//            console.log('got response');
//            return response.json();
//        })
//        .then((jsonResponse) => {
//            console.log('Pontus fint valda ord, numera censurerat!');
//            let bajs = jsonResponse['key'];
//            alert(bajs);
//        }).catch((error) => {
//            console.log('Failed');
//        });
//}

/* Create separate methods to:
Add Books (insert operation),
Get Existing Books (select operation),
Update Existing Book (update operation),
Delete Existing Book (delete operation)
*/






// window.addEventListener('load', function() {
//     let submitButton = document.getElementById('submitBookButton');
//     submitButton.addEventListener('click', function() {
//         
//     })
// 
// })


// https://www.w3schools.com/js/js_ajax_intro.asp