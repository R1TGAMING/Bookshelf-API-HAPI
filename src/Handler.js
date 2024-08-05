const {nanoid} = require("nanoid")

// Untuk menampung data buku
const receiveData = []

// Membuat sebuah buku
const CreateBooks = (request, h) => {
  //kumpulan variable untuk dikirim ke client
  const id = nanoid()
  let finished = false
  const date = new Date().toISOString()


  // sebuah models untuk menampung data buku
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

  // Perkondisian jika pageCount dan readPage sama maka set nilai finished menjadi true kalau salah false
  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  // Mengecek apakah client memberikan sebuah nama pada buku
  if (!name || name === undefined) {
    return h.response({
      "status": "fail",
    "message": "Gagal menambahkan buku. Mohon isi nama buku"
    }).code(400)
  } else {
   // Kalau client memberikan nama buku maka akan menambahkan data buku ke dalam array receiveData
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
    

    // Mengecek apakah readPage lebih besar dari pageCount
    if(readPage > pageCount) {
      return h.response({
        "status": "fail",
    "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
      }).code(400)
    } else {
      
    receiveData.push(books)
      
    return h.response({
      "status": "success",
    "message": "Buku berhasil ditambahkan",
    "data": {
        "bookId": id
    }
    }).code(201)
    
  }
  }
};

// Untuk melihat buku sebuah buku
const ViewBooks = (request, h) => {

  // Membuat sebuah query bernama finished untuk melihat buku yang sudah selesai dilihat
  const finishedQuery = request.query.finished

  const filterFinishedData = receiveData.filter(data => {
    if (finishedQuery === '0') {
     return data.finished === false
    } else if (finishedQuery === '1') {
      return data.finished === true
    } else {
      return true;
    }
  })

  if (finishedQuery) {
   if (filterFinishedData.length === 0) {
     return h.response({
      "status": "fail",
    "message": "Buku tidak ditemukan"
    }).code(404)
   }
    
     return h.response({
       "status": "success",
    "data": {
        "books": filterFinishedData
    }
     }).code(200)
  }

  // Membuat sebuah query bernama reading untuk melihat buku yang sedang dibaca
  const readingQuery = request.query.reading
  
  const filterReadingData = receiveData.filter(data => {
    if (readingQuery === '0') {
     return data.reading === false
    } else if (readingQuery === '1') {
      return data.reading === true
    } else {
      return true;
    }
  })
  
  if (readingQuery) {
   if (filterReadingData.length === 0) {
     return h.response({
      "status": "fail",
    "message": "Buku tidak ditemukan"
    }).code(404)
   }
    
     return h.response({
       "status": "success",
    "data": {
        "books": filterReadingData
    }
     }).code(200)
  }
  
  // Untuk mencari sebuah buku dengan query name
  const nameQuery = request.query.name
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
      }).code(200)
    }
  }

  const getAllBooks = receiveData.map(({id, name, publisher}) => ({id, name, publisher}))
  // Untuk menampilkan semua buku
  const dataBooks = {
    "status": "success",
    "data": {
        "books": getAllBooks
      }
  }; 
  
  return h.response(dataBooks).code(200);
};

// Untuk mencari sebuah buku dengan id
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

// Untuk mengganti buku dengan id
const ChangeBooks = (request, h) => {
  // Mengambil value params lalu mencari index dari data receieveData
  let finished = false
  const id = request.params.id;
  const dataBooks = receiveData.findIndex((data) => {
    return data.id === id
  });

  // Models untuk mengganti sebuah buku
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

  // Mengecek apakah id sebuah buku ada atau tidak
  if (dataBooks === -1) {
    return h.response({
      "status": "fail",
    "message": "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404)
  } else {
    // Jika pageCount dan readPage sama maka finished true jika salah false
    if (pageCount === readPage) {
      finished = true
    } else {
      finished = false
    }

    // Jika name tidak kosong maka akan mengganti nama buku
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

      // Data dari receiveData akan dinggantikan dengan yang baru
      receiveData[dataBooks] = {id : receiveData[dataBooks].id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt : receiveData[dataBooks].insertedAt, updatedAt : new Date().toISOString()}

      // Mengecek apakah readPage lebih besar dari pageCount
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

// Untuk menghapus data sebuah buku
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


// Mengexports function
module.exports = {CreateBooks, ViewBooks, SearchBooks, ChangeBooks, DeleteBooks};