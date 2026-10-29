// Quick Environment Variable Checker for Paystack Live Keys
// Run this in your backend directory: node check-paystack-config.js

require('dotenv').config();

console.log('\n🔍 Paystack Configuration Check\n');
console.log('================================\n');

const secretKey = process.env.PAYSTACK_SECRET_KEY;
const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
const clientUrl = process.env.CLIENT_URL;

// Check Secret Key
if (secretKey) {
    if (secretKey.startsWith('sk_live_')) {
        console.log('✅ PAYSTACK_SECRET_KEY: LIVE mode detected');
        console.log(`   Key: ${secretKey.substring(0, 15)}...${secretKey.substring(secretKey.length - 4)}`);
    } else if (secretKey.startsWith('sk_test_')) {
        console.log('⚠️  PAYSTACK_SECRET_KEY: TEST mode detected');
        console.log('   ⚠️  WARNING: You are using TEST keys, not LIVE keys!');
    } else {
        console.log('❌ PAYSTACK_SECRET_KEY: Invalid format');
    }
} else {
    console.log('❌ PAYSTACK_SECRET_KEY: NOT SET');
}

console.log('');

// Check Public Key
if (publicKey) {
    if (publicKey.startsWith('pk_live_')) {
        console.log('✅ PAYSTACK_PUBLIC_KEY: LIVE mode detected');
        console.log(`   Key: ${publicKey.substring(0, 15)}...${publicKey.substring(publicKey.length - 4)}`);
    } else if (publicKey.startsWith('pk_test_')) {
        console.log('⚠️  PAYSTACK_PUBLIC_KEY: TEST mode detected');
        console.log('   ⚠️  WARNING: You are using TEST keys, not LIVE keys!');
    } else {
        console.log('❌ PAYSTACK_PUBLIC_KEY: Invalid format');
    }
} else {
    console.log('❌ PAYSTACK_PUBLIC_KEY: NOT SET');
}

console.log('');

// Check Client URL
if (clientUrl) {
    console.log('✅ CLIENT_URL:', clientUrl);
    if (clientUrl.includes('localhost')) {
        console.log('   ⚠️  WARNING: Using localhost - is this production?');
    }
} else {
    console.log('❌ CLIENT_URL: NOT SET');
}

console.log('\n================================\n');

// Final verdict
const isLive = secretKey?.startsWith('sk_live_') && publicKey?.startsWith('pk_live_');
const isConfigured = secretKey && publicKey && clientUrl;

if (isLive && isConfigured) {
    console.log('🎉 READY FOR LIVE PAYMENTS!\n');
} else if (isConfigured && !isLive) {
    console.log('⚠️  CONFIGURED BUT USING TEST KEYS\n');
    console.log('   Switch to live keys when ready for production.\n');
} else {
    console.log('❌ NOT READY - Missing configuration\n');
}
