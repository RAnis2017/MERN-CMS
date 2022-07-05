import { LoginSuccess, GoogleSignIn, SetToken } from './app.types';

const INITIAL_STATE = {
    email: '',
    isLoggedIn: false,
    token: '',
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LoginSuccess:
            return {
                ...state, email: action.payload, isLoggedIn: true,
            };
        case GoogleSignIn:
            return {
                ...state, email: action.payload, isLoggedIn: true,
            };
        case SetToken:
            return {
                ...state, token: action.payload,
            };
        default: return state;
    }
};

export default reducer;