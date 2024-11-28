"use client";

import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importação do CSS do Bootstrap
import Image from "next/image";

export default function Page(): JSX.Element {
  return (
    <div>
      {/* Coluna do QR Code */}
      <div className="qrcode">
        <h2>Escaneie o QR Code</h2>
      </div>
      <br />
      <Image 
        width={200}
        height={200}
        className="imgQR" 
        src="/pix3.png" 
        alt="Ícone" 
      />

      {/* Coluna do Link de Contato */}
      <h3 className="duvida-header">
        Alguma dúvida?{' '}
        <Link href="/contato" legacyBehavior>
          <a className="btn btn-primary blue custom-button duvida">
            Clique aqui
          </a>
        </Link>
      </h3>
    </div>
  );
}
