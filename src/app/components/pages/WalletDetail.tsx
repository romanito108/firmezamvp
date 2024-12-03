"use client";

import React, { useState, useEffect } from 'react';
import { getWalletDetail, WalletDetailType } from "../../../services/web3services";
import Desconnected from '../desconnected';

interface WalletDetailProps {
  sellerAddress: string;
  buyerAddress: string;
  tokenId: number | null;
}

export default function WalletDetail({ sellerAddress, buyerAddress, tokenId }: WalletDetailProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletDetail, setWalletDetail] = useState<WalletDetailType | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const SECURITY_VIEW = process.env.SECURITY_VIEW === "true";

  useEffect(() => {

    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet && !wallet) {
      setWallet(storedWallet);
    }

    const fetchData = async () => {

      try {
        if (sellerAddress && buyerAddress) {
          const walletDetails = await getWalletDetail(tokenId || 1);
          setWalletDetail(walletDetails);
          setMessage("Carregando detalhes de transferências...");
        } else {
          setMessage("Propriedade disponível para negociação");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar dados.");
      } finally {
      }
    };

    if (wallet) {
      fetchData();
    }
  }, [wallet, tokenId, sellerAddress, buyerAddress]);

  if (!wallet) {
    return <Desconnected />;
  }

  const shouldShowProperty = SECURITY_VIEW
    ? walletDetail &&
    (wallet?.toUpperCase() === walletDetail.ownerContract.toUpperCase() ||
      wallet?.toUpperCase() === walletDetail.buyerAddress.toUpperCase() ||
      wallet?.toUpperCase() === walletDetail.sellerAddress.toUpperCase())
    : true;

  if (SECURITY_VIEW && !shouldShowProperty) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">A carteira conectada não possui informações.</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-lg font-semibold">Detalhes das Carteiras</h2>
      {walletDetail ? (
        <div className="bg-white rounded-lg shadow-md p-4" style={{ minHeight: "200px" }}>
          <b className="text-xs sm:text-sm">Proprietário</b> <br />
          <span>
            Address: {walletDetail.sellerAddress} <br />
            Qtd Tokens: {walletDetail.sellerQtdTokens} - {walletDetail.sellerPercentage}
          </span>
          <hr />
            <>
              <b className="text-xs sm:text-sm">Comprador</b> <br />
              <span>
                Address: {walletDetail.buyerAddress} <br />
                Qtd Tokens: {walletDetail.buyerQtdTokens} - {walletDetail.buyerPercentage}
              </span>
            </>
     
        </div>
      ) : (
        <p>Nenhum detalhe da carteira do comprador disponível.</p>
      )}
    </div>
  );
}
