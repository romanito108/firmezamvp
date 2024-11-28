"use client";

import React, { useState, useEffect } from 'react';
import { getTransactions, TransactionType } from "../../../services/web3services";
import Desconnected from '../desconnected';

interface TransferDetailProps {
  tokenId: number | null;
}

export default function TransferDetail({ tokenId }: TransferDetailProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionType[]>([]);
  const SECURITY_VIEW = process.env.SECURITY_VIEW === "true";

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet && !wallet) {
      setWallet(storedWallet);
    }

    const fetchData = async () => {
      try {
        const eventDetails = await getTransactions();
        setTransactionDetails(eventDetails.length > 0 ? eventDetails : []);
      } catch (err) {
        console.error("Erro ao carregar transferências", err);
      }
    };

    if (wallet) {
      fetchData();
    }
  }, [tokenId, wallet]);

  if (!wallet) {
    return <Desconnected />;
  }

  const shouldShowProperty = SECURITY_VIEW
  ? transactionDetails.filter(
    (detail) =>
      wallet?.toUpperCase() === detail.admin.toUpperCase() ||
      wallet?.toUpperCase() === detail.buyerAddress.toUpperCase() ||
      wallet?.toUpperCase() === detail.sellerAddress.toUpperCase()
  )
  : transactionDetails;

  if (SECURITY_VIEW && !shouldShowProperty) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">A carteira conectada não possui informações.</p>
      </div>
    );
  }

  return (
    <div>
      {transactionDetails.length > 0 ? (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h2 className="text-lg font-semibold text-center mb-4">Transferências para o Comprador</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1 md:px-4 md:py-2">Qtd Tokens</th>
                  <th className="border px-2 py-1 md:px-4 md:py-2">%</th>
                  <th className="border px-2 py-1 md:px-4 md:py-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {transactionDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1 md:px-4 md:py-2">{detail.tokensPurchased}</td>
                    <td className="border px-2 py-1 md:px-4 md:py-2">{detail.percentage}</td>
                    <td className="border px-2 py-1 md:px-4 md:py-2">{detail.eventDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Nenhuma transferência efetuada para o comprador.</p>
      )}
    </div>
  );
}
