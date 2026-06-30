```
# PROJECT BRIEF: Arifin Docs & Design
```

## `## Visi & Tujuan` 

```
Membangun website multi-landing page (1-5 halaman) yang scalable, cepat, dan
aman untuk menawarkan layanan jasa dokumen profesional dan produk digital.
Desain visual harus clean & corporate dengan dominasi warna biru dan putih untuk
membangun kepercayaan klien.
```

```
## Target Audience
```

- `Pencari kerja (Fresh Graduate & Profesional)` 

- `Mahasiswa` 

- `Profesional Umum` 

```
## Kategori Penawaran
```

```
### 1. Layanan Jasa (Custom Form to Database -> WhatsApp)
```

```
- CV ATS Friendly
```

- `Surat Lamaran Profesional` 

- `Surat Legal` 

- `NPWP Online` 

- `Jasa Joki Tugas` 

- `Data Entry` 

```
### 2. Produk Digital (Redirect to Lynk.id)
```

```
- Simulasi QnA Interview HRD
```

- `Cara Install Claude Code via Ollama` 

- `Buat Website dengan Prompt` 

- `Cara Install Ulang Windows dengan Ventoy` 

- `Cara Setup Laptop Menjadi Linux` 

- `Template Laporan Keuangan` 

## `## Alur Pengguna (User Flow)` 

```
1. **Layanan Jasa:** Klien memilih layanan -> Mengisi multi-step form kustom
(merujuk pada MASTER_FORM_SERVICES.md) -> Data divalidasi dan disimpan dengan
aman ke Supabase -> Klien otomatis di-redirect ke WhatsApp Admin dengan format
pesan: "Halo Arifin Docs & Design saya sudah mengisi formulir layanan [nama
layanan]".
```

`2. **Produk Digital:** Pengunjung melihat katalog produk digital -> Klik tombol beli -> Redirect ke halaman lynk.id untuk proses pembayaran dan pengunduhan.` 

```
3. **Admin Dashboard:** Hanya dapat diakses melalui autentikasi email & password
untuk melihat rekap data klien yang masuk.
```

