
import axios from 'axios';
import { Item, NewItem, APIMessage } from "../types";
export const getStoreItems = async (): Promise<Item[]> => {
    try {
        const { data } = await axios.get("/api/items/");
        return (data as Item[]);
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const addNewItem = async (newItem: NewItem, JWTToken:string|undefined): Promise<APIMessage> => {
    try {
        await axios({
            method: 'post',
            url: "/api/items/add",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JWTToken
            },
            data: newItem
        });
        return {message: "Added sucessfully"}
    } catch (e:any) {
        if(e.response.status === 400) return {message: e.response.data}
        if(e.response.status === 401) return {message: "UnAuthroized"}
        return {message: "Internal Server Error"}
    }
}