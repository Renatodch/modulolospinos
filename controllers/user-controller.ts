import { Collection, User } from "@/collections/collections";
import DataAccess from "@/data-access/data-access";
import { Responses } from "@/utils/responses";
import { DocumentData, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, collection } from "firebase/firestore";

export default class UserController{
    private static instance:UserController;

    private constructor(){}
    public static getInstance():UserController{
        if(!UserController.instance){
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    /* public GetUsers=async(user_id?: string, type?: string):Promise<Array<Entity<User>>>=>{
        let Users: Array<Entity<User>> = new Array<Entity<User>>();
        let user : Entity<User> = new Entity<User>(new User(), "");
        let query;
        switch(type){
            case "0":
                query = DataAccess.getInstance().GetUserQuery("Type","<=",1);
            break;
            case "1":        
                query = DataAccess.getInstance().GetUserQuery("parent_id","==",user_id || ""); //parent_id
                user = await this.GetUser(user_id || "");
            break;
        }
        
        try {
            const docs =  await DataAccess.getInstance().GetUserDocs(query)
            docs.forEach((d:any)=>{
                Users.push(new Entity<User>((d.data() as User),d.id))
            })
            if(user._id != "")
                Users.push(user);
        } catch (e) {
            console.error("Error reading documents: ", e);
        }
        
        return Users;
    } */
    public GetUSer=async(_id:string):Promise<Collection<User>|undefined>=>{

        try{
            const doc = await this.GetUserSnapshot(_id);
            if(doc.exists()){
                let obj:Collection<User> = {
                    data:doc.data() as User,
                    _id:doc.id
                }
                return obj
            }
        }catch(e){
            console.error("Error reading documents: ", e);
        }
    }
    
   
    private GetUserSnapshot= async(_id:string):Promise<DocumentSnapshot<DocumentData>>=>{
        let docRef:DocumentReference<DocumentData> = DataAccess.getInstance().GetDocRef(DataAccess.usersCollection,_id)
        let snapshot = await DataAccess.getInstance().GetDocSnapShot(docRef);
        return snapshot;
    }

    
   /*  public SaveUser=async(body: Entity<User>, save:boolean = true):Promise<Response<User>>=>{
        let res:Response<User> = new Response<User>(new Entity<User>(new User(),"") , Responses.SERVER_ERROR);

        let obj:Entity<User> = {
            Data : _User(body.Data as User),
            _id: body._id || ""
        }
        
        const snapshot= await this.GetUserSnapshot(obj._id);
        
        if(!snapshot.exists() || !save){

            if(!save && snapshot.exists()){
                let user: User = snapshot.data() as User;   
                if(user.TelegramUserID != obj.Data.TelegramUserID){
                    obj.Data.ChatID="";
                    obj.Data.TelegramUserActive = false;
                }
            }

            try {
                await DataAccess.getInstance().SaveUser(obj)
                res.d.Data = obj.Data
                res.d._id = obj._id
                res.res = Responses.SUCCESS_SAVE;
            } catch (e) {
                console.log("Error: ",e)
            }

        }else{
            res.res = Responses.ALREADY_EXIST;
        }
        return res;
    }
 */
}