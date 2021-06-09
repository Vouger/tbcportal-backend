import axios from "axios";

export class DiscordService {
    public token: string;

    public async getToken(code: string) {
        const params = {
            client_id: process.env.DISCORD_CLIENT_ID || '',
            client_secret: process.env.DISCORD_CLIENT_SECRET || '',
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.FRONTEND_URL + '/auth/discord/callback',
            scope: 'identify email'
        };

        const searchParams = new URLSearchParams(params);

        this.token = await axios.post(process.env.DISCORD_URL + '/oauth2/token',
            searchParams
        ).then(function (response) {
            return response.data.access_token;
        }).catch(function (error) {
            console.log(error);
        });
    }

    public async getUserInfo() {
        return await axios({
            method: 'get',
            url: process.env.DISCORD_URL + '/users/@me',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.log(error);
        });
    }
}