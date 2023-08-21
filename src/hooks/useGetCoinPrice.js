import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

const url = "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";

const useGetBNBPrice = (amount) => {
    const [bnbPrice, setBnbPrice] = useState(0);

    useEffect(() => {
        fetch(url).then((res) => res.json()).then((res) => {
            setBnbPrice(res.binancecoin.usd * amount);
        });
    }, [amount]);

    return bnbPrice;
};

export default useGetBNBPrice;

export const getFilteredPrice = (price) => {
    if (!price) return "$0";
    const price_temp = parseFloat(price.toString());
    // console.log("PRice: ", price_temp)
    if (price_temp < 1000) {
        return "$" + price_temp.toFixed(2);
    } else if (price_temp < 1000000) {
        return "$" + (price_temp / 1000).toFixed(2) + "K";
    } else {
        return "$" + (price_temp / 1000000).toFixed(2) + "M";
    }
}

export const getFilteredPrice2 = (price) => {
    if (!price) return "0";
    const price_temp = parseFloat(price.toString());
    // console.log("PRice: ", price_temp)
    if (price_temp < 1000) {
        return "" + price_temp.toFixed(2);
    } else if (price_temp < 1000000) {
        return "" + (price_temp / 1000).toFixed(2) + "K";
    } else {
        return "" + (price_temp / 1000000).toFixed(2) + "M";
    }
}

export const convertPrice = (price, decimal) => {
    if (!price) return 0;
    return new BigNumber(price).toFixed(decimal)
}
