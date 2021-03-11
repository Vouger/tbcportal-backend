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
        return axios({
            method: 'get',
            url: process.env.TWITCH_API + "/helix/streams",
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'client-id': process.env.TWITCH_CLIENT_ID
            },
            params: {
                user_login: name
            }
        }).then(function (response) {
            return response.data && response.data.data[0];
        }).catch(function (error) {
            console.log(error);
        });
    }
}