const xhr = new XMLHttpRequest();
const currentAccessKey = localStorage.getItem('accessKey');
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + currentAccessKey;
const selectOperation = baseUrl + '&op=select';
const insertOperation = baseUrl + '&op=insert';
const updateOperation = baseUrl + '&op=update';
const deleteOperation = baseUrl + '&op=delete';
const maxAttemptsAllowed = 10;
let bookList = [];
let totalAttempts = 0;
let opacityDiv = document.getElementById('opacityCover');
opacityDiv.style.visibility = "hidden";

if (currentAccessKey == null) {
    GenerateNewAccessKey();
} else {
    DisplayAllBooks();
}

document.getElementById('submitBookButton').onclick = AddNewBook;
document.getElementById('registerNewUser').onclick = GenerateNewAccessKey;
document.getElementById('popUpCancelButton').onclick = (function () { opacityDiv.style.visibility = "hidden"; LoadDefaultState(); });
document.getElementById('logKey').onclick = DisplayKey;
document.getElementById('forceRefresh').onclick = (function () { location.reload() });

function IsInputDataValid(title, author) {
    if (title.length < 2 || author.length < 2) {
        alert("Invalid input: Both fields must be 2 characters or longer.");
        return false;
    } else if (IsTitleAndAuthorPresent(title, author) == true) {
        alert("Invalid input: That title and author combination already exists.");
        return false;
    } else if (IsInputDoubleWhiteSpace(title, author) == true) {
        alert("Two or more consequtive white spaces are not allowed.")
        return false;
    } else {
        return true;
    }
}

function IsTitleAndAuthorPresent(title, author) {
    for (let i = 0; i < bookList.length; i++) {
        if (bookList[i].title == title && bookList[i].author == author) {
            return true;
            break;
        } else {
            continue;
        }
        break;
    }
}

function IsInputDoubleWhiteSpace(title, author) {
    let titleStatus = true;
    let authorStatus = true;

    for (let i = 0; i < title.length - 1; i++) {
        if (title[i] == ' ' && title[i + 1] == ' ') {
            titleStatus = true;
            break;
        } else {
            titleStatus = false;
        }
        break;
    }

    for (let i = 0; i < author.length - 1; i++) {
        if (author[i] == ' ' && author[i + 1] == ' ') {
            authorStatus = true;
            break;
        } else {
            authorStatus = false;
        }
        break;
    }

    if (titleStatus == true || authorStatus == true) {
        return true;
    } else {
        return false;
    }
}

function OpenPopUpForm(id) {
    opacityDiv.style.visibility = "visible";
    HandlePopUpForm(id);
}

function HandlePopUpForm(id) {
    document.getElementById('popUpSubmitButton').onclick = function () {
        UpdateBook(id,
            document.getElementById('popUpTitleInput').value,
            document.getElementById('popUpAuthorInput').value
        )
    };
}

function AddNewBook() {
    const title = document.getElementById('bookTitleInput').value;
    const author = document.getElementById('bookAuthorInput').value;

    if (IsInputDataValid(title, author) == false) {
        return;
    } else {
        totalAttempts++;
        fetch(insertOperation + '&title=' + title + '&author=' + author)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success" && totalAttempts < maxAttemptsAllowed) {
                    HandleFailedRequest();
                    AddNewBook(title, author);
                } else if (jsonResponse.status != "success" && totalAttempts == maxAttemptsAllowed) {
                    HandleFailedRequest();
                } else {
                    HandleSuccessfulRequest();
                    DisplayAllBooks();
                }
            })
            .catch((error) => {
                return;
            });
    }
    document.getElementById('operationStatus').innerHTML = (`Book added successfully.`);
}

function DisplayAllBooks() {
    totalAttempts++;
    fetch(selectOperation)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status != "success" && totalAttempts < maxAttemptsAllowed) {
                HandleFailedRequest();
                DisplayAllBooks();
            } else if (jsonResponse.status != "success" && totalAttempts == maxAttemptsAllowed) {
                HandleFailedRequest();
                document.getElementById('operationStatus').innerHTML = (`Could not load booklist.<br>Refresh to try again.`);
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
                        <button class="updateButton" onclick="OpenPopUpForm(${item.id})">Update</button>
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
    totalAttempts++;
    fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status != "success" && totalAttempts < maxAttemptsAllowed) {
                HandleFailedRequest();
                GenerateNewAccessKey();
            } else if (jsonResponse.status != "success" && totalAttempts == maxAttemptsAllowed) {
                HandleFailedRequest();
            } else {
                HandleSuccessfulRequest();
                localStorage.setItem('accessKey', jsonResponse['key']);
                location.reload();
            }
            alert(`Successfully generated new access key!`);
        })
        .catch((error) => {
            return;
        });
}

function UpdateBook(id, title, author) {
    if (IsInputDataValid(title, author) == false) {
        location.reload();
    } else {
        totalAttempts++;
        fetch(updateOperation + '&id=' + id + '&title=' + title + '&author=' + author)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success" && totalAttempts < maxAttemptsAllowed) {
                    HandleFailedRequest();
                    UpdateBook(id, title, author);
                } else if (jsonResponse.status != "success" && totalAttempts == maxAttemptsAllowed) {
                    HandleFailedRequest();
                } else {
                    DisplayAllBooks();
                }
            })
            .catch((error) => {
                console.log(error);
            });
        opacityDiv.style.visibility = "hidden";
    }
    document.getElementById('operationStatus').innerHTML = (`Update operation successsful (book ID ${id})`);
}

function DeleteBook(id) {
    totalAttempts++;
    fetch(deleteOperation + '&id=' + id)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse.status != "success" && totalAttempts < maxAttemptsAllowed) {
                HandleFailedRequest();
                DeleteBook(id);
            } else if (jsonResponse.status != "success" && totalAttempts == maxAttemptsAllowed) {
                HandleFailedRequest();
            } else {
                HandleSuccessfulRequest();
                DisplayAllBooks();
            }
        })
        .catch((error) => {
            return;
        });
    document.getElementById('operationStatus').innerHTML = (`Book deleted successfully.`);
}

function DisplayKey() {
    alert("Current access key: " + currentAccessKey);
}

function HandleFailedRequest() {
    console.log(`Attempt #${totalAttempts}:`);
    console.log("There was an error in handling the request to the server.");

    if (totalAttempts == maxAttemptsAllowed) {
        console.log("Max number of connection attempts reached. Please try again later.");
        document.getElementById('operationStatus').innerHTML = (`Operation unsuccessful.<br>If the problem persists, force refresh the page.`);
        LoadDefaultState();
    }
}

function HandleSuccessfulRequest() {
    console.log(`Attempt #${totalAttempts}:`);
    console.log("Success!");
    console.log(`It took ${totalAttempts} attempts to complete the request.`);
    LoadDefaultState();
}

function LoadDefaultState() {
    console.log("Loading default state...");
    document.getElementById('bookTitleInput').value = '';
    document.getElementById('bookAuthorInput').value = '';
    document.getElementById('popUpTitleInput').value = '';
    document.getElementById('popUpAuthorInput').value = '';
    totalAttempts = 0;
}