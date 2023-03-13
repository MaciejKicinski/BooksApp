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

  const app = {
    initdata: function () {
      const thisApp = this;
      thisApp.data = dataSource;
      thisApp.favoriteBookCarts = new Set();
      thisApp.filters = new Set();
    },

    initBookCartsList: function () {
      const thisApp = this;

      for (let book in thisApp.data.books) {
        new BookCart(thisApp.data.books[book]);
      }
    },
    init: function () {
      const thisApp = this;

      thisApp.initdata();
      thisApp.initBookCartsList();

      thisApp.getElements();
      thisApp.initActions();

    },
    getElements() {
      const thisApp = this;
      thisApp.dom = {};
      thisApp.dom.booksContainer = document.querySelector(select.containerOf.booksList);
      thisApp.dom.booksImages = document.querySelectorAll(select.book.bookImage);
      thisApp.dom.filters = document.querySelector(select.containerOf.filters);
    },
    initActions() {
      const thisApp = this;
      const favBooks = thisApp.favoriteBookCarts;
      thisApp.dom.booksContainer.addEventListener('dblclick', function (event) {
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
      thisApp.dom.filters.addEventListener('click', function (event) {
        const element = event.target;
        console.log(element.value);
        if (element.type == 'checkbox') {
          const value = element.value;
          if (element.checked) {
            thisApp.filters.add(value);
          } else {
            thisApp.filters.delete(value);
          }
        }
        thisApp.filterBooks();
      });
    },
    filterBooks() {
      const thisBook = this;
      for (let book of dataSource.books) {
        const dataId = document.querySelector(select.book.bookImage + '[data-id = "' + book.id + '"]');
        let shouldBeHidden = false;
        for (let filter of thisBook.filters) {
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
    },
  };

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
  app.init();
}
