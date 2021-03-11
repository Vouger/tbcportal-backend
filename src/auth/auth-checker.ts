import {AuthChecker} from "type-graphql";

import { Context } from "./context.interface";

export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
    if (! user) {
        return false;
    }

    if (roles.length > 0 && ! roles.includes(user.role)) {
        return false;
    }

    return true;
};