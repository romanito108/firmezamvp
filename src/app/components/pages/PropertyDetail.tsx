"use client";

import React, { useState, useEffect } from 'react';
import { getPropertyDetail, PropertyDetailType, Attribute } from "../../../services/web3services";
import Desconnected from '../desconnected';

interface PropertyDetailProps {
  tokenId: number ; // Permitir que seja null
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ tokenId }) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [propertyDetail, setPropertyDetail] = useState<PropertyDetailType | null>(null);

  const SECURITY_VIEW = process.env.SECURITY_VIEW === "true";

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");

    console.log("storedWallet", storedWallet)
    if (storedWallet && !wallet) {
      setWallet(storedWallet);
    }

    const fetchData = async () => {

      if (!wallet) return;

      setMessage("Carregando detalhes da propriedade. Aguarde...");

      try {
        const propertyDetails = await getPropertyDetail(tokenId);
        setPropertyDetail(propertyDetails);
        setMessage("");
      } catch (err) {
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage("Ocorreu um erro desconhecido.");
        }
      }
    };

    if (wallet) {
      fetchData();
    }
  }, [wallet, tokenId]);

  if (!wallet) {
    return <Desconnected />;
  }

  const shouldShowProperty = SECURITY_VIEW
    ? propertyDetail &&
    (wallet?.toUpperCase() === propertyDetail.ownerContract.toUpperCase() ||
      wallet?.toUpperCase() === propertyDetail.buyerAddress.toUpperCase() ||
      wallet?.toUpperCase() === propertyDetail.sellerAddress.toUpperCase())
    : true;

  if (SECURITY_VIEW && !shouldShowProperty) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">A carteira conectada não possui informações.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4 w-full">
      {propertyDetail && (
        <div style={{ minHeight: "400px", minWidth: "400px" }}>
          {message && <p className="text-font-inter text-xs">{message}</p>}
          <img
            className="w-full h-auto object-cover rounded-md mb-4"
            src={propertyDetail.image}
            alt=""
            width={260}
            height={280}
          />
          <b>{propertyDetail.name || ""}</b> <br />
          {propertyDetail.attributes.map((attribute: Attribute, index: number) => (
            <p key={index}>
              {attribute.trait_type}: {attribute.value}
            </p>
          ))}
          <br />
          <div>
            <span>TokenId: #{propertyDetail.tokenId}</span>
            <br />
            <span>Descrição: {propertyDetail.description}</span>
            <br />
            <span>Proprietário: {propertyDetail.sellerAddress}</span>
            <br />
            <span>Comprador: {propertyDetail.buyerAddress}</span>
            <br />
            {propertyDetail.paymentCompleted && (
              <span className="text-dark-blue">Pagamento Imóvel Finalizado</span>
            )}
            <br />
          </div>
          <br />
          <div>
            <span>Valor da Propriedade: {propertyDetail.propertyValue}</span>
            <br />
            <span>Quantidade de Tokens: {propertyDetail.quantityTokens}</span>
            <br />
            <span>Tokens disponíveis: {propertyDetail.availableTokens}</span>
            <br />
            <span>Percentual Vendido: {propertyDetail.percentageSold}</span>
            <br />
            <span>Smart Contract: {propertyDetail.smartContract}</span>
            <br />
          </div>
          <p className="font-bold text-left">
            <a
              className="text-blue-600 hover:text-blue-800"
              href={propertyDetail.blockExplorerUrl}
              target="_blank" rel="noopener noreferrer">
              Visualizar no BlockExplorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
