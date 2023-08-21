import { getCurrentWeekNumber, getCurrentYear } from "helpers/Utils";
import { server_url } from "./config";
import axios from 'axios';

const getRewardData = () => {
    const year = getCurrentYear();
    const wknum = getCurrentWeekNumber();
    const fetchPromise = function(resolve,reject) {
        const url = server_url + `/rewards/user/update/${year}${wknum}`;

        axios.get(url)
        .then(function (response) {
            // handle success
            console.log("getRewardData", response.data[0].data)
            resolve(response.data[0].data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            reject(error)
        })
    }
    return new Promise(fetchPromise);}

export default getRewardData;
