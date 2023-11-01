export interface User{
    fullname:string;
    id:string;
    password:string;
    type:string;
}

export interface Course{
    fullname:string;
    id:string;
    password:string;
}

export interface Collection<T>{
    data:T,
    _id:string,
}