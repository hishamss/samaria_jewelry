export interface Item {
    id: number,
    name: string,
    description: string,
    quantity: number,
    price: number,
    numOfOtherImage: number,
    sizes: string | null,
}

export interface Sizes {
    [key: string]: number
  }
