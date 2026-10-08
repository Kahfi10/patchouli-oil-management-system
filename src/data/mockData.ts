export interface RegionalPrice {
  id: string;
  region: string;
  province: string;
  pricePerKg: number;
  change24h: number; // percentage
  trend: 'up' | 'down' | 'stable';
  avgPA: number; // Patchouli Alcohol percentage
  history: number[]; // 7-day sparkline
  lastUpdated: string;
}

export interface DistillationBatch {
  id: string;
  batchCode: string;
  farmerName: string;
  location: string;
  distilledAt: string;
  dryLeavesKg: number;
  oilYieldKg: number;
  rendemen: number;
  durationHours: number;
  boilerType: 'Stainless Steel Food Grade' | 'Drum Besi Galvanis';
  fuelType: 'Kayu Kering Pilihan' | 'Biomassa Limbah Nilam' | 'LPG / Burner';
  paPercentage: number;
  labCertificateNo: string;
  status: 'Tersedia' | 'Dalam Negosiasi' | 'Terkunci Escrow' | 'Terkirim';
}

export interface MarketListing {
  id: string;
  batchId: string;
  sellerName: string;
  sellerRole: 'Penyuling Langsung' | 'Koperasi Tani Atsiri';
  sellerRating: number;
  verifiedKYC: boolean;
  region: string;
  volumeKg: number;
  pricePerKg: number;
  paPercentage: number;
  boilerType: string;
  escrowGuaranteed: boolean;
  postedAt: string;
  photoUrl: string;
}

export interface EscrowOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  sellerName: string;
  listingTitle: string;
  volumeKg: number;
  totalAmount: number;
  stage: 'PAYMENT_HELD' | 'SHIPPING_TO_HUB' | 'QUALITY_TESTING' | 'FUNDS_RELEASED';
  stageTitle: string;
  stageDesc: string;
  createdAt: string;
  hubLocation: string;
  paTested: number | null;
}

export const REGIONAL_PRICES: RegionalPrice[] = [
  {
    id: 'reg-1',
    region: 'Aceh Selatan',
    province: 'Aceh',
    pricePerKg: 1420000,
    change24h: 3.6,
    trend: 'up',
    avgPA: 34.2,
    history: [1360000, 1375000, 1380000, 1390000, 1405000, 1410000, 1420000],
    lastUpdated: '10 Menit lalu',
  },
  {
    id: 'reg-2',
    region: 'Kolaka & Kendari',
    province: 'Sulawesi Tenggara',
    pricePerKg: 1385000,
    change24h: 1.8,
    trend: 'up',
    avgPA: 33.1,
    history: [1340000, 1350000, 1355000, 1360000, 1370000, 1380000, 1385000],
    lastUpdated: '25 Menit lalu',
  },
  {
    id: 'reg-3',
    region: 'Pasaman Barat',
    province: 'Sumatera Barat',
    pricePerKg: 1350000,
    change24h: -0.7,
    trend: 'down',
    avgPA: 32.4,
    history: [1370000, 1365000, 1360000, 1360000, 1355000, 1352000, 1350000],
    lastUpdated: '1 Jam lalu',
  },
  {
    id: 'reg-4',
    region: 'Trenggalek & Ponorogo',
    province: 'Jawa Timur',
    pricePerKg: 1390000,
    change24h: 2.2,
    trend: 'up',
    avgPA: 33.8,
    history: [1350000, 1360000, 1370000, 1375000, 1380000, 1385000, 1390000],
    lastUpdated: '2 Jam lalu',
  },
];

export const MOCK_BATCHES: DistillationBatch[] = [
  {
    id: 'batch-01',
    batchCode: 'NLM-KLK-2026-088',
    farmerName: 'Pak Syamsuddin',
    location: 'Kolaka Utara, Sulawesi Tenggara',
    distilledAt: '11 Okt 2026',
    dryLeavesKg: 450,
    oilYieldKg: 14.85,
    rendemen: 3.3,
    durationHours: 7.5,
    boilerType: 'Stainless Steel Food Grade',
    fuelType: 'Biomassa Limbah Nilam',
    paPercentage: 33.6,
    labCertificateNo: 'LAB-ATSIRI-0992/SNI',
    status: 'Tersedia',
  },
  {
    id: 'batch-02',
    batchCode: 'NLM-ACH-2026-104',
    farmerName: 'Kelompok Tani Tapaktuan',
    location: 'Aceh Selatan',
    distilledAt: '09 Okt 2026',
    dryLeavesKg: 600,
    oilYieldKg: 21.0,
    rendemen: 3.5,
    durationHours: 8.0,
    boilerType: 'Stainless Steel Food Grade',
    fuelType: 'Kayu Kering Pilihan',
    paPercentage: 35.1,
    labCertificateNo: 'LAB-UNSYIAH-A142/SNI',
    status: 'Dalam Negosiasi',
  },
  {
    id: 'batch-03',
    batchCode: 'NLM-TRG-2026-052',
    farmerName: 'CV Atsiri Jawa Manunggal',
    location: 'Trenggalek, Jatim',
    distilledAt: '08 Okt 2026',
    dryLeavesKg: 300,
    oilYieldKg: 9.3,
    rendemen: 3.1,
    durationHours: 6.5,
    boilerType: 'Drum Besi Galvanis',
    fuelType: 'LPG / Burner',
    paPercentage: 31.8,
    labCertificateNo: 'LAB-UB-8831/REG',
    status: 'Tersedia',
  },
];

export const MOCK_LISTINGS: MarketListing[] = [
  {
    id: 'list-01',
    batchId: 'batch-02',
    sellerName: 'Kelompok Tani Tapaktuan',
    sellerRole: 'Koperasi Tani Atsiri',
    sellerRating: 4.95,
    verifiedKYC: true,
    region: 'Aceh Selatan',
    volumeKg: 21.0,
    pricePerKg: 1420000,
    paPercentage: 35.1,
    boilerType: 'Stainless Steel 316',
    escrowGuaranteed: true,
    postedAt: 'Hari ini, 08:30',
    photoUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'list-02',
    batchId: 'batch-01',
    sellerName: 'Pak Syamsuddin (Ketel Berkah)',
    sellerRole: 'Penyuling Langsung',
    sellerRating: 4.88,
    verifiedKYC: true,
    region: 'Kolaka Utara, Sultra',
    volumeKg: 14.85,
    pricePerKg: 1385000,
    paPercentage: 33.6,
    boilerType: 'Stainless Steel 304',
    escrowGuaranteed: true,
    postedAt: 'Kemarin, 14:15',
    photoUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'list-03',
    batchId: 'batch-03',
    sellerName: 'CV Atsiri Jawa Manunggal',
    sellerRole: 'Penyuling Langsung',
    sellerRating: 4.75,
    verifiedKYC: true,
    region: 'Trenggalek, Jatim',
    volumeKg: 9.3,
    pricePerKg: 1375000,
    paPercentage: 31.8,
    boilerType: 'Galvanized Modern',
    escrowGuaranteed: true,
    postedAt: '2 Hari lalu',
    photoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
  },
];

export const MOCK_ESCROW_ORDERS: EscrowOrder[] = [
  {
    id: 'escrow-101',
    orderNumber: 'ESC-NLM-9941',
    buyerName: 'PT Aroma Fragrance Nusantara (Eksportir)',
    sellerName: 'Kelompok Tani Tapaktuan',
    listingTitle: 'Minyak Nilam Super Grade Aceh Tapaktuan (PA 35.1%)',
    volumeKg: 20.0,
    totalAmount: 28400000,
    stage: 'QUALITY_TESTING',
    stageTitle: 'Tahap 3: Uji Mutu Lab & Verifikasi Timbangan',
    stageDesc: 'Minyak telah tiba di Hub Sentral Medan. Petugas sedang menguji kadar PA via GC-MS.',
    createdAt: '10 Okt 2026',
    hubLocation: 'Collection Hub Medan Sunggal',
    paTested: 35.2,
  },
  {
    id: 'escrow-102',
    orderNumber: 'ESC-NLM-9938',
    buyerName: 'Koperasi Industri Atsiri Nusantara',
    sellerName: 'Pak Syamsuddin',
    listingTitle: 'Minyak Nilam Sulawesi Ketel Stainless (PA 33.6%)',
    volumeKg: 12.0,
    totalAmount: 16620000,
    stage: 'FUNDS_RELEASED',
    stageTitle: 'Tahap 4: Dana Berhasil Dicairkan ke Penjual',
    stageDesc: 'Hasil lab lulus SNI (PA 33.6%). Dana Rp 16.620.000 telah otomatis masuk ke rekening Bank BRI penjual.',
    createdAt: '08 Okt 2026',
    hubLocation: 'Collection Hub Makassar Pelabuhan',
    paTested: 33.6,
  },
];
