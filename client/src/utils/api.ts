
import axios from 'axios';
import { Item, NewItem, APIError } from "../types";
export const getStoreItems = async (): Promise<Item[]> => {
    try {
        const { data } = await axios.get("/api/items/");
        return (data as Item[]);
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const addNewItem = async (newItem: NewItem, JWTToken:string|undefined): Promise<NewItem | APIError> => {
    try {
        const { data } = await axios({
            method: 'post',
            url: "/api/items/add",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JWTToken
            },
            data: newItem
        });
        return (data as NewItem);
    } catch (e:any) {
        console.log(e);
        if(e.response.status === 400) return {message: "Incomplete request"}
        if(e.response.status === 401) return {message: "UnAuthroized"}
        return {message: "Internal Server Error"}
    }
}