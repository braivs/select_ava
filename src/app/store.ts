import {combineReducers, createStore} from "redux";
import {selectAvaReducer} from "../features/SelectAva/selectAva-reducer";

const rootReducer = combineReducers({
    ava: selectAvaReducer
})

export const store = createStore(rootReducer);
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store