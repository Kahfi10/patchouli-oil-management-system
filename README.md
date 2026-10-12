# SulingTrace: Patchouli Oil Distillation & Traceability System 🌿

[![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000020.svg?logo=expo&style=flat-square)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg?logo=react&style=flat-square)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Design](https://img.shields.io/badge/UI%2FUX-Apple%20HIG-000000.svg?logo=apple&style=flat-square)](https://developer.apple.com/design/human-interface-guidelines/)
[![Architecture](https://img.shields.io/badge/Architecture-Offline--First-248A3D.svg?style=flat-square)](https://github.com/Kahfi10/patchouli-oil-management-system)
[![Build APK](https://img.shields.io/badge/Release-APK%20Available-success.svg?style=flat-square)](https://expo.dev/artifacts/eas/QR3_x5HEdZgQBUqngzrOyayS16NA3Sk5OCoSeDAXvYw.apk)

> **SulingTrace** adalah aplikasi mobile cerdas berbasis *Offline-First* yang dirancang untuk mendigitalisasi rantai pasok dan pasca-panen minyak nilam (*Pogostemon cablin*). Menghubungkan petani dan penyuling rakyat dengan transparansi harga regional, kalkulasi rendemen presisi, paspor mutu digital (QR traceability), stopwatch boiler penyulingan, dan diagnostik patologi daun.

---

## 📌 Latar Belakang & Masalah

Indonesia merupakan produsen utama minyak nilam yang menyuplai lebih dari 80% kebutuhan global. Namun, sektor hulu di pedesaan masih menghadapi tantangan besar:
- **Asimetri Harga:** Petani rentan terhadap spekulasi tengkulak karena minimnya akses data harga acuan pasar regional.
- **Kalkulasi Intuitif / Manual:** Rendemen daun dan estimasi HPP (Harga Pokok Produksi) belum dihitung secara sistematis dan matematis.
- **Ketiadaan Ketertelusuran (*Traceability*):** Standar industri ekspor menuntut verifikasi kadar *Patchouli Alcohol* (PA > 30%) dan jenis ketel distilasi, namun penyuling tradisional belum memiliki catatan batch mutu digital.
- **Keterbatasan Sinyal Seluler:** Kebun dan lokasi ketel penyulingan sering kali berada di area pedalaman (*blank spot*), sehingga aplikasi yang bergantung 100% pada internet (*cloud-only*) tidak dapat digunakan.

---

## ✨ Fitur Utama

### 1. 📈 Live Regional Market Ticker & Interactive Chart
- Pemantauan harga acuan minyak nilam terkini di 4 sentra utama: **Aceh, Kolaka, Pasaman, dan Trenggalek**.
- Grafik interaktif tren harga multi-rentang waktu (7 Hari, 30 Hari, 1 Tahun) dengan indikator persentase perubahan harian.

### 2. 🧮 Precision Yield & HPP Calculator
- Simulasi rasio rendemen berdasarkan bobot biomassa daun (basah vs kering) dan volume minyak mentah.
- Kalkulasi otomatis estimasi HPP per kilogram dengan memperhitungkan biaya bahan bakar ketel, tenaga kerja, dan transportasi.
- Proyeksi laba bersih dan fitur **Ekspor Laporan Resmi ke WhatsApp** untuk transaksi langsung dengan pembeli.

### 3. 🛡️ Distillation Batch Tracker & QR Passport
- Pencatatan digital setiap siklus penyulingan: tanggal, varietas, kadar PA%, jenis boiler (*Stainless Steel 304* vs Besi), dan volume minyak.
- Checklist SOP penyulingan standar SNI 06-2385-2006.
- **Digital QR Code Passport Generator** pada setiap batch untuk menjamin keaslian dan ketertelusuran mutu minyak hingga ke tangan eksportir.

### 4. ⏱️ Boiler Live Stopwatch & Phase Tracker
- Stopwatch penghitung waktu distilasi multi-jam (6–8 jam) yang berjalan presisi di latar belakang.
- Panduan indikator tahapan: *Kondensasi Awal* (fraksi ringan) $\to$ *Penyulingan Puncak* (fraksi berat/PA tinggi) $\to$ *Kondensasi Akhir*.

### 5. 🍃 Leaf Pathology Diagnostic
- Modul identifikasi visual untuk penyakit utama tanaman nilam:
  - Layu Bakteri (*Ralstonia solanacearum*)
  - Virus Mosaik (*Potyvirus*)
  - Busuk Fermentasi & Kelembaban Daun Berlebih
- Memberikan rekomendasi penanganan dini sebelum daun masuk ke ketel suling.

### 6. 🏛️ Spot Marketplace & Escrow Transaction
- Bursa lelang terbuka untuk katalog batch minyak terverifikasi dengan filter kadar PA dan jenis ketel.
- Simulasi alur pembayaran aman dua tahap (*Escrow Vault*) untuk melindungi petani dari gagal bayar.

---

## 🏗️ Arsitektur & Teknologi

- **Framework:** [Expo](https://expo.dev/) (SDK 57) / [React Native](https://reactnative.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/) (Strict Typing, `tsc --noEmit` verified)
- **Desain Antarmuka:** *Apple Human Interface Guidelines (HIG)*
  - Palet warna solid & kontras fungsional (*System Green, Apple Amber, System Grouped Canvas*)
  - Kartu modular *Bento Grid* dan tipografi sans-serif adaptif (*SF Pro Text / Roboto*)
- **Penyimpanan Data:** *Offline-First Persistence* via `@react-native-async-storage/async-storage`
- **Distribusi:** EAS Build Cloud (Standalone APK Android & Expo Go iOS)

---

## 📱 Unduh & Instalasi APK (Android)

File installer mandiri Android siap pakai dapat diunduh langsung:
- **Direct Download:** [Download NilamHub.apk](https://expo.dev/artifacts/eas/QR3_x5HEdZgQBUqngzrOyayS16NA3Sk5OCoSeDAXvYw.apk)
- **Expo Build Logs:** [Dashboard Build EAS](https://expo.dev/accounts/kahfiii/projects/patchouli-oil-management-system/builds/9a49d1f4-de4f-4787-afcf-f5425b45f2db)

---

## 🚀 Menjalankan Secara Lokal (Development)

### Prasyarat:
- Node.js (v18+)
- npm atau bun
- Expo Go di smartphone (opsional untuk live preview)

### Langkah Instalasi:
```bash
# 1. Clone repositori
git clone https://github.com/Kahfi10/patchouli-oil-management-system.git
cd patchouli-oil-management-system

# 2. Instal dependensi
npm install

# 3. Jalankan server lokal Expo
npx expo start

# 4. Verifikasi tipe TypeScript
npx tsc --noEmit
```

---

## 👨‍💻 Pengembang

- **Nama:** Kahfi
- **NIM:** 105841108523
- **Email:** ashabulk265@gmail.com
- **GitHub:** [@Kahfi10](https://github.com/Kahfi10)

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).
