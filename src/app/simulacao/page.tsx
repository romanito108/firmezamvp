"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import Script from 'next/script';
import Desconnected from '../components/desconnected';
import { getPropertyDetail, PropertyDetailType } from '../../services/web3services';

interface Dado {
  periodo: number;
  aluguel: string;
  gastoMoradiaMensal: string;
  aquisicaoFracao: string;
  percentualImovelAdquirido: string;
}

const dadosExemplo = [
  { periodo: 0, aluguel: 'R$ 800,00', gastoMoradiaMensal: 'R$ 1.875,00', aquisicaoFracao: 'R$ 1.000,00', percentualImovelAdquirido: '0,63%' },
  { periodo: 1, aluguel: 'R$ 795,00', gastoMoradiaMensal: 'R$ 1.870,00', aquisicaoFracao: 'R$ 2.000,00', percentualImovelAdquirido: '1,25%' },
  { periodo: 2, aluguel: 'R$ 790,00', gastoMoradiaMensal: 'R$ 1.865,00', aquisicaoFracao: 'R$ 3.000,00', percentualImovelAdquirido: '1,88%' },
  { periodo: 3, aluguel: 'R$ 785,00', gastoMoradiaMensal: 'R$ 1.860,00', aquisicaoFracao: 'R$ 4.000,00', percentualImovelAdquirido: '2,50%' },
  { periodo: 4, aluguel: 'R$ 780,00', gastoMoradiaMensal: 'R$ 1.855,00', aquisicaoFracao: 'R$ 5.000,00', percentualImovelAdquirido: '3,13%' },
  { periodo: 5, aluguel: 'R$ 775,00', gastoMoradiaMensal: 'R$ 1.850,00', aquisicaoFracao: 'R$ 6.000,00', percentualImovelAdquirido: '3,75%' },
  { periodo: 6, aluguel: 'R$ 770,00', gastoMoradiaMensal: 'R$ 1.845,00', aquisicaoFracao: 'R$ 7.000,00', percentualImovelAdquirido: '4,38%' },
  { periodo: 7, aluguel: 'R$ 765,00', gastoMoradiaMensal: 'R$ 1.840,00', aquisicaoFracao: 'R$ 8.000,00', percentualImovelAdquirido: '5,00%' },
  { periodo: 8, aluguel: 'R$ 760,00', gastoMoradiaMensal: 'R$ 1.835,00', aquisicaoFracao: 'R$ 9.000,00', percentualImovelAdquirido: '5,63%' },
  { periodo: 9, aluguel: 'R$ 755,00', gastoMoradiaMensal: 'R$ 1.830,00', aquisicaoFracao: 'R$ 10.000,00', percentualImovelAdquirido: '6,25%' },
  { periodo: 10, aluguel: 'R$ 750,00', gastoMoradiaMensal: 'R$ 1.825,00', aquisicaoFracao: 'R$ 11.000,00', percentualImovelAdquirido: '6,88%' },
  { periodo: 11, aluguel: 'R$ 745,00', gastoMoradiaMensal: 'R$ 1.820,00', aquisicaoFracao: 'R$ 12.000,00', percentualImovelAdquirido: '7,50%' },
  { periodo: 12, aluguel: 'R$ 740,00', gastoMoradiaMensal: 'R$ 1.815,00', aquisicaoFracao: 'R$ 13.000,00', percentualImovelAdquirido: '8,13%' },
  { periodo: 13, aluguel: 'R$ 735,00', gastoMoradiaMensal: 'R$ 1.810,00', aquisicaoFracao: 'R$ 14.000,00', percentualImovelAdquirido: '8,75%' },
  { periodo: 14, aluguel: 'R$ 730,00', gastoMoradiaMensal: 'R$ 1.805,00', aquisicaoFracao: 'R$ 15.000,00', percentualImovelAdquirido: '9,38%' },
  { periodo: 15, aluguel: 'R$ 725,00', gastoMoradiaMensal: 'R$ 1.800,00', aquisicaoFracao: 'R$ 16.000,00', percentualImovelAdquirido: '10,00%' },
  { periodo: 16, aluguel: 'R$ 720,00', gastoMoradiaMensal: 'R$ 1.795,00', aquisicaoFracao: 'R$ 17.000,00', percentualImovelAdquirido: '10,63%' },
  { periodo: 17, aluguel: 'R$ 715,00', gastoMoradiaMensal: 'R$ 1.790,00', aquisicaoFracao: 'R$ 18.000,00', percentualImovelAdquirido: '11,25%' },
  { periodo: 18, aluguel: 'R$ 710,00', gastoMoradiaMensal: 'R$ 1.785,00', aquisicaoFracao: 'R$ 19.000,00', percentualImovelAdquirido: '11,88%' },
  { periodo: 19, aluguel: 'R$ 705,00', gastoMoradiaMensal: 'R$ 1.780,00', aquisicaoFracao: 'R$ 20.000,00', percentualImovelAdquirido: '12,50%' },
  { periodo: 20, aluguel: 'R$ 700,00', gastoMoradiaMensal: 'R$ 1.775,00', aquisicaoFracao: 'R$ 21.000,00', percentualImovelAdquirido: '13,13%' },
  { periodo: 21, aluguel: 'R$ 695,00', gastoMoradiaMensal: 'R$ 1.770,00', aquisicaoFracao: 'R$ 22.000,00', percentualImovelAdquirido: '13,75%' },
  { periodo: 22, aluguel: 'R$ 690,00', gastoMoradiaMensal: 'R$ 1.765,00', aquisicaoFracao: 'R$ 23.000,00', percentualImovelAdquirido: '14,38%' },
  { periodo: 23, aluguel: 'R$ 685,00', gastoMoradiaMensal: 'R$ 1.760,00', aquisicaoFracao: 'R$ 24.000,00', percentualImovelAdquirido: '15,00%' },
  { periodo: 24, aluguel: 'R$ 680,00', gastoMoradiaMensal: 'R$ 1.755,00', aquisicaoFracao: 'R$ 25.000,00', percentualImovelAdquirido: '15,63%' },
  { periodo: 25, aluguel: 'R$ 675,00', gastoMoradiaMensal: 'R$ 1.750,00', aquisicaoFracao: 'R$ 26.000,00', percentualImovelAdquirido: '16,25%' },
  { periodo: 26, aluguel: 'R$ 670,00', gastoMoradiaMensal: 'R$ 1.745,00', aquisicaoFracao: 'R$ 27.000,00', percentualImovelAdquirido: '16,88%' },
  { periodo: 27, aluguel: 'R$ 665,00', gastoMoradiaMensal: 'R$ 1.740,00', aquisicaoFracao: 'R$ 28.000,00', percentualImovelAdquirido: '17,50%' },
  { periodo: 28, aluguel: 'R$ 660,00', gastoMoradiaMensal: 'R$ 1.735,00', aquisicaoFracao: 'R$ 29.000,00', percentualImovelAdquirido: '18,13%' },
  { periodo: 29, aluguel: 'R$ 655,00', gastoMoradiaMensal: 'R$ 1.730,00', aquisicaoFracao: 'R$ 30.000,00', percentualImovelAdquirido: '18,75%' },
  { periodo: 30, aluguel: 'R$ 650,00', gastoMoradiaMensal: 'R$ 1.725,00', aquisicaoFracao: 'R$ 31.000,00', percentualImovelAdquirido: '19,38%' },
  { periodo: 31, aluguel: 'R$ 645,00', gastoMoradiaMensal: 'R$ 1.720,00', aquisicaoFracao: 'R$ 32.000,00', percentualImovelAdquirido: '20,00%' },
  { periodo: 32, aluguel: 'R$ 640,00', gastoMoradiaMensal: 'R$ 1.715,00', aquisicaoFracao: 'R$ 33.000,00', percentualImovelAdquirido: '20,63%' },
  { periodo: 33, aluguel: 'R$ 635,00', gastoMoradiaMensal: 'R$ 1.710,00', aquisicaoFracao: 'R$ 34.000,00', percentualImovelAdquirido: '21,25%' },
  { periodo: 34, aluguel: 'R$ 630,00', gastoMoradiaMensal: 'R$ 1.705,00', aquisicaoFracao: 'R$ 35.000,00', percentualImovelAdquirido: '21,88%' },
  { periodo: 35, aluguel: 'R$ 625,00', gastoMoradiaMensal: 'R$ 1.700,00', aquisicaoFracao: 'R$ 36.000,00', percentualImovelAdquirido: '22,50%' },
  { periodo: 36, aluguel: 'R$ 620,00', gastoMoradiaMensal: 'R$ 1.695,00', aquisicaoFracao: 'R$ 37.000,00', percentualImovelAdquirido: '23,13%' },
  { periodo: 37, aluguel: 'R$ 615,00', gastoMoradiaMensal: 'R$ 1.690,00', aquisicaoFracao: 'R$ 38.000,00', percentualImovelAdquirido: '23,75%' },
  { periodo: 38, aluguel: 'R$ 610,00', gastoMoradiaMensal: 'R$ 1.685,00', aquisicaoFracao: 'R$ 39.000,00', percentualImovelAdquirido: '24,38%' },
  { periodo: 39, aluguel: 'R$ 605,00', gastoMoradiaMensal: 'R$ 1.680,00', aquisicaoFracao: 'R$ 40.000,00', percentualImovelAdquirido: '25,00%' },
  { periodo: 40, aluguel: 'R$ 600,00', gastoMoradiaMensal: 'R$ 1.675,00', aquisicaoFracao: 'R$ 41.000,00', percentualImovelAdquirido: '25,63%' },
  { periodo: 41, aluguel: 'R$ 595,00', gastoMoradiaMensal: 'R$ 1.670,00', aquisicaoFracao: 'R$ 42.000,00', percentualImovelAdquirido: '26,25%' },
  { periodo: 42, aluguel: 'R$ 590,00', gastoMoradiaMensal: 'R$ 1.665,00', aquisicaoFracao: 'R$ 43.000,00', percentualImovelAdquirido: '26,88%' },
  { periodo: 43, aluguel: 'R$ 585,00', gastoMoradiaMensal: 'R$ 1.660,00', aquisicaoFracao: 'R$ 44.000,00', percentualImovelAdquirido: '27,50%' },
  { periodo: 44, aluguel: 'R$ 580,00', gastoMoradiaMensal: 'R$ 1.655,00', aquisicaoFracao: 'R$ 45.000,00', percentualImovelAdquirido: '28,13%' },
  { periodo: 45, aluguel: 'R$ 575,00', gastoMoradiaMensal: 'R$ 1.650,00', aquisicaoFracao: 'R$ 46.000,00', percentualImovelAdquirido: '28,75%' },
  { periodo: 46, aluguel: 'R$ 570,00', gastoMoradiaMensal: 'R$ 1.645,00', aquisicaoFracao: 'R$ 47.000,00', percentualImovelAdquirido: '29,38%' },
  { periodo: 47, aluguel: 'R$ 565,00', gastoMoradiaMensal: 'R$ 1.640,00', aquisicaoFracao: 'R$ 48.000,00', percentualImovelAdquirido: '30,00%' },
  { periodo: 48, aluguel: 'R$ 560,00', gastoMoradiaMensal: 'R$ 1.635,00', aquisicaoFracao: 'R$ 49.000,00', percentualImovelAdquirido: '30,63%' },
  { periodo: 49, aluguel: 'R$ 555,00', gastoMoradiaMensal: 'R$ 1.630,00', aquisicaoFracao: 'R$ 50.000,00', percentualImovelAdquirido: '31,25%' },
  { periodo: 50, aluguel: 'R$ 550,00', gastoMoradiaMensal: 'R$ 1.625,00', aquisicaoFracao: 'R$ 51.000,00', percentualImovelAdquirido: '31,88%' },
  { periodo: 51, aluguel: 'R$ 545,00', gastoMoradiaMensal: 'R$ 1.620,00', aquisicaoFracao: 'R$ 52.000,00', percentualImovelAdquirido: '32,50%' },
  { periodo: 52, aluguel: 'R$ 540,00', gastoMoradiaMensal: 'R$ 1.615,00', aquisicaoFracao: 'R$ 53.000,00', percentualImovelAdquirido: '33,13%' },
  { periodo: 53, aluguel: 'R$ 535,00', gastoMoradiaMensal: 'R$ 1.610,00', aquisicaoFracao: 'R$ 54.000,00', percentualImovelAdquirido: '33,75%' },
  { periodo: 54, aluguel: 'R$ 530,00', gastoMoradiaMensal: 'R$ 1.605,00', aquisicaoFracao: 'R$ 55.000,00', percentualImovelAdquirido: '34,38%' },
  { periodo: 55, aluguel: 'R$ 525,00', gastoMoradiaMensal: 'R$ 1.600,00', aquisicaoFracao: 'R$ 56.000,00', percentualImovelAdquirido: '35,00%' },
  { periodo: 56, aluguel: 'R$ 520,00', gastoMoradiaMensal: 'R$ 1.595,00', aquisicaoFracao: 'R$ 57.000,00', percentualImovelAdquirido: '35,63%' },
  { periodo: 57, aluguel: 'R$ 515,00', gastoMoradiaMensal: 'R$ 1.590,00', aquisicaoFracao: 'R$ 58.000,00', percentualImovelAdquirido: '36,25%' },
  { periodo: 58, aluguel: 'R$ 510,00', gastoMoradiaMensal: 'R$ 1.585,00', aquisicaoFracao: 'R$ 59.000,00', percentualImovelAdquirido: '36,88%' },
  { periodo: 59, aluguel: 'R$ 505,00', gastoMoradiaMensal: 'R$ 1.580,00', aquisicaoFracao: 'R$ 60.000,00', percentualImovelAdquirido: '37,50%' },
  { periodo: 60, aluguel: 'R$ 500,00', gastoMoradiaMensal: 'R$ 1.575,00', aquisicaoFracao: 'R$ 61.000,00', percentualImovelAdquirido: '38,13%' },
  { periodo: 61, aluguel: 'R$ 495,00', gastoMoradiaMensal: 'R$ 1.570,00', aquisicaoFracao: 'R$ 62.000,00', percentualImovelAdquirido: '38,75%' },
  { periodo: 62, aluguel: 'R$ 490,00', gastoMoradiaMensal: 'R$ 1.565,00', aquisicaoFracao: 'R$ 63.000,00', percentualImovelAdquirido: '39,38%' },
  { periodo: 63, aluguel: 'R$ 485,00', gastoMoradiaMensal: 'R$ 1.560,00', aquisicaoFracao: 'R$ 64.000,00', percentualImovelAdquirido: '40,00%' },
  { periodo: 64, aluguel: 'R$ 480,00', gastoMoradiaMensal: 'R$ 1.555,00', aquisicaoFracao: 'R$ 65.000,00', percentualImovelAdquirido: '40,63%' },
  { periodo: 65, aluguel: 'R$ 475,00', gastoMoradiaMensal: 'R$ 1.550,00', aquisicaoFracao: 'R$ 66.000,00', percentualImovelAdquirido: '41,25%' },
  { periodo: 66, aluguel: 'R$ 470,00', gastoMoradiaMensal: 'R$ 1.545,00', aquisicaoFracao: 'R$ 67.000,00', percentualImovelAdquirido: '41,88%' },
  { periodo: 67, aluguel: 'R$ 465,00', gastoMoradiaMensal: 'R$ 1.540,00', aquisicaoFracao: 'R$ 68.000,00', percentualImovelAdquirido: '42,50%' },
  { periodo: 68, aluguel: 'R$ 460,00', gastoMoradiaMensal: 'R$ 1.535,00', aquisicaoFracao: 'R$ 69.000,00', percentualImovelAdquirido: '43,13%' },
  { periodo: 69, aluguel: 'R$ 455,00', gastoMoradiaMensal: 'R$ 1.530,00', aquisicaoFracao: 'R$ 70.000,00', percentualImovelAdquirido: '43,75%' },
  { periodo: 70, aluguel: 'R$ 450,00', gastoMoradiaMensal: 'R$ 1.525,00', aquisicaoFracao: 'R$ 71.000,00', percentualImovelAdquirido: '44,38%' },
  { periodo: 71, aluguel: 'R$ 445,00', gastoMoradiaMensal: 'R$ 1.520,00', aquisicaoFracao: 'R$ 72.000,00', percentualImovelAdquirido: '45,00%' },
  { periodo: 72, aluguel: 'R$ 440,00', gastoMoradiaMensal: 'R$ 1.515,00', aquisicaoFracao: 'R$ 73.000,00', percentualImovelAdquirido: '45,63%' },
  { periodo: 73, aluguel: 'R$ 435,00', gastoMoradiaMensal: 'R$ 1.510,00', aquisicaoFracao: 'R$ 74.000,00', percentualImovelAdquirido: '46,25%' },
  { periodo: 74, aluguel: 'R$ 430,00', gastoMoradiaMensal: 'R$ 1.505,00', aquisicaoFracao: 'R$ 75.000,00', percentualImovelAdquirido: '46,88%' },
  { periodo: 75, aluguel: 'R$ 425,00', gastoMoradiaMensal: 'R$ 1.500,00', aquisicaoFracao: 'R$ 76.000,00', percentualImovelAdquirido: '47,50%' },
  { periodo: 76, aluguel: 'R$ 420,00', gastoMoradiaMensal: 'R$ 1.495,00', aquisicaoFracao: 'R$ 77.000,00', percentualImovelAdquirido: '48,13%' },
  { periodo: 77, aluguel: 'R$ 415,00', gastoMoradiaMensal: 'R$ 1.490,00', aquisicaoFracao: 'R$ 78.000,00', percentualImovelAdquirido: '48,75%' },
  { periodo: 78, aluguel: 'R$ 410,00', gastoMoradiaMensal: 'R$ 1.485,00', aquisicaoFracao: 'R$ 79.000,00', percentualImovelAdquirido: '49,38%' },
  { periodo: 79, aluguel: 'R$ 405,00', gastoMoradiaMensal: 'R$ 1.480,00', aquisicaoFracao: 'R$ 80.000,00', percentualImovelAdquirido: '50,00%' },
  { periodo: 80, aluguel: 'R$ 400,00', gastoMoradiaMensal: 'R$ 1.475,00', aquisicaoFracao: 'R$ 81.000,00', percentualImovelAdquirido: '50,63%' },
  { periodo: 81, aluguel: 'R$ 395,00', gastoMoradiaMensal: 'R$ 1.470,00', aquisicaoFracao: 'R$ 82.000,00', percentualImovelAdquirido: '51,25%' },
  { periodo: 82, aluguel: 'R$ 390,00', gastoMoradiaMensal: 'R$ 1.465,00', aquisicaoFracao: 'R$ 83.000,00', percentualImovelAdquirido: '51,88%' },
  { periodo: 83, aluguel: 'R$ 385,00', gastoMoradiaMensal: 'R$ 1.460,00', aquisicaoFracao: 'R$ 84.000,00', percentualImovelAdquirido: '52,50%' },
  { periodo: 84, aluguel: 'R$ 380,00', gastoMoradiaMensal: 'R$ 1.455,00', aquisicaoFracao: 'R$ 85.000,00', percentualImovelAdquirido: '53,13%' },
  { periodo: 85, aluguel: 'R$ 375,00', gastoMoradiaMensal: 'R$ 1.450,00', aquisicaoFracao: 'R$ 86.000,00', percentualImovelAdquirido: '53,75%' },
  { periodo: 86, aluguel: 'R$ 370,00', gastoMoradiaMensal: 'R$ 1.445,00', aquisicaoFracao: 'R$ 87.000,00', percentualImovelAdquirido: '54,38%' },
  { periodo: 87, aluguel: 'R$ 365,00', gastoMoradiaMensal: 'R$ 1.440,00', aquisicaoFracao: 'R$ 88.000,00', percentualImovelAdquirido: '55,00%' },
  { periodo: 88, aluguel: 'R$ 360,00', gastoMoradiaMensal: 'R$ 1.435,00', aquisicaoFracao: 'R$ 89.000,00', percentualImovelAdquirido: '55,63%' },
  { periodo: 89, aluguel: 'R$ 355,00', gastoMoradiaMensal: 'R$ 1.430,00', aquisicaoFracao: 'R$ 90.000,00', percentualImovelAdquirido: '56,25%' },
  { periodo: 90, aluguel: 'R$ 350,00', gastoMoradiaMensal: 'R$ 1.425,00', aquisicaoFracao: 'R$ 91.000,00', percentualImovelAdquirido: '56,88%' },
  { periodo: 91, aluguel: 'R$ 345,00', gastoMoradiaMensal: 'R$ 1.420,00', aquisicaoFracao: 'R$ 92.000,00', percentualImovelAdquirido: '57,50%' },
  { periodo: 92, aluguel: 'R$ 340,00', gastoMoradiaMensal: 'R$ 1.415,00', aquisicaoFracao: 'R$ 93.000,00', percentualImovelAdquirido: '58,13%' },
  { periodo: 93, aluguel: 'R$ 335,00', gastoMoradiaMensal: 'R$ 1.410,00', aquisicaoFracao: 'R$ 94.000,00', percentualImovelAdquirido: '58,75%' },
  { periodo: 94, aluguel: 'R$ 330,00', gastoMoradiaMensal: 'R$ 1.405,00', aquisicaoFracao: 'R$ 95.000,00', percentualImovelAdquirido: '59,38%' },
  { periodo: 95, aluguel: 'R$ 325,00', gastoMoradiaMensal: 'R$ 1.400,00', aquisicaoFracao: 'R$ 96.000,00', percentualImovelAdquirido: '60,00%' },
  { periodo: 96, aluguel: 'R$ 320,00', gastoMoradiaMensal: 'R$ 1.395,00', aquisicaoFracao: 'R$ 97.000,00', percentualImovelAdquirido: '60,63%' },
  { periodo: 97, aluguel: 'R$ 315,00', gastoMoradiaMensal: 'R$ 1.390,00', aquisicaoFracao: 'R$ 98.000,00', percentualImovelAdquirido: '61,25%' },
  { periodo: 98, aluguel: 'R$ 310,00', gastoMoradiaMensal: 'R$ 1.385,00', aquisicaoFracao: 'R$ 99.000,00', percentualImovelAdquirido: '61,88%' },
  { periodo: 99, aluguel: 'R$ 305,00', gastoMoradiaMensal: 'R$ 1.380,00', aquisicaoFracao: 'R$ 100.000,00', percentualImovelAdquirido: '62,50%' },
  { periodo: 100, aluguel: 'R$ 300,00', gastoMoradiaMensal: 'R$ 1.375,00', aquisicaoFracao: 'R$ 101.000,00', percentualImovelAdquirido: '63,13%' },
  { periodo: 101, aluguel: 'R$ 295,00', gastoMoradiaMensal: 'R$ 1.370,00', aquisicaoFracao: 'R$ 102.000,00', percentualImovelAdquirido: '63,75%' },
  { periodo: 102, aluguel: 'R$ 290,00', gastoMoradiaMensal: 'R$ 1.365,00', aquisicaoFracao: 'R$ 103.000,00', percentualImovelAdquirido: '64,38%' },
  { periodo: 103, aluguel: 'R$ 285,00', gastoMoradiaMensal: 'R$ 1.360,00', aquisicaoFracao: 'R$ 104.000,00', percentualImovelAdquirido: '65,00%' },
  { periodo: 104, aluguel: 'R$ 280,00', gastoMoradiaMensal: 'R$ 1.355,00', aquisicaoFracao: 'R$ 105.000,00', percentualImovelAdquirido: '65,63%' },
  { periodo: 105, aluguel: 'R$ 275,00', gastoMoradiaMensal: 'R$ 1.350,00', aquisicaoFracao: 'R$ 106.000,00', percentualImovelAdquirido: '66,25%' },
  { periodo: 106, aluguel: 'R$ 270,00', gastoMoradiaMensal: 'R$ 1.345,00', aquisicaoFracao: 'R$ 107.000,00', percentualImovelAdquirido: '66,88%' },
  { periodo: 107, aluguel: 'R$ 265,00', gastoMoradiaMensal: 'R$ 1.340,00', aquisicaoFracao: 'R$ 108.000,00', percentualImovelAdquirido: '67,50%' },
  { periodo: 108, aluguel: 'R$ 260,00', gastoMoradiaMensal: 'R$ 1.335,00', aquisicaoFracao: 'R$ 109.000,00', percentualImovelAdquirido: '68,13%' },
  { periodo: 109, aluguel: 'R$ 255,00', gastoMoradiaMensal: 'R$ 1.330,00', aquisicaoFracao: 'R$ 110.000,00', percentualImovelAdquirido: '68,75%' },
  { periodo: 110, aluguel: 'R$ 250,00', gastoMoradiaMensal: 'R$ 1.325,00', aquisicaoFracao: '111.000,00', percentualImovelAdquirido: '69,38%' },
  { periodo: 111, aluguel: 'R$ 245,00', gastoMoradiaMensal: 'R$ 1.320,00', aquisicaoFracao: '112.000,00', percentualImovelAdquirido: '70,00%' },
  { periodo: 112, aluguel: 'R$ 240,00', gastoMoradiaMensal: 'R$ 1.315,00', aquisicaoFracao: '113.000,00', percentualImovelAdquirido: '70,63%' },
  { periodo: 113, aluguel: 'R$ 235,00', gastoMoradiaMensal: 'R$ 1.310,00', aquisicaoFracao: '114.000,00', percentualImovelAdquirido: '71,25%' },
  { periodo: 114, aluguel: 'R$ 230,00', gastoMoradiaMensal: 'R$ 1.305,00', aquisicaoFracao: '115.000,00', percentualImovelAdquirido: '71,88%' },
  { periodo: 115, aluguel: 'R$ 225,00', gastoMoradiaMensal: 'R$ 1.300,00', aquisicaoFracao: '116.000,00', percentualImovelAdquirido: '72,50%' },
  { periodo: 116, aluguel: 'R$ 220,00', gastoMoradiaMensal: 'R$ 1.295,00', aquisicaoFracao: '117.000,00', percentualImovelAdquirido: '73,13%' },
  { periodo: 117, aluguel: 'R$ 215,00', gastoMoradiaMensal: 'R$ 1.290,00', aquisicaoFracao: '118.000,00', percentualImovelAdquirido: '73,75%' },
  { periodo: 118, aluguel: 'R$ 210,00', gastoMoradiaMensal: 'R$ 1.285,00', aquisicaoFracao: '119.000,00', percentualImovelAdquirido: '74,38%' },
  { periodo: 119, aluguel: 'R$ 205,00', gastoMoradiaMensal: 'R$ 1.280,00', aquisicaoFracao: '120.000,00', percentualImovelAdquirido: '75,00%' },
  { periodo: 120, aluguel: 'R$ 200,00', gastoMoradiaMensal: 'R$ 1.275,00', aquisicaoFracao: '121.000,00', percentualImovelAdquirido: '75,63%' },
  { periodo: 121, aluguel: 'R$ 195,00', gastoMoradiaMensal: 'R$ 1.270,00', aquisicaoFracao: '122.000,00', percentualImovelAdquirido: '76,25%' },
  { periodo: 122, aluguel: 'R$ 190,00', gastoMoradiaMensal: 'R$ 1.265,00', aquisicaoFracao: '123.000,00', percentualImovelAdquirido: '76,88%' },
  { periodo: 123, aluguel: 'R$ 185,00', gastoMoradiaMensal: 'R$ 1.260,00', aquisicaoFracao: '124.000,00', percentualImovelAdquirido: '77,50%' },
  { periodo: 124, aluguel: 'R$ 180,00', gastoMoradiaMensal: 'R$ 1.255,00', aquisicaoFracao: '125.000,00', percentualImovelAdquirido: '78,13%' },
  { periodo: 125, aluguel: 'R$ 175,00', gastoMoradiaMensal: 'R$ 1.250,00', aquisicaoFracao: '126.000,00', percentualImovelAdquirido: '78,75%' },
  { periodo: 126, aluguel: 'R$ 170,00', gastoMoradiaMensal: 'R$ 1.245,00', aquisicaoFracao: '127.000,00', percentualImovelAdquirido: '79,38%' },
  { periodo: 127, aluguel: 'R$ 165,00', gastoMoradiaMensal: 'R$ 1.240,00', aquisicaoFracao: '128.000,00', percentualImovelAdquirido: '80,00%' },
  { periodo: 128, aluguel: 'R$ 160,00', gastoMoradiaMensal: 'R$ 1.235,00', aquisicaoFracao: '129.000,00', percentualImovelAdquirido: '80,63%' },
  { periodo: 129, aluguel: 'R$ 155,00', gastoMoradiaMensal: 'R$ 1.230,00', aquisicaoFracao: '130.000,00', percentualImovelAdquirido: '81,25%' },
  { periodo: 130, aluguel: 'R$ 150,00', gastoMoradiaMensal: 'R$ 1.225,00', aquisicaoFracao: '131.000,00', percentualImovelAdquirido: '81,88%' },
  { periodo: 131, aluguel: 'R$ 145,00', gastoMoradiaMensal: 'R$ 1.220,00', aquisicaoFracao: '132.000,00', percentualImovelAdquirido: '82,50%' },
  { periodo: 132, aluguel: 'R$ 140,00', gastoMoradiaMensal: 'R$ 1.215,00', aquisicaoFracao: '133.000,00', percentualImovelAdquirido: '83,13%' },
  { periodo: 133, aluguel: 'R$ 135,00', gastoMoradiaMensal: 'R$ 1.210,00', aquisicaoFracao: '134.000,00', percentualImovelAdquirido: '83,75%' },
  { periodo: 134, aluguel: 'R$ 130,00', gastoMoradiaMensal: 'R$ 1.205,00', aquisicaoFracao: '135.000,00', percentualImovelAdquirido: '84,38%' },
  { periodo: 135, aluguel: 'R$ 125,00', gastoMoradiaMensal: 'R$ 1.200,00', aquisicaoFracao: '136.000,00', percentualImovelAdquirido: '85,00%' },
  { periodo: 136, aluguel: 'R$ 120,00', gastoMoradiaMensal: 'R$ 1.195,00', aquisicaoFracao: '137.000,00', percentualImovelAdquirido: '85,63%' },
  { periodo: 137, aluguel: 'R$ 115,00', gastoMoradiaMensal: 'R$ 1.190,00', aquisicaoFracao: '138.000,00', percentualImovelAdquirido: '86,25%' },
  { periodo: 138, aluguel: 'R$ 110,00', gastoMoradiaMensal: 'R$ 1.185,00', aquisicaoFracao: '139.000,00', percentualImovelAdquirido: '86,88%' },
  { periodo: 139, aluguel: 'R$ 105,00', gastoMoradiaMensal: 'R$ 1.180,00', aquisicaoFracao: '140.000,00', percentualImovelAdquirido: '87,50%' },
  { periodo: 140, aluguel: 'R$ 100,00', gastoMoradiaMensal: 'R$ 1.175,00', aquisicaoFracao: '141.000,00', percentualImovelAdquirido: '88,13%' },
  { periodo: 141, aluguel: 'R$ 95,00', gastoMoradiaMensal: 'R$ 1.170,00', aquisicaoFracao: '142.000,00', percentualImovelAdquirido: '88,75%' },
  { periodo: 142, aluguel: 'R$ 90,00', gastoMoradiaMensal: 'R$ 1.165,00', aquisicaoFracao: '143.000,00', percentualImovelAdquirido: '89,38%' },
  { periodo: 143, aluguel: 'R$ 85,00', gastoMoradiaMensal: 'R$ 1.160,00', aquisicaoFracao: '144.000,00', percentualImovelAdquirido: '90,00%' },
  { periodo: 144, aluguel: 'R$ 80,00', gastoMoradiaMensal: 'R$ 1.155,00', aquisicaoFracao: '145.000,00', percentualImovelAdquirido: '90,63%' },
  { periodo: 145, aluguel: 'R$ 75,00', gastoMoradiaMensal: 'R$ 1.150,00', aquisicaoFracao: '146.000,00', percentualImovelAdquirido: '91,25%' },
  { periodo: 146, aluguel: 'R$ 70,00', gastoMoradiaMensal: 'R$ 1.145,00', aquisicaoFracao: '147.000,00', percentualImovelAdquirido: '91,88%' },
  { periodo: 147, aluguel: 'R$ 65,00', gastoMoradiaMensal: 'R$ 1.140,00', aquisicaoFracao: '148.000,00', percentualImovelAdquirido: '92,50%' },
  { periodo: 148, aluguel: 'R$ 60,00', gastoMoradiaMensal: 'R$ 1.135,00', aquisicaoFracao: '149.000,00', percentualImovelAdquirido: '93,13%' },
  { periodo: 149, aluguel: 'R$ 55,00', gastoMoradiaMensal: 'R$ 1.130,00', aquisicaoFracao: '150.000,00', percentualImovelAdquirido: '93,75%' },
  { periodo: 150, aluguel: 'R$ 50,00', gastoMoradiaMensal: 'R$ 1.125,00', aquisicaoFracao: '151.000,00', percentualImovelAdquirido: '94,38%' },
  { periodo: 151, aluguel: 'R$ 45,00', gastoMoradiaMensal: 'R$ 1.120,00', aquisicaoFracao: '152.000,00', percentualImovelAdquirido: '95,00%' },
  { periodo: 152, aluguel: 'R$ 40,00', gastoMoradiaMensal: 'R$ 1.115,00', aquisicaoFracao: '153.000,00', percentualImovelAdquirido: '95,63%' },
  { periodo: 153, aluguel: 'R$ 35,00', gastoMoradiaMensal: 'R$ 1.110,00', aquisicaoFracao: '154.000,00', percentualImovelAdquirido: '96,25%' },
  { periodo: 154, aluguel: 'R$ 30,00', gastoMoradiaMensal: 'R$ 1.105,00', aquisicaoFracao: '155.000,00', percentualImovelAdquirido: '96,88%' },
  { periodo: 155, aluguel: 'R$ 25,00', gastoMoradiaMensal: 'R$ 1.100,00', aquisicaoFracao: '156.000,00', percentualImovelAdquirido: '97,50%' },
  { periodo: 156, aluguel: 'R$ 20,00', gastoMoradiaMensal: 'R$ 1.095,00', aquisicaoFracao: '157.000,00', percentualImovelAdquirido: '98,13%' },
  { periodo: 157, aluguel: 'R$ 15,00', gastoMoradiaMensal: 'R$ 1.090,00', aquisicaoFracao: '158.000,00', percentualImovelAdquirido: '98,75%' },
  { periodo: 158, aluguel: 'R$ 10,00', gastoMoradiaMensal: 'R$ 1.085,00', aquisicaoFracao: '159.000,00', percentualImovelAdquirido: '99,38%' },
  { periodo: 159, aluguel: 'R$ 5,00', gastoMoradiaMensal: 'R$ 1.080,00', aquisicaoFracao: '160.000,00', percentualImovelAdquirido: '100,00%' },
];

const dadosParte1 = dadosExemplo.slice(0, 80);
const dadosParte2 = dadosExemplo.slice(80);

export default function Page2(): JSX.Element {

  const SECURITY_VIEW = process.env.SECURITY_VIEW === "true";
  const [wallet, setWallet] = useState<string | null>(null);
  const [propertyDetail, setPropertyDetail] = useState<PropertyDetailType | null>(null);

  useEffect(() => {
    
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet && !wallet) {
      setWallet(storedWallet);
    }

    async function fetchData() {
      try {
        const details = await getPropertyDetail(1);
        setPropertyDetail(details);
      } catch (error) {
        console.error('Erro ao obter detalhes da propriedade:', error);
      }
    }

    if (wallet) {
      fetchData();
    }
  }, [wallet]);
  if (!wallet) {
    return <Desconnected />;
  }

  const shouldShowProperty = SECURITY_VIEW
  ? propertyDetail &&
  (    
    wallet?.toUpperCase() === propertyDetail.ownerContract.toUpperCase() ||
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
    <div className="container">
<div className="intropaga">
  <div className="fluxepagamento">
Fluxo de pagamento
  </div>
<div className="caixa">


 	
   PROPRIETÁRIA cria os tokens na plataforma da Firmeza Token, cada token deve representar R$1,00 do imóvel. LOCATÁRIA - 
   ADQUIRENTE paga aluguel integral no primeiro mês e adquire as primeiras frações. Assim que o pagamento for efetuado pela
    LOCATÁRIA - ADQUIRENTE, esta deverá enviar o comprovante do pagamento á Firmeza Token. A Firmeza Token então, 
    deverá informar a PROPRIETÁRIA dos tokens através da plataforma, anexando o comprovante do pagamento. O
     valor correspondente em reias deverá ser transferido pela PROPRIETÁRIA 
   para a carteira digital da LOCATÁRIA  - ADQUIRENTE em até 3 dias úteis após a 
   confirmação de pagamento pela Firmeza Token. No próximo mês, o percentual proporcional 
   da aquisição feita pela LOCATÁRIA - ADQUIRENTE não deverá ser cobrado no aluguel, pois a proprietária dessas 
   fracões agora é a mesma pessoa pagante, ou seja, a própria LOCATÁRIA - ADQUIRENTE.

</div>
</div>
<div className="observacoes">
<table>
<thead>
<tr>
<th>
R$ 1.000,00: Valor mensal de aquisição das frações
</th>
<th>
0,625%:Cada 1 mil reais adquiridos correspondem a esta porcentagem
</th>
<th>
R$ 70,00: Taxa da Firmeza sobre aquisiução das frações
</th>
</tr>

</thead>

</table>
</div>
      <div className="row">
        {/* Primeira Tabela */}
        <div className="col-md-6">
        
          <table className="table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Aluguel</th>
                <th>Gasto Mensal</th>
                <th>Aquisição da Fração</th>
                <th>Percentual do Imóvel</th>
              </tr>
            </thead>
            <tbody>
              {dadosParte1.map((dado) => (
                <tr key={dado.periodo}>
                  <td>{dado.periodo}</td>
                  <td>{dado.aluguel}</td>
                  <td>{dado.gastoMoradiaMensal}</td>
                  <td>{dado.aquisicaoFracao}</td>
                  <td>{dado.percentualImovelAdquirido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Segunda Tabela */}
        <div className="col-md-6">
         
          <table className="table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Aluguel</th>
                <th>Gasto Mensal</th>
                <th>Aquisição da Fração</th>
                <th>Percentual do Imóvel</th>
              </tr>
            </thead>
            <tbody>
              {dadosParte2.map((dado) => (
                <tr key={dado.periodo}>
                  <td>{dado.periodo}</td>
                  <td>{dado.aluguel}</td>
                  <td>{dado.gastoMoradiaMensal}</td>
                  <td>{dado.aquisicaoFracao}</td>
                  <td>{dado.percentualImovelAdquirido}</td>
                </tr>
              ))}
            </tbody>
          </table>
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