import { ethers, Contract } from "ethers";

import ABI from "./token-0001-ABI.json";
import { readJson } from "./util";

const CONTRACT_ADDRESS: string = process.env.CONTRACT_ADDRESS || "";
const CHAIN_ID: number = parseInt(process.env.CHAIN_ID || "0");
const EXPLORER_SCAN: string = process.env.EXPLORER_SCAN || "";

const currencyFormatted = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const percentFormatted = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const formatNumber = (value: number, locale = 'pt-BR', minFractionDigits = 0): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: minFractionDigits,
  }).format(value);
};

export type Attribute = {
  trait_type: string;
  value: string;
};

export type PropertyDetailType = {
  smartContract: string;
  ownerContract: string;
  attributes: Attribute[];
  name: string;
  image: string;
  tokenId: number;
  description: string;
  sellerAddress: string;
  buyerAddress: string;
  available: boolean;
  paymentCompleted: boolean;
  propertyValue: string;
  quantityTokens: string;
  availableTokens: string;
  percentageSold: string;
  chainId: string;
  openseaUrl: string;
  blockExplorerUrl: string;
};

export type WalletDetailType = {
  tokenId: string;
  smartContract: string;
  ownerContract: string;
  sellerAddress: string;
  sellerPercentage: string;
  sellerQtdTokens: string;
  buyerAddress: string;
  buyerPercentage: string;
  buyerQtdTokens: string;
};


// export type TransactionType = {
//   admin: string;
//   sellerAddress: string;
//   buyerAddress: string;
//   tokenId: string;
//   tokensPurchased: number;
//   percentage: number;
//   eventDate: string;
// };

export type TransactionType = {
  admin: string;
  sellerAddress: string;
  buyerAddress: string;
  tokenId: number;
  tokensPurchased: number;
  percentage: string;
  eventDate: string;
};

async function getProvider() {
  if (!window.ethereum) throw new Error("Carteira não encontrada!");
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
}

async function getContractInstance(): Promise<Contract> {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}

export async function getPropertyDetail(
  tokenId: number
): Promise<PropertyDetailType> {
  await checkConnectedNetwork();

  const contract = await getContractInstance();

  try {
    const result = await contract.propertyDetails(tokenId);

    const owner = await contract.owner();

    if (!result.metadata.length) throw "erro";

    const metadata = await readJson(result.metadata);

    const chain = CHAIN_ID;

    return {
      smartContract: CONTRACT_ADDRESS,
      ownerContract: owner,
      tokenId: result.tokenId.toString(),
      propertyValue: currencyFormatted.format(result.propertyValue),
      quantityTokens: formatNumber(result.quantityTokens),      
      availableTokens: formatNumber(result.availableTokens),  
      sellerAddress: result.sellerAddress,
      buyerAddress:
        result.buyerAddress !== "0x0000000000000000000000000000000000000000"
          ? result.buyerAddress
          : "n/a",
      percentageSold: percentFormatted.format(parseFloat(result.percentageSold) / 10000), 
      available: result.available,
      paymentCompleted: result.paymentCompleted,
      description: metadata.description,
      name: metadata.name,
      image: metadata.image,
      attributes: metadata.attributes,
      chainId: chain.toString(),
      openseaUrl: "",
      blockExplorerUrl: EXPLORER_SCAN + "" + CONTRACT_ADDRESS,
    };
    
  } catch (error) {
    console.error("Error fetching from propertyDetails:", error);
    throw error;
  }
}


export async function getWalletDetail(
  tokenId: number
): Promise<WalletDetailType> {

  await checkConnectedNetwork();
  const contract = await getContractInstance();
  const owner = await contract.owner();

  const result = await contract.getSellerAndBuyerDetails(tokenId);

  return {
      tokenId: tokenId.toString(),
      smartContract: CONTRACT_ADDRESS,
      ownerContract: owner,
      sellerAddress: result.sellerDetails[1],
      sellerPercentage: percentFormatted.format(parseFloat(result.sellerDetails[2]) / 10000), 
      sellerQtdTokens: formatNumber(result.sellerDetails[3]), 
      buyerAddress: result.buyerDetails[1],
      buyerPercentage: percentFormatted.format(parseFloat(result.buyerDetails[2]) / 10000), 
      buyerQtdTokens: formatNumber(result.buyerDetails[3]), 

    };
}


export async function getTransactions(): Promise<TransactionType[]> {
  await checkConnectedNetwork();

  try {
    const contract = await getContractInstance();
    const filter = contract.filters.ShareTransferred();
    const events = await contract.queryFilter(filter, 0, "latest");

    if (events.length === 0) {
      throw new Error("Transactions not found");
    }

    const percentFormatted = new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
    });

    const eventDetails = events.map((event) => {
      const {
        admin,
        sellerAddress,
        buyerAddress,
        tokenId,
        quantityTokensPurchased,
        percentage,
        timestamp
      } = (event as any).args;

      const eventDate = new Date(Number(timestamp) * 1000);
      const eventDateFormatted = eventDate.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        admin,
        sellerAddress,
        buyerAddress,
        tokenId: parseInt(tokenId, 10),
        tokensPurchased: parseInt(quantityTokensPurchased, 10),
        percentage: percentFormatted.format(parseFloat(percentage) / 10000),
        eventDate: eventDateFormatted,
      };
    });

    return eventDetails;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}



// =================================== Função de Login
declare global {
  interface Window {
    web3?: any; // ou qualquer tipo específico que você prefira
  }
}
// Verifica se o MetaMask está instalado
export const checkMetaMaskInstalled = (): any | boolean => {
  if (typeof window.ethereum !== "undefined") {
    // MetaMask está disponível
    const provider = window.ethereum;
    return provider;
  } else if (typeof window.web3 !== "undefined") {
    // Suporte para versões antigas do MetaMask
    const provider = window.web3.currentProvider;
    return provider;
  } else {
    console.error("MetaMask não detectado!");
    return false;
  }
};

// Conecta à MetaMask e retorna a conta conectada
export const connectMetaMask = async (): Promise<string | null> => {
  try {
    const provider = checkMetaMaskInstalled();
    if (!provider) {
      throw new Error("MetaMask não está instalado.");
    }
    // Chama a função que verifica se a rede conectada é a correta (Sepolia)
    await checkConnectedNetwork();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts.length)
      throw new Error("Carteira não permitida ou não encontrada!");

    try {
      // Definir uma mensagem personalizada para o usuário assinar
      const message = "FIRMEZA TOKEN. Acesso seguro (apenas visualização)";
      // Solicitar ao usuário que assine a mensagem
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [accounts[0], message],
      });
    } catch (error) {
      throw new Error("Erro ao solicitar permissão ou assinatura.");
    }

    return accounts[0];
  } catch (error) {
    throw new Error("" + error);
  }
};

// Desconectar MetaMask (pode ser apenas uma função que limpa os dados no frontend)
export const disconnectMetaMask = () => {
  return null;
};

// Função para verificar se a rede conectada é a Sepolia
export const checkConnectedNetwork = async (): Promise<void> => {
  try {
    const networkChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    const connectedChainId = parseInt(networkChainId, 16); // Hexadecimal para decimal

    if (connectedChainId !== CHAIN_ID) {
      throw new Error(
        `Conecte-se à rede Sepolia (ID: ${CHAIN_ID}). O ID da rede atual é ${connectedChainId}.`
      );
    }
  } catch (error) {
    console.error("Erro ao verificar a rede:", error);
    throw error;
  }
};

// Função para tratar mudança de conta
export const onAccountAndNetworkChanged = (
  accountCallback: (account: string | null) => void,
  networkCallback: (isCorrectNetwork: boolean) => void
) => {
  if (checkMetaMaskInstalled()) {
    // Monitorar mudança de contas
    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
      try {
        await checkConnectedNetwork();

        // Se contas estiverem disponíveis, chama o callback com a primeira conta
        if (accounts.length > 0) {
          accountCallback(accounts[0]);
        } else {
          // Se não houver contas, chama o callback com null (desconectado)
          accountCallback(null);
        }
      } catch (error) {
        console.error("Erro durante a troca de contas:", error);
        accountCallback(null); // Opcionalmente desconectar ou lidar com o erro
      }
    });

    // Monitorar mudança de rede (chainChanged)
    window.ethereum.on("chainChanged", async (networkChainId: string) => {
      try {
        const connectedChainId = parseInt(networkChainId, 16); // Hexadecimal para decimal

        // Verifica se a rede é a Sepolia
        const isCorrectNetwork = connectedChainId === CHAIN_ID;

        if (!isCorrectNetwork) {
          console.error(
            `Conecte-se à rede Sepolia (ID: ${CHAIN_ID}). O ID da rede atual é ${connectedChainId}`
          );
        }

        // Callback para notificar se a rede está correta ou não
        networkCallback(isCorrectNetwork);
      } catch (error) {
        console.error("Erro ao verificar mudança de rede:", error);
        networkCallback(false); // Notificar que houve um erro e a rede não está correta
      }
    });
  }
};


