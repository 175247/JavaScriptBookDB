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
    //    return false;
    //}
    //else if (book title & author combination already exists) { alert("That title/author combination already exists.")}
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
        totalAttempts++;

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
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        console.log("Aborting request.");
        totalAttempts = 0;
    }
}

function DisplayAllBooks() {
    if (totalAttempts < maxAttemptsAllowed) {
        totalAttempts++;

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
        console.log("Aborting request.");
        LoadDefaultState();
    }
}

function GenerateNewAccessKey() {
    if (totalAttempts < maxAttemptsAllowed) {
        totalAttempts++;

        fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    GenerateNewAccessKey();
                } else {
                    localStorage.setItem('accessKey', jsonResponse['key']);
                    location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        console.log("Aborting request.");
        LoadDefaultState();
    }
}

function UpdateBook(id, title, author) {
    console.log("Updating book in database");
    let thisId = id;
    let thisTitle = title;
    let thisAuthor = author;
    if (totalAttempts < maxAttemptsAllowed) {
        totalAttempts++;

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
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        LoadDefaultState();
    }
    opacityDiv.style.visibility = "hidden";
}

function DeleteBook(id) {
    console.log("Deleting book from database");

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
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        LoadDefaultState();
    }
}

function DisplayKey() {
    console.log("Key: " + currentAccessKey);
    console.log(localStorage.getItem('accessKey'));
    console.log(localStorage);
}

function HandleFailedRequest() {
    console.log(`Attempt #${totalAttempts}:`);
    console.log("There was an error in handling the request to the server.");

    if (totalAttempts == maxAttemptsAllowed) {
        console.log("Max number of connection attempts reached. Please try again later.");
    }
}

function HandleSuccessfulRequest() {
    console.log("Success!");
    console.log(`It took ${totalAttempts} attempts to complete the request.`);

    LoadDefaultState();
}

function LoadDefaultState() {
    console.log("Loading default state...");
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