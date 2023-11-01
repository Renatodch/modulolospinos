import { User, Course, Collection } from "../collections/collections";
import { db } from "./config"
import {collection,addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, writeBatch,
DocumentReference, query,where, DocumentData, DocumentSnapshot, Query, QueryDocumentSnapshot, WhereFilterOp, orderBy, limit, runTransaction, Timestamp, getDocsFromServer} from "firebase/firestore";
import { Responses } from "../utils/responses";


export default class DataAccess{
    private static instance: DataAccess;
    public static usersCollection: string = "users";
    public static coursesCollection:string = "courses";

    private constructor(){
    }
    public static getInstance():DataAccess{
        if(!DataAccess.instance){
            DataAccess.instance = new DataAccess();
        }
        return DataAccess.instance
    }

    public GetDocRef = (collection:string, _id:string):DocumentReference<DocumentData>=>{
        return doc(db, collection, _id==""?"new_id":_id);
    }
    public GetDocSnapShot = async(docRef:DocumentReference<DocumentData>):Promise<DocumentSnapshot<DocumentData>>=>{
        let doc:any;
        try {
            doc = await getDoc(docRef);   
        } catch (e) {
            console.log("Error: ",e);
        }
        return doc;
    }

    public GetQuery2 =(collectionName:string, field:string,cond:string, value:string,field2:string,cond2:string, value2:string):Query<DocumentData>=>{
        return query(collection(db,collectionName)
        ,where(field,cond as WhereFilterOp,value)
        ,where(field2,cond2 as WhereFilterOp,value2))
    }

    public GetQueryOrderByLimit = (collectionName:string, field:string,cond:string, value:string, orderby:string, lim:number):Query<DocumentData>=>{
        return query(collection(db,collectionName)
        ,where(field, cond as WhereFilterOp, value)
        ,orderBy(orderby)
        ,limit(lim))
    } 
    
    public GetQuery =(collectionName:string,field:string,cond:string, value:any):Query<DocumentData>=>{
        return query(collection(db,collectionName),where(field,cond as WhereFilterOp,value)) 
    }
    
    public GetDocs = async(collectionName:string,query?: Query<DocumentData>):Promise<QueryDocumentSnapshot<DocumentData>[]>=>{
        let docs:any;
        try {
            docs = (await getDocs(!query ? collection(db,collectionName) : query))?.docs          
        } catch (e) {
            console.log("Error: ",e);
        }
        return docs;
    }
    public batchDelete = async (docs: QueryDocumentSnapshot<DocumentData>[])=>{
        const batch = writeBatch(db);
        docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }


    public Save = async<T extends {[x:string]:any}>(collectionName:string,collection:Collection<T>)=>{
        try {
            await setDoc(doc(db,collectionName,collection._id),collection.data)
        } catch (e) {
            console.log("Error: ",e)   
        }
    }
    /* public Save = async(collectionName:string,data:any):Promise<string>=>{
        let id:string = "";
        try {
            id = (await addDoc(collection(db,collectionName),data))?.id;   
        } catch (e) {
            console.log("Error: ",e)
        }
        return id;
    } */
    public Delete = async(collectionName:string,_id:string):Promise<boolean>=>{
        let res:boolean = false;
        try{
            await deleteDoc(doc(db, collectionName, _id));
            res = true;
        }catch(e){
            console.log("Error: ",e)
        }
        return res;
    }
    public Update = async<T extends {[x:string]:any}>(collectionName:string, data:T,id:string)=>{
        try {
            await setDoc(doc(db, collectionName, id), data)    
        } catch (e) {
            console.log("Error: ",e)
        }
    }
}