import { Request } from 'express';

import { parseToken } from "./token.helper";
import { Context } from "./context.interface";
import { User } from "../models/User";

export async function getContext({ req }: { req: Request }): Promise<Context> {
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ','');
    const userId = token && parseToken(token);
    const user = await User.findOne(userId);

    return { user };
};