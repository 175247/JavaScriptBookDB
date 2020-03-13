const xhr = new XMLHttpRequest();
const currentAccessKey = localStorage.getItem('accessKey');
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + currentAccessKey;
const selectOperation = baseUrl + '&op=select';
const insertOperation = baseUrl + '&op=insert';
const updateOperation = baseUrl + '&op=update';
const deleteOperation = baseUrl + '&op=delete';
const maxAttemptsAllowed = 2;
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
        alert("Invalid input: Both fields must be 2 characters or longer.");
        return false;
    } else if (TitleAndAuthorPresent(title, author) == true) {
        alert("Invalid input: That title and author combination already exists.");
        return false;
    } else {
        return true;
    }
}

function TitleAndAuthorPresent(title, author) {

    const titleIndex = bookList.findIndex(bookTitle => bookTitle.title == title);
    const authorIndex = bookList.findIndex(bookAuthor => bookAuthor.author == author);

    if ((titleIndex >= 0 && authorIndex >= 0) &&
        (titleIndex == authorIndex)) {
        return true;
    } else {
        return false;
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
        return;
    } else {
        if (totalAttempts < maxAttemptsAllowed) {
            totalAttempts++;
            console.log(`Adding book to DB, attempt #${totalAttempts}`);


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
    //if (ValidateInputData(title, author) == false) {
    //    location.reload();
    //} else {
    //    HandleQuery(updateOperation + '&id=' + id + '&title=' + title + '&author=' + author);
    //    opacityDiv.style.visibility = "hidden";
    //    location.reload();
    //}

    if (ValidateInputData(title, author) == false) {
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
                    HandleSuccessfulRequest();
                    location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
        opacityDiv.style.visibility = "hidden";
    }
}

function DeleteBook(id) {
    //HandleQuery(deleteOperation + '&id=' + id);
    if (totalAttempts < maxAttemptsAllowed) {
        totalAttempts++;
        console.log(`Deleting book from DB, attempt #${totalAttempts}`);
        
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

function HandleQuery(query) {
    if (totalAttempts < maxAttemptsAllowed) {
        totalAttempts++;
        console.log(`Collective queryfunction... Attempt #${totalAttempts}`);

        fetch(query)
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (jsonResponse.status != "success") {
                    HandleFailedRequest();
                    HandleQuery(query);
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
    console.log("Within the HandleFailedRequest function");
    console.log(`Attempt #${totalAttempts}:`);
    console.log("There was an error in handling the request to the server.");

    if (totalAttempts == maxAttemptsAllowed) {
        console.log("Max number of connection attempts reached. Please try again later.");
        LoadDefaultState();
    }
}

function HandleSuccessfulRequest() {
    console.log("Within the HandleSuccessfulRequest method");
    console.log(`Attempt #${totalAttempts}:`);
    console.log("Success!");
    console.log(`It took ${totalAttempts} attempts to complete the request.`);

    LoadDefaultState();
}

function LoadDefaultState() {
    console.log("Loading default state...");
    document.getElementById('bookTitleInput').value = '';
    document.getElementById('bookAuthorInput').value = '';
    totalAttempts = 0;
    console.log(`Total attempts are now at ${totalAttempts}`);
}