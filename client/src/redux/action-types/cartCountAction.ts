
interface IncrementCartCountAction {
    type: "increment",
    payload: number
}

interface DecrementCartCountAction {
    type: "decrement",
    payload: number,
}

interface EmptyCartCountAction {
    type: "empty",

}

interface UpdateCartCountAction {
    type: "count",
    payload: number,

}

export type CartCountAction = IncrementCartCountAction | DecrementCartCountAction | EmptyCartCountAction | UpdateCartCountAction;
