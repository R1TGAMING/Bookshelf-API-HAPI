const {nanoid} = require("nanoid")

const receiveData = []

const CreateBooks = (request, h) => {
  const id = nanoid()
  let finished = false
  const date = new Date().toISOString()

  
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  if (!name || name === undefined) {
    return h.response({
      "status": "fail",
    "message": "Gagal menambahkan buku. Mohon isi nama buku"
    }).code(400)
  } else {
  
  const books = {
    'id' : id,
    'name' : name,
    'year' : year,
    'author' : author,
    'summary' : summary,
    'publisher' : publisher,
    'pageCount' : pageCount,
    'readPage' : readPage,
    'finished' : finished,
    'reading' : reading,
    'insertedAt' : date,
    'updatedAt' : date
  }
    receiveData.push(books)

    
    if(readPage > pageCount) {
      return h.response({
        "status": "fail",
    "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
      }).code(400)
    }

    return h.response({
      "status": "success",
    "message": "Buku berhasil ditambahkan",
    "data": {
        "bookId": id
    }
    }).code(201)
  }
};

const ViewBooks = (request, h) => {
  const nameQuery = request.query.name
  const readingQuery = request.query.reading
  const findNameBooks = receiveData.find(book => book.name === nameQuery)
  
  

  
  
  if (nameQuery) {
    if(findNameBooks == undefined) {
      return h.response({
        "status": "fail",
        "message": "Buku tidak ditemukan"
      }).code(404)
    } else {
      return h.response({
        "status": "success",
        "data" : {
          "books" : findNameBooks
        }
      })
    }
  }
  
  
  const dataBooks = {
    "status": "success",
    "data": {
        "books": receiveData
      }
  }; 
  
  return h.response(dataBooks).code(200);
};

const SearchBooks = (request, h) => {
  const id = request.params.id;
  const dataBooks = receiveData.find((data) => {
    return data.id == id
  });

  if (dataBooks === undefined) {
    return h.response({
      "status": "fail",
    "message": "Buku tidak ditemukan"
    }).code(404)
  } else {
    return h.response({
      "status": "success",
    "data": {
        "book": dataBooks
          }
    });
    
  }
  
};

const ChangeBooks = (request, h) => {
  let finished = false
  const id = request.params.id;
  const dataBooks = receiveData.findIndex((data) => {
    return data.id === id
  });
  
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  if (dataBooks === -1) {
    return h.response({
      "status": "fail",
    "message": "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404)
  } else {
    if (pageCount === readPage) {
      finished = true
    } else {
      finished = false
    }

    if (!name || name === undefined) {
      return h.response({
        "status": "fail",
    "message": "Gagal memperbarui buku. Mohon isi nama buku"
      }).code(400)
    } else {

      /* const data = {
        'name' : name,
        'year' : year,
        'author' : author,
        'summary' : summary,
        'publisher' : publisher,
        'pageCount' : pageCount,
        'readPage' : readPage,
        'finished' : finished,
        'reading' : reading,
        'updatedAt' : new Date().toISOString()
      } */

      receiveData[dataBooks] = {id : receiveData[dataBooks].id, name, year, author, summary, publisher, pageCount, readPage, reading}
      
      if(readPage > pageCount) {
      return h.response({
        "status": "fail",
    "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      }).code(400)
      };

      return h.response({
       "status" : "success",
    "message": "Buku berhasil diperbarui"
      }).code(200)
    };
    
  };
};

const DeleteBooks = (request, h) => {
  const id = request.params.id;
  const dataBooks = receiveData.findIndex((data) => {
    return data.id === id
  });

  if (dataBooks === -1) {
    return h.response({
      "status": "fail",
    "message": "Buku gagal dihapus. Id tidak ditemukan"
    }).code(404)
  } else {

    receiveData.splice(dataBooks, 1)
    
    return h.response({
      "status": "success",
    "message": "Buku berhasil dihapus"
    });
  }
}



module.exports = {CreateBooks, ViewBooks, SearchBooks, ChangeBooks, DeleteBooks};