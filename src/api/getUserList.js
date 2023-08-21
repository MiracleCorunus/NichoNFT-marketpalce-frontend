import { getCurrentYear } from "helpers/Utils";
import { server_url } from "./config";
import axios from 'axios';

const getUserList = (rewardNo) => {
    const currentYear = getCurrentYear();
    const fetchPromise = function(resolve,reject) {
        const url = server_url + `/rewards/user/list/${currentYear}${rewardNo}`;

        axios.get(url)
        .then(function (response) {
            // handle success
            console.log("userList", response.data[0].data)
            resolve(response.data[0].data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            reject(error)
        })
    }
    return new Promise(fetchPromise);}

export default getUserList;
