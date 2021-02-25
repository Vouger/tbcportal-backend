import * as jwt from "jsonwebtoken";

import { User } from "../models/User";
import getJwtSecret from "../config/auth";

export function getToken ({ user, expires = '1h' }: {user: User; expires? : string }) : string {
    return jwt.sign(
        {userId: user.id},
        getJwtSecret(),
        {expiresIn: expires}
    );
};

export function parseToken (token: string) : string {
    const jwtPayload = <any>jwt.verify(token, getJwtSecret());

    return jwtPayload.userId;
};