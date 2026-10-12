import { Share, Linking, Platform } from 'react-native';
import { formatRupiah, formatKg, formatPercent } from './formatters';
import { DistillationBatch } from '../../data/mockData';

/**
 * Share Patchouli Distillation Batch Report via WhatsApp or System Share
 */
export const shareBatchToWhatsApp = async (batch: DistillationBatch): Promise<void> => {
  const text = 
`*LAPORAN BATCH SULING MINYAK NILAM*
*SulingTrace - Standar Telusur Mutu SNI*
----------------------------------------
Kode Batch: *${batch.batchCode}*
Penyuling: ${batch.farmerName}
Lokasi: ${batch.location}
Tanggal Suling: ${batch.distilledAt}

*Parameter Produksi:*
- Berat Daun Kering: ${formatKg(batch.dryLeavesKg)}
- Hasil Minyak Murni: *${formatKg(batch.oilYieldKg)}*
- Rendemen Ketel: *${formatPercent(batch.rendemen)}*
- Durasi Penyulingan: ${batch.durationHours} Jam
- Jenis Ketel: ${batch.boilerType}

*Hasil Laboratorium:*
- Kadar Patchouli Alcohol (PA): *${batch.paPercentage}%*
- Sertifikat Uji: ${batch.labCertificateNo}
- Status: ${batch.status}
----------------------------------------
_Diverifikasi melalui SulingTrace Traceability Platform_`;

  try {
    if (Platform.OS === 'web') {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      Linking.openURL(waUrl);
      return;
    }
    await Share.share({
      title: `Laporan Batch Nilam - ${batch.batchCode}`,
      message: text,
    });
  } catch (err) {
    console.error('Error sharing batch report', err);
  }
};

/**
 * Share Yield & Production Cost (HPP) Simulation via WhatsApp
 */
export const shareYieldCalculation = async (data: {
  dryLeavesKg: number;
  yieldRate: number;
  oilKg: number;
  fuelCost: number;
  laborCost: number;
  expectedPrice: number;
  netProfit: number;
}): Promise<void> => {
  const totalCost = data.fuelCost + data.laborCost;
  const hppPerKg = data.oilKg > 0 ? totalCost / data.oilKg : 0;
  const grossRevenue = data.oilKg * data.expectedPrice;
  const margin = grossRevenue > 0 ? (data.netProfit / grossRevenue) * 100 : 0;

  const text =
`*SIMULASI RENDEMEN & HPP SULING NILAM*
*SulingTrace Calculator*
----------------------------------------
Bahan Baku Daun: *${formatKg(data.dryLeavesKg)}*
Target Rendemen: *${formatPercent(data.yieldRate)}*
Estimasi Minyak Murni: *${data.oilKg.toFixed(2)} kg* (~${(data.oilKg * 1.05).toFixed(1)} Liter)

*Rincian Biaya Suling (Operasional):*
- Bahan Bakar (Kayu/LPG): ${formatRupiah(data.fuelCost)}
- Upah Operator Ketel: ${formatRupiah(data.laborCost)}
- Total Biaya Suling: *${formatRupiah(totalCost)}*
- HPP per kg Minyak: *${formatRupiah(hppPerKg)}/kg*

*Proyeksi Finansial:*
- Target Harga Pasar: ${formatRupiah(data.expectedPrice)}/kg
- Estimasi Omset: ${formatRupiah(grossRevenue)}
- Estimasi Laba Bersih: *${formatRupiah(data.netProfit)}* (Margin ${margin.toFixed(1)}%)
----------------------------------------
_Dihitung via SulingTrace - Kalkulator Ketel Terintegrasi_`;

  try {
    if (Platform.OS === 'web') {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      Linking.openURL(waUrl);
      return;
    }
    await Share.share({
      title: 'Simulasi Rendemen & HPP Nilam',
      message: text,
    });
  } catch (err) {
    console.error('Error sharing calculation', err);
  }
};
