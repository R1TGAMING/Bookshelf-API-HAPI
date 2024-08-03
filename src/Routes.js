const { CreateBooks, ViewBooks, SearchBooks, ChangeBooks, DeleteBooks } = require("./Handler")

const routes = [
  {
    method : "POST",
    path : "/books",
    handler : CreateBooks
  },
  {
    method : "GET",
    path : "/books",
    handler : ViewBooks
  },
  {
    method : "GET",
    path : "/books/{id}",
    handler : SearchBooks
  },
  {
    method : "PUT",
    path : "/books/{id}",
    handler : ChangeBooks
  },
  {
    method : "DELETE",
    path : "/books/{id}",
    handler : DeleteBooks
  },
]

module.exports = routes;