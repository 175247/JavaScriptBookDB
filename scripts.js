const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
let accessKey = localStorage.getItem('accessKey');
let url = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + accessKey;
let x = document.getElementById('registerNewUser');
x.onclick = GenerateNewAccessKey;

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

// Not asynchronous, we'll want to wait for this one.
function GenerateNewAccessKey() {
    fetch('https://raw.githubusercontent.com/SMAPPNYU/ProgrammerGroup/master/LargeDataSets/sample-tweet.raw.json')
        .then((response) => {
            console.log('got response');
            return response.json();
        })
        .then((jsonResponse) => {
            console.log('Pontus fint valda ord, numera censurerat!');
        }).catch((error) => {
            console.log('Failed');
        });
}

//function GenerateNewAccessKey() {
//    xhr.open("GET", "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey", false);
//    xhr.send();
//
//    // let key = JSON.parse(xhr.responseText).key;
//    let key = xhr.responseText.key;
//    alert(xhr.responseText);
//    localStorage.setItem('accessKey', key);
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