import { createParamDecorator } from "type-graphql";

import { Context } from "../auth/context.interface";

export default function CurrentUser() {
    return createParamDecorator<Context>(({ context }) => context.user);
}