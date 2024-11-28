"use client";

import React, { useState, useEffect } from 'react';
import { getPropertyDetail } from "../../services/web3services";

import PropertyDetail from "../components/pages/PropertyDetail"; 
import WalletDetail from "../components/pages/WalletDetail";
import TransferDetails from "../components/pages/TransferDetails";
import Desconnected from '../components/desconnected';

export default function MainPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [ownerContract, setOwnerContract] = useState<string | null>(null);
  const [sellerAddress, setSellerAddress] = useState<string | null>(null);
  const [buyerAddress, setBuyerAddress] = useState<string | null>(null);
  const [propertyId] = useState<number>(1); // Pode ser alterado para dinamicamente pegar o id da propriedade
  const SECURITY_VIEW = process.env.SECURITY_VIEW === "true";

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet && !wallet) {
      setWallet(storedWallet);
    }
    const fetchData = async () => {
      try {
        const propertyDetails = await getPropertyDetail(propertyId);
        if (propertyDetails) {
          setTokenId(propertyDetails.tokenId);
          setOwnerContract(propertyDetails.ownerContract)
          setSellerAddress(propertyDetails.sellerAddress);
          setBuyerAddress(propertyDetails.buyerAddress);
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes da propriedade", err);
      }
    };

    fetchData();
  }, [wallet, propertyId]);

  if (!wallet) {
    return <Desconnected />;
  }

  const shouldShowProperty = SECURITY_VIEW
    ?
    (wallet?.toUpperCase() === ownerContract?.toUpperCase() ||
      wallet?.toUpperCase() === buyerAddress?.toUpperCase() ||
      wallet?.toUpperCase() === sellerAddress?.toUpperCase())
    : true;

  if (SECURITY_VIEW && !shouldShowProperty) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">A carteira conectada não possui informações.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-2xl font-bold mb-4 text-center mt-4">Detalhes da Propriedade</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl">
        {tokenId && (
          <div className="custom-class-property">
            <PropertyDetail tokenId={tokenId} />
          </div>
        )}

        {sellerAddress && buyerAddress && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="segundacaixa">
            <WalletDetail sellerAddress={sellerAddress} buyerAddress={buyerAddress} tokenId={tokenId} />
            </div>
            <div className="mt-6 overflow-x-auto">
              <div className="terceiracaixa">
              {tokenId !== null && <TransferDetails tokenId={tokenId} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
