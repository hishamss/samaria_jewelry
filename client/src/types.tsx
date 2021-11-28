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
    id: number,
    name: string,
    quantity: number,
    size: string,
    price: number,
}
