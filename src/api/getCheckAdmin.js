// import { getCurrentYear } from "helpers/Utils";
import { server_url } from "./config";
import axios from 'axios';

const getCheckAdmin = (address) => {
    let lowerAddress = address.toString().toLowerCase();
    const fetchPromise = function(resolve,reject) {
        const url = server_url + `/rewards/hasRole/${lowerAddress}`;

        axios.get(url)
        .then(function (response) {
            // handle success
            console.log("getCheckAdmin", response.data.data)
            resolve(response.data.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            reject(error)
        })
    }
    return new Promise(fetchPromise);}

export default getCheckAdmin;
