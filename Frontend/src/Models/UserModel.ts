import Roles from "./Roles";

class UserModel {
	public id: number;
    public firstName: string;
    public lastName: string;
    public username: string; 
    public password: string;
    public role: Roles;
    public isUserFollwing: boolean;
}

export default UserModel;
