export interface ItemSize {
    size: string,
    quantity: number
}
export interface NewItem {
 
    name: string,
    type:string,
    description: string,
    price: number,
    numOfOtherImage: number,
    sizes: ItemSize[],
}

export interface CartItem {

    id: number,
    name: string,
    price: number,
    size: string,
    quantity: number


}

export interface CartItemAvailableQuantity {
    id: number,
    size:string,
    availableQuantity: number,
    isQuantInStock: boolean

}

export interface Order {
    buyerInfo: {
        firstname: string,
        lastname: string,
        email: string,
        address1: string,
        address2: string,
        state: string,
        zip: string
    },
    cartItems: CartItem[],
    claimedPrice: number,
    stripeToken: string
}