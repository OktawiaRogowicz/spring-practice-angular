export class User {
    public id: number | undefined;
    public name: string;
    public surname: string;
    public email: string;
    public logInDateDisplay: Date | undefined;
    public joinDate: Date | undefined;
    public profileImageUrl: string | undefined;
    public active: boolean;
    public notLocked: boolean;
    public role: string;
    public authorities: [];


    constructor() {
        this.name = '';
        this.surname = '';
        this.email = '';
        this.active = false;
        this.notLocked = false;
        this.role = '';
        this.authorities = [];

    }

}