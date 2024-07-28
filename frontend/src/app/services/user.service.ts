import axios from "axios";
import { toast } from "react-toastify";

export interface User  {
  id: string;
  accountId:string;
  name: string;
  email: string;
  isFriend?: boolean;
  image?: string | undefined;
};


const ACCOUNT_HOST_URL = "http://localhost:3001";

export async function getUsers(sessionToken:string): Promise<User[]> {
  try {
    const response = await axios({
      headers: { Authorization: `bearer ${sessionToken}` },
      baseURL: `${ACCOUNT_HOST_URL}/auth/users`,
      method: "get",
    });

    return response.data as User[];
  } catch (error) {
    console.error(error);
    toast.error("Failed to get friends. Check network tab for more info.");
    throw error;
  }
}
