'use strict'

const Server = require('../server')
const Chai = require('chai')
const assert = Chai.assert
let expect = Chai.expect;

let bookId = '79924890-a59c-11e6-abf2-c90dce32787e';
let newBookId ;

describe('GET /books', () => {
    it('it should GET all books', (done) => {
    
        let options = {
          method: 'GET',
          url: '/books'
        };

        Server.inject(options, (response) => {
          expect(response).to.have.property('statusCode', 200);
          done();
        });
     
   });
  
  it('it should GET a books given the id', (done) => {
    
        let options = {
          method: 'GET',
          url: '/books/'+bookId
        };

        Server.inject(options, (response) => {
          //console.log('result ==>',response.result);
          expect(response).to.have.property('statusCode', 200);
          expect(response).to.have.property('result');
          done();
        });
     
   });
  
    it('it should not GET a books given the id', (done) => {
    
        let options = {
          method: 'GET',
          url: '/books/0d4ce6988664'
        };

        Server.inject(options, (response) => {
          expect(response).to.have.property('statusCode', 404);
          expect(response).to.have.property('result');
          expect(response.result).to.have.property('statusCode', 404);
          expect(response.result).to.have.property('error', 'Not Found');
          done();
        });
     
   });
  
})

describe('POST /books', () => {
    it('it should POST a books', (done) => {
    
        let options = {
          method: 'POST',
          url: '/books',
		  payload: {
		      title: 'Chemistry & Bio',
			    author: 'Vasim Akram',
			    isbn: 1222
		  }
        };

        Server.inject(options, (response) => {
          //console.log('result ==>',response.result._id);
          newBookId = response.result._id;
          expect(response).to.have.property('statusCode', 201);
          expect(response).to.have.property('result');
          expect(response.result).to.have.property('_id');
          expect(response.result).to.have.property('isbn', 1222);
          done();
        });
     
   });
})

describe('PUT/:id books', () => {
    it('it should UPDATE a books given the id', (done) => {
    
        let options = {
          method: 'PUT',
          url: '/books/'+newBookId,
		  payload: {
		      title: 'Ramesh & Bio',
			    author: 'Vasim Akram',
			    isbn: 1222
		  }
        };

        Server.inject(options, (response) => {
          //console.log('result ==>',response.result);
          expect(response).to.have.property('statusCode', 200);
          expect(response).to.have.property('result');
          expect(response.result).to.have.property('ok',1);
          //expect(response.result).to.have.property('isbn', 1222);
          done();
        });
     
   });
})

  describe('DELETE/:id books', () => {
    
    it('it should not DELETE a books without id', (done) => {
    
        let options = {
          method: 'DELETE',
          url: '/books/'
        };

        Server.inject(options, (response) => {
          //console.log('result ==>',response.result);
          expect(response).to.have.property('statusCode', 404);
          expect(response).to.have.property('result');
          //expect(response.result).to.have.property('statusCode', 404);
          //expect(response.result).to.have.property('error', 'Bad Request');
          //expect(response.result).to.have.property('message', 'child "id" fails because ["id" is required]');
          done();
        });
     
   });
    
    it('it should DELETE a books given the id', (done) => {
    
        let options = {
          method: 'DELETE',
          url: '/books/'+newBookId
        };

        Server.inject(options, (response) => {
          expect(response).to.have.property('statusCode', 204);
          expect(response).to.have.property('result');
          //expect(response.result).to.be.empty;
          done();
        });
     
   });
})	
