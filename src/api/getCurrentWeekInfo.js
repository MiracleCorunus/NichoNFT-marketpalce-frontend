// import { getCurrentYear } from "helpers/Utils";
import { server_url } from "./config";
import axios from 'axios';

const getCurrentWeekInfo = () => {
    const fetchPromise = function(resolve,reject) {
        const url = server_url + `/rewards/currentWeekInfo`;

        axios.get(url)
        .then(function (response) {
            // handle success
            resolve(response.data.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            reject(error)
        })
    }
    return new Promise(fetchPromise);}

export default getCurrentWeekInfo;
