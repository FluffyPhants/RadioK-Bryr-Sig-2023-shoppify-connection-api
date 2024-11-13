import axios from "axios";

async function getAmountDonated() {
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/nO5VY9wMeNOL3MRweOBwj?fields%5B%5D=amount&fields=prev_amount",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
        }
    }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        return 0
        });
    return axiosResponse.data.amount;
}

export {getAmountDonated}