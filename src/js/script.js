/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',

    },
    book: {
      bookId: 'data-id',
      bookImage: '.book__image',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML)
  };

  class BooksList {
    constructor() {
      const thisBookList = this;
      thisBookList.initdata();
      thisBookList.initBookCartsList();
      thisBookList.getElements();
      thisBookList.initActions();
    }

    initdata() {
      const thisBookList = this;
      thisBookList.data = dataSource;
      thisBookList.favoriteBookCarts = new Set();
      thisBookList.filters = new Set();
    }

    initBookCartsList() {
      const thisBookList = this;

      for (let book in thisBookList.data.books) {
        new BookCart(thisBookList.data.books[book]);
      }
    }

    getElements() {
      const thisBookList = this;
      thisBookList.dom = {};
      thisBookList.dom.booksContainer = document.querySelector(select.containerOf.booksList);
      thisBookList.dom.booksImages = document.querySelectorAll(select.book.bookImage);
      thisBookList.dom.filters = document.querySelector(select.containerOf.filters);
    }

    initActions() {
      const thisBookList = this;
      const favBooks = thisBookList.favoriteBookCarts;
      thisBookList.dom.booksContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const element = event.target.offsetParent;
        const bookId = element.getAttribute(select.book.bookId);
        if (favBooks.has(bookId)) {
          element.classList.remove('favorite');
          favBooks.delete(bookId);
        } else {
          element.classList.add('favorite');
          favBooks.add(bookId);
        }
        console.log(favBooks);
      });
      thisBookList.dom.filters.addEventListener('click', function (event) {
        const element = event.target;
        console.log(element.value);
        if (element.type == 'checkbox') {
          const value = element.value;
          if (element.checked) {
            thisBookList.filters.add(value);
          } else {
            thisBookList.filters.delete(value);
          }
        }
        thisBookList.filterBooks();
      });
    }

    filterBooks() {
      const thisBookList = this;
      for (let book of dataSource.books) {
        const dataId = document.querySelector(select.book.bookImage + '[data-id = "' + book.id + '"]');
        let shouldBeHidden = false;
        for (let filter of thisBookList.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          dataId.classList.add('hidden');
        } else {
          dataId.classList.remove('hidden');
        }
      }
    }
  }

  class BookCart {

    constructor(data) {
      const thisBookCart = this;
      thisBookCart.data = data;
      thisBookCart.renderBookCart();
    }

    renderBookCart() {
      const thisBookCart = this;
      thisBookCart.data.ratingBgc = thisBookCart.determineRatingBgc(thisBookCart.data.rating);
      thisBookCart.data.ratingWidth = thisBookCart.data.rating * 10;
      const generateHTML = templates.book(thisBookCart.data);
      thisBookCart.element = utils.createDOMFromHTML(generateHTML);
      const booksContainer = document.querySelector(select.containerOf.booksList);
      booksContainer.appendChild(thisBookCart.element);
    }
    determineRatingBgc(rating) {
      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
  }
  new BooksList();
}
