export interface Item {
    id: number,
    name: string,
    type: string,
    description: string,
    price: number,
    numOfOtherImage: number,
    sizes: ItemSize[]
}

export interface ItemSize {
    id: number,
    itemId: number,
    size: string,
    quantity: number
}


export interface CartItem {

    id: number,
    name: string,
    price: number,
    size: string,
    quantity: number


}

export interface CheckoutFormValues {
    firstName: string,
    lastName: string,
    email: string,
    address1: string,
    address2: string,
    state: string,
    zip: string

}

export interface AddedItemSize {
    size:string,
    quantity:number
}

export interface NewItem {

    name: string,
    type: string,
    description: string,
    price: number,
    numOfOtherImage: number,
    sizes: AddedItemSize[]

}

export interface APIMessage {
    message: string
}





