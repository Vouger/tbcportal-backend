import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import { AuthResolver } from "./resolvers/auth.resolver";
import { SocialResolver } from "./resolvers/social.resolver";
import { GuidesResolver } from "./resolvers/guides.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { TwitchResolver } from "./resolvers/twitch.resolver";
import { PostsResolver } from "./resolvers/posts.resolver";
import { SettingsResolver } from "./resolvers/settings.resolver";
import { authChecker } from "./auth/auth-checker";
import { getContext } from "./auth/context.helper";

createConnection().then(async connection => {
    console.log('success')

    await connection.synchronize();
    const schema = await buildSchema({
        resolvers: [
            AuthResolver,
            SocialResolver,
            GuidesResolver,
            UserResolver,
            TwitchResolver,
            PostsResolver,
            SettingsResolver
        ],
        authChecker
    });

    const server = new ApolloServer({
        schema,
        context: getContext
    });

    await server.listen(8080);
}).catch(error => console.log(error));
