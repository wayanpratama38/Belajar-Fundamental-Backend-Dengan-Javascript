import { nanoid } from "nanoid";
import type { Book, InputBook } from "../../interface/interface";
import { updateBookById } from "../../api/books/handler";


export default class BookServices { 

    private _books : Book[];

    constructor(initialBooks : Book[] = []) {
        this._books = initialBooks;
    }

    addBook(input : InputBook) : Book {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const finished = input.pageCount === input.readPage;

        const newBook : Book = {
            id,
            ...input,
            finished,
            insertedAt,
            updatedAt
        };

        this._books.push(newBook);
        
        return newBook;
    }

    getAllBooks() : Book[] {
       return this._books;
    }

    getBookById(id : string) : Book | undefined {
        return this._books.find((book) => book.id === id);
    }

    editBookById(id:string, updateValue : Partial<InputBook>) : Book | null {
        const index = this._books.findIndex((book)=> book.id === id);
        if (index === -1 ) return null;

        const oldBook = this._books[index]!;
        const updatedAt = new Date().toISOString();
        const finished = (updateValue.readPage ?? oldBook.readPage) === (updateValue.pageCount ?? oldBook.pageCount);


        const updatedBook : Book = {
            ...oldBook,
            ...updateValue,
            id : oldBook.id,
            insertedAt : oldBook.insertedAt,
            finished,
            updatedAt
        }

        this._books[index] = updatedBook;
        return updatedBook;
    }

    deleteBookById(id:string) : void {
        const index = this._books.findIndex((book)=> book.id === id);
        if (index === -1 ){
            console.log("NO BOOK FOUNDED!")
        }
        
        this._books.slice(index,1);
    }

}