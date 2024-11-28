"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getPropertyDetail, PropertyDetailType } from '../../services/web3services';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importação do CSS do Bootstrap
import Script from 'next/script';

// Definindo a interface para os detalhes da propriedade
interface PropertyDetails {
  totalAcquisition: number;
  rentReduction: number;
  rent: number;
  goal: number;
}

export default function Page2(): JSX.Element {
  const [propertyDetail, setPropertyDetail] = useState<PropertyDetailType | null>(null);

  useEffect(() => {
    async function fetchPropertyDetails() {
      try {
        const details = await getPropertyDetail(1);
        setPropertyDetail(details);
        console.log(details);
      } catch (error) {
        console.error('Erro ao obter detalhes da propriedade:', error);
      }
    }
    fetchPropertyDetails();
  }, []);

  return (
    <div>
      {propertyDetail ? (
        <div>
          <div>
            <div className="nomes"><b>{propertyDetail.name || ""}</b></div>
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
        <div className="row">
          {[1, 2, 3].map((tokenCount, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card custom-card tokkencard">
                <div className="card-body custom-card-body">
                  <div className="tokennu">{`${tokenCount} Token${tokenCount > 1 ? 's' : ''}`}</div>
                  <div className="valorreais">R${500 * tokenCount},00</div>
                  <a href={`/pix${tokenCount}`} className="btn btn-primary blue custom-button">
                    Comprar mais
                  </a>
                </div>
              </div>
            </div>
          ))}
          <div className="col-md-3 mb-4">
            <div className="card custom-card tokkencard last">
              <div className="card-body custom-card-body">
                <div className="simular">Quero simular outro valor</div>
                <a href="/pix4" className="btn btn-primary blue custom-button">
                  Simular
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carregar scripts do Bootstrap */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
