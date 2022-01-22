let initialState: InitialStateType = {
    avatar: '',
}

export const selectAvaReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "SELECT-AVA":
            return {...state, avatar: action.avatar}
        default:
            return state
    }
}

export const selectAvaAC = (avatar: string) => {
    return ({type: 'SELECT-AVA', avatar} as const)
}

type InitialStateType = {
    avatar: string
}
type ActionsType = ReturnType<typeof selectAvaAC>