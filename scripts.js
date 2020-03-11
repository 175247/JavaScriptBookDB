const xhr = new XMLHttpRequest();
const currentAccessKey = localStorage.getItem('accessKey');
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + currentAccessKey;
const selectOperation = baseUrl + '&op=select';
const insertOperation = baseUrl + '&op=insert';
const updateOperation = baseUrl + '&op=update';
const deleteOperation = baseUrl + '&op=delete';
const maxAttemptsAllowed = 10;
let totalAttempts = 0;
let opacityDiv = document.getElementById('opacityCover');
opacityDiv.style.visibility = "hidden";

if (currentAccessKey == null) {
    GenerateNewAccessKey();
} else {
    DisplayAllBooks();
}

// EventListeners for buttons.
document.getElementById('submitBookButton').addEventListener('click', ValidateInputData);
document.getElementById('registerNewUser').addEventListener('click', GenerateNewAccessKey);
document.getElementById('popUpCancelButton').addEventListener('click', HidePopUpForm);

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

function OpenPopUpForm(id) {
    opacityDiv.style.visibility = "visible";
    HandlePopUpForm(id);
}

function HidePopUpForm() {
    opacityDiv.style.visibility = "hidden";
}

function HandlePopUpForm(id) {
    document.getElementById('popUpSubmitButton').addEventListener('click',
        function () {
            UpdateBook(id,
                document.getElementById('popUpTitleInput').value,
                document.getElementById('popUpAuthorInput').value
            )
        });

    document.getElementById('popUpTitleInput').value = null;
    document.getElementById('popUpAuthorInput').value = null;
}

function AddNewBook(title, author) {
    if (totalAttempts < maxAttemptsAllowed) {
        fetch(insertOperation + '&title=' + title + '&author=' + author)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    AddNewBook(title, author);
                } else {
                    HandleSuccessfulRequest();
                    DisplayAllBooks();
                }
            });
    } else {
        HandleFailedRequest();
    }
}

function DisplayAllBooks() {
    if (totalAttempts < maxAttemptsAllowed) {
        fetch(selectOperation)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    DisplayAllBooks();
                } else {
                    HandleSuccessfulRequest();
                    let bookList = jsonResponse['data'];
                    let output = '';

                    bookList.forEach(function (item) {
                        output += '<ul>' +
                            '<li> ID: ' + item.id + '</li>' +
                            '<li> Title: ' + item.title + '</li>' +
                            '<li> Author: ' + item.author + '</li>' +
                            '</ul>' +
                            `<div class="bookItem">
                            <button onclick="OpenPopUpForm(${item.id})">Update</button>
                            <button onclick="DeleteBook(${item.id})">Delete</button>`;
                    });
                    document.getElementById('bookListDiv').innerHTML = output;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        HandleFailedRequest();
    }
}

function GenerateNewAccessKey() {
    if (totalAttempts < maxAttemptsAllowed) {
        fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    GenerateNewAccessKey();
                } else {
                    HandleSuccessfulRequest();
                    localStorage.setItem('accessKey', jsonResponse['key']);
                    location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        HandleFailedRequest();
    }
}

function UpdateBook(id, title, author) {
    let thisId = id;
    let thisTitle = title;
    let thisAuthor = author;
    if (totalAttempts < maxAttemptsAllowed) {

        console.log(id, title, author);
        fetch(updateOperation + '&id=' + id + '&title=' + title + '&author=' + author)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    UpdateBook(id, title, author);
                } else {
                    HandleSuccessfulRequest();
                    DisplayAllBooks();
                }
            });
    } else {
        HandleFailedRequest();
    }
    opacityDiv.style.visibility = "hidden";
}

function DeleteBook(id) {
    if (totalAttempts < maxAttemptsAllowed) {
        fetch(deleteOperation + '&id=' + id)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    DeleteBook(id);
                } else {
                    HandleSuccessfulRequest();
                    DisplayAllBooks();
                }
            });
    } else {
        HandleFailedRequest();
    }
}

function DisplayKey() {
    console.log("Key: " + currentAccessKey);
    console.log(localStorage.getItem('accessKey'));
    console.log(localStorage);
}

function HandleFailedRequest() {
    totalAttempts++;
    console.log(`Attempt #${totalAttempts}:`);
    console.log("There was an error in handling the request to the server.");
    if (totalAttempts == maxAttemptsAllowed) {
        console.log("Max number of connection attempts reached. Please try again later.");
    }
}

function HandleSuccessfulRequest() {
    console.log("Success!");
    console.log(`It took ${totalAttempts} attempts to complete the request.`);
    document.getElementById('bookTitleInput').value = '';
    document.getElementById('bookAuthorInput').value = '';
    totalAttempts = 0;
}

// Får man använda <fieldset> istället?
// SVAR JA!


/*
 * 
 */


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