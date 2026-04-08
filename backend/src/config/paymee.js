export const paymeeConfig={
    apiKey:process.env.PAYMEE_API,
    apiUrl:process.env.PAYMEE_URL,
    ngrokUrl:process.env.NGROK_URL, //this is the public url that we will use to receive webhooks from Paymee, you can use ngrok to create a tunnel to your local server
}