import cartCountReducer from "./cartCountReducer";
import {combineReducers} from "redux";

const allReducers = combineReducers({
    cartCountReducer
});

export default allReducers;

export type reduxState = ReturnType<typeof allReducers>