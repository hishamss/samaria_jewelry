import { Dispatch } from "redux";
import { CartCountAction } from "../action-types/cartCountAction"

export const UpdateCartCount = (count: number) => {
    return (dispatch: Dispatch<CartCountAction>) => {
        dispatch({
            type: "count",
            payload: count,
        })

    }
}