import axios from "axios";
import qs from "query-string";

const baseUrl = 'http://15.160.173.128:3000/api';

export const apiPost = async (path : string, data: {[key: string] : any} = {}, token: string | undefined = undefined) => {

    let bodyData: { [key: string]: any } = {};
    for (let property in data) {
        bodyData = {
            ...bodyData,
            [property.toString()]: data[property]
        }
    }

    const config : any = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return await axios.post(baseUrl + path, qs.stringify(bodyData), config);
};

export const apiGet = async (path : string, token : string | undefined = undefined) => {
    const config : any = {
        headers: { }
    };

    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return await axios.get(baseUrl + path, config);
};
