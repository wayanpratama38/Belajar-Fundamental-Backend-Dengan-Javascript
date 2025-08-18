import { nanoid } from "nanoid";
import type { AddBook,Book } from "../../interface/interface"

class BookServices { 
    books : Book[];

    constructor(books : Book[]) { 
        this.books = books;
    };


    addNote({ title, body, tags} : AddBook) { 
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newBook = {
            title, body, tags, id, createdAt, updatedAt
        };

        this.books.push(newBook);
    }
}