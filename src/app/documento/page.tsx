"use client";

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import Head from 'next/head';

export default function Page2(): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileUrls, setFileUrls] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalFileUrl, setModalFileUrl] = useState<string | null>(null);

  // Carregar arquivos salvos no localStorage (para persistência)
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      setFileUrls(JSON.parse(savedFiles));
    }
  }, []);

  // Função para lidar com o upload de arquivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles: File[] = [];
      const invalidFiles: File[] = [];

      // Verificar tipos de arquivos válidos
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
        if (
          fileType === "application/pdf" ||
          fileType === "image/png" ||
          fileType === "image/jpeg" ||
          fileType === "image/jpg"
        ) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      }

      if (invalidFiles.length > 0) {
        setError(`Os seguintes arquivos são inválidos: ${invalidFiles.map(f => f.name).join(', ')}`);
      }

      // Processar e salvar os arquivos válidos
      if (validFiles.length > 0) {
        const newFileUrls = [...fileUrls]; // Concatena os arquivos anteriores
        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              newFileUrls.push(reader.result as string);
              setFileUrls(newFileUrls); // Atualiza o estado com os novos arquivos
              // Salvar no localStorage
              localStorage.setItem('uploadedFiles', JSON.stringify(newFileUrls));
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  // Função para abrir o modal e mostrar a imagem
  const handleImageClick = (url: string) => {
    setModalFileUrl(url);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalFileUrl(null);
  };

  // Função para remover um arquivo específico
  const handleRemoveFile = (fileUrl: string) => {
    const updatedFileUrls = fileUrls.filter(url => url !== fileUrl);
    // Atualiza o localStorage e o estado
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFileUrls));
    setFileUrls(updatedFileUrls);
  };

  return (
    <div>
      <Head>
        <title>Contrato</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </Head>

      <div className="contratoh1">
        <h1>Contrato</h1>
      </div>

      {/* Botão de Upload */}
      <div className="text-center mb-4">
        <input
          type="file"
          id="fileUpload"
          style={{ display: 'none' }}
          accept=".pdf, .png, .jpeg, .jpg"
          multiple
          onChange={handleFileChange}
        />
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById('fileUpload')?.click()}
        >
          Fazer Upload de Documento
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

      {/* Exibir os arquivos carregados */}
      {fileUrls.length > 0 && (
        <div className="containercontract">
          {fileUrls.map((fileUrl, index) => (
            <div key={index} className="file-container mb-3 text-center">
              {fileUrl?.endsWith(".pdf") ? (
                <div className="pdf-container">
                  <p>Arquivo PDF</p>
                  <embed src={fileUrl} type="application/pdf" width="600" height="400" />
                  <button className="btn btn-danger mt-2" onClick={() => handleRemoveFile(fileUrl!)}>Remover PDF</button>
                </div>
              ) : (
                <div className="image-container">
                  <Image
                    src={fileUrl}
                    alt="Imagem do Documento"
                    className="img-fluid mt-3 cursor-pointer"
                    width={300}
                    height={300}
                    onClick={() => handleImageClick(fileUrl)} // Clique para abrir no modal
                  />
                  <button className="btn btn-danger mt-2" onClick={() => handleRemoveFile(fileUrl!)}>Remover Imagem</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Imagem */}
      {showModal && modalFileUrl && (
        <div
          className="modal fade show"
          tabIndex={-1}
          aria-labelledby="imageModalLabel"
          aria-hidden="true"
          style={{ display: 'block' }}
        >
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content bg-dark">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Fechar"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body d-flex justify-content-center align-items-center">
                {modalFileUrl.endsWith('.pdf') ? (
                  <embed src={modalFileUrl} type="application/pdf" width="800" height="600" />
                ) : (
                  <Image
                    src={modalFileUrl}
                    alt="Imagem do Documento"
                    className="img-fluid"
                    width={800}
                    height={600}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
