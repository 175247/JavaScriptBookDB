const xhr = new XMLHttpRequest();
const currentAccessKey = localStorage.getItem('accessKey');
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + currentAccessKey;
const selectOperation = baseUrl + '&op=select';
const insertOperation = baseUrl + '&op=insert';
const updateOperation = baseUrl + '&op=update';
const deleteOperation = baseUrl + '&op=delete';

if (currentAccessKey == null) {
    GenerateNewAccessKey();
} else {
    //DisplayAllBooks();
}

// EventListeners for buttons.
document.getElementById('submitBookButton').addEventListener('click', ValidateInputData);
document.getElementById('registerNewUser').addEventListener('click', GenerateNewAccessKey);


function ValidateInputData() {
    const title = document.getElementById('bookTitleInput').value;
    const author = document.getElementById('bookAuthorInput').value;

    // add error checks here (such as is field empty, if checks pass, then call AddNewBook function)
    //if (title.length < 2 || author.length < 2) {
    //    alert("The input is invalid, both fields must be filled.");
    //    return;
    //}
    // else if (book title & author combination already exists) { alert("That title/author combination already exists.")}
    // Else if all else is fine... Add the book.
    AddNewBook(title, author);

    

}

function AddNewBook(title, author) {
    fetch(insertOperation + '&title=' + title + '&author=' + author)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status == "success") {
                //console.log("Success");
                //console.log(`Success! Title: ${title}, Author: ${author}, Id: ${jsonResponse.id}`);
                //DisplayAllBooks(); <-- Use this one.

            } else {
                console.log("There was an error in your request");
            }
        });
}

//function GetBooks() {
//    fetch(selectOperation)
//        .then((response) => {
//            return response.json();
//        })
//        .then((jsonResponse) => {
//            const bookList = jsonResponse['data'];
//            DisplayAllBooks(bookList);
//        })
//}

//function DisplayAllBooks() {
//    fetch(selectOperation)
//        .then((response) => {
//            return response.json();
//        })
//        .then((jsonResponse) => {
//            return <div class="bookValue"></div> // Set all values and items the div must have, buttons and shit.
//            //const bookList = jsonResponse['data'];
//            //let output = '';
//            //
//            //for (let i in bookList) {
//            //    output += '<ul>' +
//            //        '<li> ID: ' + bookList[i].id + '</li>' +
//            //        '<li> Title: ' + bookList[i].title + '</li>' +
//            //        '<li> Author: ' + bookList[i].author + '</li>' +
//            //        '</ul>';
//            //}
//            //
//            //return document.getElementById('bookListDiv').innerHTML = output;
//        })
//}

function GenerateNewAccessKey() {
    fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            localStorage.setItem('accessKey', jsonResponse['key']);
            location.reload();
        }).catch((error) => {
            console.log(error);
        });
}

function DisplayKey() {
    console.log("Key: " + currentAccessKey);
    console.log(localStorage.getItem('accessKey'));
    console.log(localStorage);
}

// Får man använda <fieldset> istället?

/*
Syntax:

let key = currentAccessKey
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + key;
const viewRequest = baseUrl + '&op=select';


    op=insert
    key - an API key that identifies the request
    title - the book title
    author - the name of the author

Insert operation:
baseUrl + '&title=' + title + '&author=' + author
 */