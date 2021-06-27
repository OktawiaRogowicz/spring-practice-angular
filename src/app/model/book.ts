export class Book {
    public id: number | undefined;
    public title!: string;
    public author!: string;
    public publishingHouse!: string;
    public translator!: string;
    public releaseYear!: number;
    public profileImageUrl!: string;

    constructor() {
        this.id = 0;
        this.title = '';
        this.author = '';
        this.publishingHouse = '';
        this.translator = '';
        this.releaseYear = 0;
    }

}