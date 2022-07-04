import { LoginSuccess, GoogleSignIn } from './app.types';

const INITIAL_STATE = {
    email: '',
    isLoggedIn: false,
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

        default: return state;
    }
};

export default reducer;