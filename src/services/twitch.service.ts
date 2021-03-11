import axios from "axios";

export class TwitchService {
    public token: string;

    public async getToken() {
        this.token = await axios({
            method: 'post',
            url: process.env.TWITCH_AUTH + "/oauth2/token",
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        }).then(function (response) {
            return response.data.access_token;
        }).catch(function (error) {
            console.log(error);
        });
    }

    public async getStreamInfo(name: string) {
        return this.twitchRequest("/helix/streams", {
            user_login: name
        });
    }

    public async getUserInfo(name: string) {
        return this.twitchRequest("/helix/users", {
            login: name
        });
    }


    private async twitchRequest(url: string, params: object) {
        return axios({
            method: 'get',
            url: process.env.TWITCH_API + url,
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'client-id': process.env.TWITCH_CLIENT_ID
            },
            params: params
        }).then(function (response) {
            return response.data && response.data.data[0];
        }).catch(function (error) {
            console.log(error);
        });
    }
}