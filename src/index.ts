import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import { AuthResolver } from "./resolvers/auth.resolver";
import { GuidesResolver } from "./resolvers/guides.resolver";
import { authChecker } from "./auth/auth-checker";
import { getContext } from "./auth/context.helper";

createConnection().then(async connection => {
    console.log('success')

    await connection.synchronize();
    const schema = await buildSchema({
        resolvers: [AuthResolver, GuidesResolver],
        authChecker
    });

    const server = new ApolloServer({
        schema,
        context: getContext
    });

    await server.listen(8080);
}).catch(error => console.log(error));
