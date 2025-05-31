
function Book (title, author, no_pages, has_read) {
    if(!new.target) {
        throw Error('You need to initialise this constructor with "new" first!');
    }
    this.uuid = `b${self.crypto.randomUUID()}`;
    this.title = title;
    this.author = author;
    this.noPages = no_pages;
    this.hasRead = has_read;
}

function addBookToLibrary(book, library) {
    library.push(book);
}

function createNewCard(card_container, book) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', book.uuid);

    const accent = document.createElement('div');
    accent.classList.add('accent');
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    
    const bookIcon = document.createElement('img');
    bookIcon.src = "images/book-closed.svg";
    bookIcon.alt = "closed book icon";
    bookIcon.width = 30;
    bookIcon.height = 30;
    
    const bookName = document.createElement('h4');
    bookName.classList.add('book-name');
    bookName.innerText = book.title;
    
    const bookAuthor = document.createElement('h4');
    bookAuthor.classList.add('book-author');
    bookAuthor.innerText = book.author;
    
    const noPages = document.createElement('p');
    noPages.classList.add('no-pages');
    noPages.innerText = `Number of Pages: ${book.noPages}`;
    
    const hasRead = document.createElement('p');
    hasRead.classList.add('has-read');
    hasRead.innerText = book.hasRead ? 'Has Read' : 'Has Not Read';

    const delBookButton = document.createElement('button');
    delBookButton.classList.add('delete-book');
    delBookButton.setAttribute('data-target-id', book.uuid);
    delBookButton.innerText = 'Delete';

    const hasReadButton = document.createElement('button');
    if(!book.hasRead) {
        hasReadButton.classList.add('read-book');
        hasReadButton.setAttribute('data-target-id', book.uuid);
        hasReadButton.innerText = 'I have read this!';
    }
    
    //fill the card with contents
    
    cardHeader.append(bookIcon);
    cardHeader.append(bookName);
    cardHeader.append(bookAuthor);
    card.append(accent);
    card.append(cardHeader);
    card.append(noPages);
    card.append(hasRead);
    card.append(delBookButton);

    if(hasReadButton.classList.contains('read-book')) {
        card.append(hasReadButton);
    }
    
    // Add the card
    card_container.append(card);
}

function getBookInformation() {
    const titleInput = document.querySelector('#title-input');
    const authorInput = document.querySelector('#author-input');
    const noPagesInput = document.querySelector('#no-pages-input');
    const hasReadInput = document.querySelector('#has-read-input');
    
    return {
        'title': titleInput.value,
        'author': authorInput.value,
        'noPages': noPagesInput.value,
        'hasReadInput': hasReadInput.checked
    }
}

function clearInputs() {
    const titleInput = document.querySelector('#title-input');
    const authorInput = document.querySelector('#author-input');
    const noPagesInput = document.querySelector('#no-pages-input');
    const hasReadInput = document.querySelector('#has-read-input');

    const inputArr = [titleInput, authorInput, noPagesInput, hasReadInput];
    inputArr.forEach((input) => {
        if(input.type == 'checkbox') {
            hasReadInput.checked = false;
        }else {
            input.value = '';
        }
    });
}




function deleteBookFromLibrary(library_arr, target_id) {
    const targetBook = document.querySelector(`#${target_id}`);
    targetBook.remove();
    library_arr = library_arr.filter((element) => {
        return element.uuid != target_id;
    });
    return library_arr;
}

function updateBookToRead(library_arr, target_id) { 
    const targetBook = document.querySelector(`#${target_id}`);
    let readBookStatus = targetBook.querySelector('.has-read');
    readBookStatus.innerText = 'Has Read';
    library_arr.forEach((book) => {
        if(book.uuid == targetBook.id) book.hasRead = true;
    });

    //remove the button
    const readBookButton = targetBook.querySelector('.read-book');
    readBookButton.remove();
    return library_arr;
}

let library = []
const cardContainer = document.querySelector(".card-container");
const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".add-book");
const closeButton = document.querySelector("dialog button");
const newBookButton = document.querySelector("button[type=submit]");

cardContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains('delete-book')) {
        //delete the book
        let targetId = event.target.getAttribute('data-target-id');
        library = deleteBookFromLibrary(library, targetId);
    }

    if(event.target.classList.contains('read-book')) {
        //set the book to read
        let targetId = event.target.getAttribute('data-target-id');
        library = updateBookToRead(library, targetId);
    }
});

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
    clearInputs();
    dialog.close();
});

newBookButton.addEventListener('click', (event) => {
    event.preventDefault();
    const bookInfo = getBookInformation();
    const newBook = new Book(bookInfo.title, 
                             bookInfo.author, 
                             bookInfo.noPages, 
                             bookInfo.hasReadInput);
    addBookToLibrary(newBook, library);
    createNewCard(cardContainer, newBook, library);
    clearInputs();
    console.log(library);
    dialog.close();
});

// Example data
const exampleBooks = [
    new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true),
    new Book("1984", "George Orwell", 328, false),
    new Book("To Kill a Mockingbird", "Harper Lee", 281, true)
];

// Add each example book to the library and create its card
exampleBooks.forEach(book => {
    addBookToLibrary(book, library);
    createNewCard(cardContainer, book, library);
});





