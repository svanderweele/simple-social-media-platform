import axios from "axios";
import { toast } from "react-toastify";

export interface SessionData{
    accountId:string;
    userId:string;
    sessionToken:string;
}

export interface LoginRequest{
    username:string;
    password:string;
}
const ACCOUNT_HOST_URL = "http://localhost:3001";

export async function login(request: LoginRequest):Promise<SessionData>{
    try {
        const {username, password} = request;
        const response = await axios({
          baseURL: `${ACCOUNT_HOST_URL}/auth/login`,
          method: "post",
          data: {email:username, password}
        });
    
        return response.data as SessionData;
      } catch (error) {
        console.error(error);
        toast.error("Failed to get friends. Check network tab for more info.");
        throw error;
      }
} 


