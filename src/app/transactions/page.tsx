"use client";

import React, { useState, useEffect } from 'react';
import TransferDetails from "../components/pages/TransferDetails";
import Desconnected from '../components/desconnected';

export default function Transactions() {
  const [wallet, setWallet] = useState<string | null>(null); 
  const [tokenId, setTokenId] = useState<number>(1); 

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet"); 
      if (storedWallet) {
        setWallet(storedWallet);
      }
  
  }, [wallet, tokenId]);

  if (!wallet) {
    return <Desconnected />;
  }

  return (
    <div className="flex justify-start">
      <main className="pt-1">
        {wallet && (
          <div className="text-start w-full">
            <TransferDetails tokenId={tokenId} />
          </div>
        )}
      </main>
    </div>
  );
}