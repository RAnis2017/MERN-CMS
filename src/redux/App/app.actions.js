import { GoogleSignIn, LoginSuccess, SetToken, LoginFailure, LoginStarted, Logout } from './app.types';
export const GoogleSignInSuccess = (email) => {
    return {
        type: GoogleSignIn,
        payload: email
    };
};

export const LoginSuccessAction = (email) => {
    return {
        type: LoginSuccess,
        payload: email
    };
}

export const SetTokenAction = (token) => {
    return {
        type: SetToken,
        payload: token
    };
}
