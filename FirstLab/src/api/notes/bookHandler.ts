import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import BookServices from "../../services/inMemory/booksService";
import type { InputBook } from "../../interface/interface";

export default class BookHandler {
    private _service : BookServices 
    constructor (service : BookServices) {
        this._service = service

        this.postBookHandler = this.postBookHandler.bind(this);
        this.getBooksHandler = this.getBooksHandler.bind(this);
        this.getBookByIdHandler = this.getBookByIdHandler.bind(this);
        this.putBookByIdHandler = this.putBookByIdHandler.bind(this);
        this.deleteBookByIdHandler = this.deleteBookByIdHandler.bind(this);

    }

    postBookHandler(request : Request, h : ResponseToolkit) : ResponseObject{
        try{
            const {name="untitled",year,author,summary,publisher,pageCount,readPage,reading} = request.payload as InputBook;
        
            const newBook = this._service.addBook({
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            })
    
    
            return h.response({
                status : "success",
                message : "Book added successfully",
                data : {bookId : newBook.id}
            }).code(201)
        } catch (error:any) {
            return h.response({
                status : 'fail',
                message : error.message
            }).code(400)
        }   
    }

    getBooksHandler(request  : Request, h :ResponseToolkit) : ResponseObject {
        try {
            const books = this._service.getAllBooks();
            return h.response({
                status : "success",
                data : {
                    books
                }
            }).code(201)
        } catch (error : any) {
            return h.response({
                status : 'fail',
                message : error.message
            }).code(400)
        }
    }

    getBookByIdHandler(request : Request, h : ResponseToolkit) : ResponseObject {
        try {
            const {id} = request.params;
            const book = this._service.getBookById(id);
            return h.response({
                status: 'success',
                data : {
                    book
                }
            }).code(201)
        } catch (error : any) {
            return h.response({
                status : 'fail',
                message : error.message
            }).code(404)
        }
    }

    putBookByIdHandler(request: Request, h: ResponseToolkit) : ResponseObject {
        try {
            const {id} = request.params;
            const payload = request.payload as Partial<InputBook>;

            const updatedBook = this._service.editBookById(id,payload);
            return h.response({
                status : "success",
                message : "Book updated successfully",
                data : {
                    book : updatedBook
                }
            }).code(200)
        } catch (error: any) {
            return h.response({
                status : "fail",
                messaage : error.message
            }).code(404)
        }
    }

    deleteBookByIdHandler(request : Request, h : ResponseToolkit) : ResponseObject {
        try {
            const {id} = request.params
            this._service.deleteBookById(id);
            return h.response({
                status : "success",
                message : "Book deleted successfully"
            }).code(200);
        } catch (error : any) {
            return h.response({
                status : "fail",
                message : error.message
            }).code(404);
        }
    }
}