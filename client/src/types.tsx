export interface Item {
    id: number,
    name: string,
    description: string,
    quantity: string,
    price: number,
    numOfOtherImage: number,
}

export interface Sizes {
    [key: string]: number
}

export interface CartItemSize {
    [key: string]: {
        name: string,
        quantity: number,
        price: number,
    }
}

export interface CartItem {
 
    [key: number]: CartItemSize

}



