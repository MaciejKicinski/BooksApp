/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      books: '.books-list',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML)
  };

  const app = {
    initdata: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },

    initBooksList: function () {
      const thisApp = this;

      for (let book in thisApp.data.books) {
        new Book(thisApp.data.books[book]);
      }
    },
    init: function () {
      const thisApp = this;

      thisApp.initdata();
      thisApp.initBooksList();
    },
  };

  class Book {

    constructor(data) {
      const thisBook = this;
      thisBook.data = data;
      thisBook.renderBook();
    }

    renderBook() {
      const thisBook = this;
      const generateHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generateHTML);
      const booksContainer = document.querySelector(select.containerOf.books);
      booksContainer.appendChild(thisBook.element);
    }
  }
  app.init();
}
