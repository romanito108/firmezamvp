/** @type {import('next').NextConfig} */
const nextConfig = {

  env: {
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
      OPENSEA_URL: process.env.OPENSEA_URL,
      CHAIN_ID: process.env.CHAIN_ID,
      EXPLORER_SCAN: process.env.EXPLORER_SCAN,
      SECURITY_VIEW: process.env.SECURITY_VIEW
    },

    images: {
      domains: ['ipfs.io'], // Adicione o domínio aqui
    },


};



export default nextConfig;