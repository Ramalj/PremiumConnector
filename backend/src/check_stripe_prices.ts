import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

// Hardcoded for debugging
const stripe = new Stripe('sk_test_REDACTED', {
    apiVersion: '2025-10-24.acacia', // Using latest or compatible version
});

const checkPrices = async () => {
    const proPriceId = 'price_1Sd2q9CmC1pnlRsdrSzNlQYH'; // Pro
    const premiumPriceId = 'price_1Sd2qBCmC1pnlRsdi0Ksl4zt'; // Premium

    try {
        console.log('Checking Pro Price:', proPriceId);
        const proPrice = await stripe.prices.retrieve(proPriceId);
        console.log('Pro Price:', JSON.stringify(proPrice, null, 2));

        console.log('\nChecking Premium Price:', premiumPriceId);
        const premiumPrice = await stripe.prices.retrieve(premiumPriceId);
        console.log('Premium Price:', JSON.stringify(premiumPrice, null, 2));
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
};

checkPrices();
