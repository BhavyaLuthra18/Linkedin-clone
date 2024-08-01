import { SET_USER } from "../actions/actionType";

const INITIAL_STATE ={
user:null,
};

// reducer(stateUpdater) - updates a given state some type of state it update it

const userReducer = (state = INITIAL_STATE ,action)=>{
    switch(action.type){
        case SET_USER:
            return {
                ...state,
                user:action.user,
            }
        default:
            return state;
    }
};

export default userReducer;