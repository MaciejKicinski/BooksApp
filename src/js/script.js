/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
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
      thisApp.favoriteBookCarts = [];
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
    },
    initActions() {
      const thisApp = this;
      const favBooks = thisApp.favoriteBookCarts;
      console.log(favBooks);

      for (let book of thisApp.dom.booksImages) {
        book.addEventListener('dblclick', function (event) {
          event.preventDefault();
          const bookId = book.getAttribute(select.book.bookId);
          favBooks.push(bookId);
          console.log(favBooks);
        });
      }
    }
  };

  class BookCart {

    constructor(data) {
      const thisBookCart = this;
      thisBookCart.data = data;
      thisBookCart.renderBookCart();
    }

    renderBookCart() {
      const thisBookCart = this;
      const generateHTML = templates.book(thisBookCart.data);
      thisBookCart.element = utils.createDOMFromHTML(generateHTML);
      const booksContainer = document.querySelector(select.containerOf.booksList);
      booksContainer.appendChild(thisBookCart.element);
    }

  }
  app.init();
}
