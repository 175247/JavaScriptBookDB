const xhr = new XMLHttpRequest();
const currentAccessKey = localStorage.getItem('accessKey');
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + currentAccessKey;
const selectOperation = baseUrl + '&op=select';
const insertOperation = baseUrl + '&op=insert';
const updateOperation = baseUrl + '&op=update';
const deleteOperation = baseUrl + '&op=delete';
const maxAttemptsAllowed = 10;
let bookList;
let totalAttempts = 0;
let opacityDiv = document.getElementById('opacityCover');
opacityDiv.style.visibility = "hidden";

if (currentAccessKey == null) {
    GenerateNewAccessKey();
} else {
    DisplayAllBooks();
}

// EventListeners for buttons.
document.getElementById('submitBookButton').addEventListener('click', AddNewBook);
document.getElementById('registerNewUser').addEventListener('click', GenerateNewAccessKey);
document.getElementById('popUpCancelButton').addEventListener('click', HidePopUpForm);

function ValidateInputData(title, author) {

    if (title.length < 2 || author.length < 2) {
        alert("Invalid input, both fields must be 2 characters or longer.");
        return false;
    }
 //   else if (TitleAndAuthorPresent(title, author) == true) {
 //       console.log("That title and author combination is already present.");
 //       return false;
    //   }
    else {
        return true;
    }
}

function TitleAndAuthorPresent(title, author) {
    for (let i = 0; i < bookList.length; i++) {
        if (bookList[i].title == title && bookList[i].author == author) {
            return true;
        } else {
            return false;
        }
    }
   
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

function AddNewBook() {
    const title = document.getElementById('bookTitleInput').value;
    const author = document.getElementById('bookAuthorInput').value;

    if (ValidateInputData(title, author) == false) {
        console.log("The validation check works! Wohoo!");
    } else {
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
        totalAttempts = 0;
    }
    totalAttempts = 0;
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
                    bookList = jsonResponse['data'];

                    bookList.sort(function (entry1, entry2) {
                        return entry1.id - entry2.id;
                    });

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
                    location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        location.reload();
        LoadDefaultState();
    }
    opacityDiv.style.visibility = "hidden";
    LoadDefaultState();
}

function DeleteBook(id) {
    if (totalAttempts < maxAttemptsAllowed) {
        totalAttempts++;

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
    alert("Current access key: " + currentAccessKey);
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






/*
 * Checking length of input works, 
 * but console prints amount of attempts when it shouldn't, when adding a book.
 * Also doesn't reset properly again when adding/deleting books.
 * Assume it has something to do with setting totalAttempts = 0; within the AddBook function (if/else/function scopes)...
 */