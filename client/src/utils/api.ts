import axios from 'axios';
import { Item } from "../types";

export const getStoreItems = async () : Promise<Item[]>  => {
    try {
        const { data } = await axios.get("/api/items/");
        return (data as Item[]);
    } catch (e) {
        console.log(e);
        return [];
    }
}