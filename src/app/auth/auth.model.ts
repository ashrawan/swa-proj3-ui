import { UserDTO } from "@app/core/model/user.model";


export interface RegisterContext {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginContext {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResponse {
    token: string;
}

export interface JwtTokenPayload {
    sub: string;
    username: string;
    user: UserDTO
    authorities?: object;
    attributes?: object;
    iat: string;
    exp: string
}
