// src/Config/zaopay.ts
import axios from 'axios';

export const processZaopayPayment = async (amount: number, zaopayToken: string) => {
    try {
        const response = await axios.post('https://api.zaopay.com/payment', {
            amount,
            zaopayToken
        });

        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error('Zaopay payment failed');
        }
    } catch (error) {
        console.error('Zaopay payment error:', error);
        throw new Error('Payment processing failed');
    }
};
