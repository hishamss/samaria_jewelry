export interface Item {
    id: number,
    name: string,
    type:string,
    description: string,
    price: number,
    numOfOtherImage: number,
    sizes: ItemSize[]
}

export interface ItemSize {
    id:number,
    itemId: number,
    size: string,
    quantity:number
}


export interface CartItem {
 
        id: number,
        name: string,
        price: number,
        size: string,
        quantity:number


}



