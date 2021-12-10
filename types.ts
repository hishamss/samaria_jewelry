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