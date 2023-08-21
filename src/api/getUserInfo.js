// import { getCurrentYear } from "helpers/Utils";
import { server_url } from "./config";
import axios from 'axios';

const getUserInfo = (address, rewardNo) => {
    console.log("Reward No", rewardNo)
    let lowerAddress = address.toString().toLowerCase();
    const fetchPromise = function(resolve,reject) {
        const url = server_url + `/rewards/user/${lowerAddress}/${rewardNo}`;

        axios.get(url)
        .then(function (response) {
            // handle success
            console.log("user:",response.data.data)
            resolve(response.data.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            reject(error)
        })
    }
    return new Promise(fetchPromise);}

export default getUserInfo;
