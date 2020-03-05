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
    DisplayAllBooks();
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
                console.log(`Success! Title: ${title}, Author: ${author}, Id: ${jsonResponse.id}`);
                DisplayAllBooks();
            } else {
                console.log("There was an error in your request");
            }
        });
}

function DisplayAllBooks() {
    fetch(selectOperation)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status != "success") {
                console.log("There was an error handling your request");
                DisplayAllBooks();
            } else {
                let bookList = jsonResponse['data'];
                let output = '';

                // The bookItem div does not have an ending, to allow for easy borders between objects.
                bookList.forEach(function (item) {
                    output += '<ul>' +
                        '<li> ID: ' + item.id + '</li>' +
                        '<li> Title: ' + item.title + '</li>' +
                        '<li> Author: ' + item.author + '</li>' +
                        '</ul>' +
                        `<div class="bookItem">
                            <button onclick="UpdateBook(${item.id})">Update</button>
                            <button onclick="DeleteBook(${item.id})">Delete</button>`;
                });
                document.getElementById('bookListDiv').innerHTML = output;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function GenerateNewAccessKey() {
    fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            localStorage.setItem('accessKey', jsonResponse['key']);
            location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
}

function UpdateBook(id) {
    title = document.getElementById('bookTitleInput').value;
    author = document.getElementById('bookAuthorInput').value;

    fetch(updateOperation + '&id=' + id + '&title=' + title + '&author=' + author)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status != "success") {
                console.log("There was an error handling your request");
                UpdateBook(id);
            } else {
                DisplayAllBooks();
            }
        });
}

function DeleteBook(id) {
    fetch(deleteOperation + '&id=' + id)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status != "success") {
                console.log("There was an error handling your request");
                DeleteBook(id);
            } else {
                DisplayAllBooks();
            }
        });
}

function DisplayKey() {
    console.log("Key: " + currentAccessKey);
    console.log(localStorage.getItem('accessKey'));
    console.log(localStorage);
}

// Får man använda <fieldset> istället?
// SVAR JA!

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