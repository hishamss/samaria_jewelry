import axios from 'axios';
import { Item, NewItem } from "../types";

export const getStoreItems = async (): Promise<Item[]> => {
    try {
        const { data } = await axios.get("/api/items/");
        return (data as Item[]);
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const addNewItem = async (newItem: NewItem): Promise<NewItem | null> => {
    try {
        const { data } = await axios({
            method: 'post',
            url: "/api/items/add",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            data: newItem
        });
        return (data as NewItem);
    } catch (e) {
        console.log(e);
        return null;
    }
}