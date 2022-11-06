
import axios, { AxiosError } from 'axios';
import { Item, NewItem, APIMessage, Order } from "../types";
export const getStoreItems = async (): Promise<Item[]> => {
    try {
        const { data } = await axios.get("/api/items/getall");
        return (data as Item[]);
    } catch (e) {
      
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

export const deleteItem = async (itemName: string, JWTToken:string|undefined): Promise<APIMessage> => {
    let data = {name: itemName}
    try {
        const response = await axios({
            method: 'delete',
            url: "/api/items/delete",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JWTToken
            },
            data: data
        });
        return {message: response.data}
    } catch (e:any) {
        if(e.response.status === 400) return {message: e.response.data}
        if(e.response.status === 401) return {message: "UnAuthroized"}
        return {message: "Internal Server Error"}
    }
}

export const s3Upload = async (formData:FormData, JWTToken:string|undefined):Promise<APIMessage> => {
    try{
      
            await axios.post("/api/items/s3-upload", formData , {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + JWTToken
                }
            });
            return {message: "images uploaded sucessfully"}
            

    }catch(e:any) {
        return {message: e.response.data}
    }
}

export const processPayment = async (order: Order): Promise<any> => {
    try {
        let response = await axios.post("/api/items/order", JSON.stringify(order), {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e:any) {
if(e.response.status === 404) {
    return {data: {unAvailableItems: e.response.data}, status: 404}
}
        return {message: e.response.data}
    }
}

export const sendConfirmationEmail = async (order: Order, paymentId:number): Promise<any> => {
    try {
        let postObject = {
            order: order,
            paymentId: paymentId
        }
        let response = await axios.post("/api/items/sendemail", JSON.stringify(postObject), {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e:any) {
        return {message: e.response.data}
    }
}