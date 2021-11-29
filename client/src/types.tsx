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

export interface CartItem {
    // id key
    [key: number]: {
        // size key
        [key: string]: {
            name: string,
            quantity: number,
            price: number,
        }
    }
}
