
import { CartCountAction } from "../action-types/cartCountAction"

const cartCountReducer = (state: number = 0, action: CartCountAction) => {
    switch (action.type) {
        case "count":
            return action.payload;
        case "increment":
            return state + action.payload;
        case "decrement":
            return state - action.payload;
        case "empty":
            return 0;
        default:
            return state;
    }
}

export default cartCountReducer;