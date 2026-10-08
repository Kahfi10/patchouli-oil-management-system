/**
 * Utility formatters for NilamHub application
 * Clean, professional financial & commodity formatters
 */

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatKg = (weight: number): string => {
  return `${weight.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg`;
};

export const formatPercent = (val: number): string => {
  return `${val.toFixed(2)}%`;
};

/**
 * Calculate patchouli distillation yield (Rendemen)
 * Rendemen = (Oil Yield in Kg / Dry Leaves in Kg) * 100
 */
export const calculateRendemen = (oilYieldKg: number, dryLeavesKg: number): number => {
  if (dryLeavesKg <= 0) return 0;
  return (oilYieldKg / dryLeavesKg) * 100;
};

/**
 * Evaluate Patchouli Alcohol quality rating against export SNI 06-2385-2006
 * Pure professional text verdicts - Zero emojis.
 */
export const evaluatePatchouliQuality = (paPercentage: number): {
  grade: 'Grade Ekspor Super' | 'Grade A Ekspor' | 'Grade B Standar' | 'Kurang Memenuhi';
  color: string;
  badgeBg: string;
  verdict: string;
} => {
  if (paPercentage >= 34) {
    return {
      grade: 'Grade Ekspor Super',
      color: '#248A3D',
      badgeBg: '#E8F5E9',
      verdict: 'Kadar PA di atas 34%. Kualitas premium ekspor parfum internasional (Premi +15%).',
    };
  }
  if (paPercentage >= 32) {
    return {
      grade: 'Grade A Ekspor',
      color: '#2E7D32',
      badgeBg: '#E8F5E9',
      verdict: 'Kadar PA 32-34%. Sesuai standar ekspor SNI 06-2385-2006.',
    };
  }
  if (paPercentage >= 30) {
    return {
      grade: 'Grade B Standar',
      color: '#B45309',
      badgeBg: '#FEF3C7',
      verdict: 'Kadar PA 30-32%. Batas ambang pasar industri lokal.',
    };
  }
  return {
    grade: 'Kurang Memenuhi',
    color: '#D32F2F',
    badgeBg: '#FFEBEE',
    verdict: 'Kadar PA di bawah 30%. Memerlukan perbaikan proses destilasi uap.',
  };
};
