"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPropertyDetail, PropertyDetailType,
         getWalletDetail, WalletDetailType } from '../../services/web3services';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "next/image";
import Desconnected from '../components/desconnected';

interface PropertyDetails {
  totalAcquisition: number;
  goal: number;
}


export default function Page() {

  const [propertyDetail, setPropertyDetail] = useState<PropertyDetailType | null>(null);
  const [walletDetail, setWalletDetail] = useState<WalletDetailType | null>(null);
  const [buyerAddress, setBuyerAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet && !wallet) {
      setWallet(storedWallet);
    }
  
    async function fetchData() {
      try {
          const details = await getPropertyDetail(1);
          setPropertyDetail(details);
          setBuyerAddress(details.buyerAddress)

          if (details.buyerAddress) {
            try {
              const walletDetails = await getWalletDetail(1);
              setWalletDetail(walletDetails);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Erro ao buscar dados.");
            }
          }

      } catch (error) {
        console.error("Erro ao obter detalhes da propriedade:", error);
      }
  
    
    }
  
    if (wallet) {
      fetchData();
    }
  }, [wallet]);
  
  if (!wallet) {
    return <Desconnected />;
  }

  const SECURITY_VIEW = process.env.SECURITY_VIEW === "true";

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

  // Garantir que o valor da propriedade seja um número
  const propertyValue = parseFloat(propertyDetail?.propertyValue || "0");

  // Formatar o valor da propriedade
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  

  // Se o valor for inválido (NaN), usar 0
  const validPropertyValue = isNaN(propertyValue) ? 0 : propertyValue;

  const percentageSold = parseFloat(propertyDetail?.percentageSold || "0");

  // Se nada foi comprado, o valor pago é 0
  //const paidValue = percentageSold > 0 ? (percentageSold / 100) * validPropertyValue : 0;

  const paidValue = percentageSold > 0 ? (percentageSold / 100) * validPropertyValue : 0;

  // Calcular o valor restante
  const remainingValue = validPropertyValue - paidValue;

  // Calcular o percentual adquirido
  const percentPurchased = percentageSold;

  return (
    <div>
      {propertyDetail ? (
        <div>
          <div>
            <div className="token-text">
              Tokens disponíveis para compra do <span>{propertyDetail.name || ""}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="col-span-1 bg-white rounded-lg shadow-md p-4"
          style={{ minHeight: "400px", minWidth: "400px" }}
        >
          <p>Esta carteira não possui informações de Imóveis.</p>
        </div>
      )}

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12 mb-4 d-flex">
            <div className="card custom-card">
              <div className="card-body custom-card-body">
                <h5 className="card-title custom-card-title">Total adquirido do imóvel</h5>
                <h3 className="card-text custom-card-text">
                {walletDetail?.buyerQtdTokens && !isNaN(Number(walletDetail.buyerQtdTokens))
                  ? formatCurrency(Number(walletDetail.buyerQtdTokens)*1000) 
                  : formatCurrency(0)}
                  <span className="total-word">  total </span>
                </h3>
                <span className="total-word">
                  Nesse ritmo, você comprará o imóvel em 1 ano{" "}
                  <Image width={50} height={50} className="alert" src="/alert-circle.png" alt="Alerta" />
                </span>
                <div className="barrinha">
                  <div className="gauge">
                    <div className="gauge__body">
                    <div
        className="gauge__fill"
        style={{
          transform: `rotate(${(percentPurchased / 100) * 180}deg)`,
        }}
      ></div>
                      <div className="gauge__cover"></div>
                    </div>
                    <Image width={50} height={50} className="icon" src="/Icon.png" alt="Ícone" />
                  </div>
                  <div className="barraP">
                    <div className="dados">
                      <div className="acima">
                        {/* Valor pago (se nada foi comprado, é 0) */}
                        <div className="quantotem"> 
                          {walletDetail?.buyerQtdTokens && !isNaN(Number(walletDetail.buyerQtdTokens))
                        ? formatCurrency(Number(walletDetail.buyerQtdTokens)*1000) 
                        : formatCurrency(0)}
                        </div>
                        {/* Valor total do imóvel, que nunca muda */}
                        <div className="quantofalta">            
                            {propertyDetail?.propertyValue}
                        </div>
                      </div>
                      {/* Percentual adquirido */}
                      <div className="porcentagem">{walletDetail?.buyerPercentage}</div>
                      <div className="faltapravc">do imóvel já pertence a você</div>
                    </div>
                  </div>
                </div>
                <Link href="/token3" className="btn btn-primary blue custom-button">
                  Comprar mais
                </Link>
              </div>
            </div>
          </div>

          {/* Segundo card */}
          <div className="col-md-6 col-sm-12 mb-4 d-flex">
            <div className="card custom-card">
              <div className="card-body">
                <h5 className="card-title custom-card-title">Seu aluguel</h5>
                <h3 className="card-text custom-card-text">
                  R$5,00
                  <span className="total-word"> total </span>
                </h3>
                <span className="total-word">
                  Seu aluguel inicial era de R$800,00
                
                  <Image width={50} height={50} className="alert" src="/alert-circle.png" alt="Alerta" />
                </span>
                <div className="barrinha">
                  <div className="gauge">
                    <div className="gauge__body">
                      <div className="gauge__fill"></div>
                      <div className="gauge__cover"></div>
                    </div>
                    <Image width={20} height={20} className="icon" src="/Icon2.png" alt="Ícone" />
                  </div>
                  <div className="barraP">
                    <div className="dados">
                      <div className="acima">
                        {/* Valor pago (se nada foi comprado, é 0) */}
                        <div className="quantotem">0</div>
                        {/* Valor total do imóvel, que nunca muda */}
                        <div className="quantofalta">0</div>
                      </div>
                      {/* Percentual adquirido */}
                      <div className="porcentagem">97,97%</div>
                      <div className="faltapravc">de economia de todos os meses!</div>
                    </div>
                  </div>
                </div>
                <a href="/token3" className="btn btn-primary blue custom-button2">
                  Pagar aluguel
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
