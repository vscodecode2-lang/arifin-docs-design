## `# CODING RULES & STANDARDS` 

## `## Arsitektur & Penulisan Kode` 

- `Selalu gunakan Functional Components dengan React Hooks.` 

- `Gunakan TypeScript secara ketat. Definisikan `interface` atau `type` untuk semua props dan respons API.` 

- `Terapkan pemisahan logika: Pisahkan UI (komponen presentasional) dari logika bisnis (data fetching/mutasi).` 

- `Gunakan arsitektur Mobile-First Design saat menulis class Tailwind.` 

```
## Standar Form (Mengacu pada MASTER_FORM_SERVICES.md)
```

- `Implementasikan Multi-Step Flow untuk setiap form layanan.` 

- `Sediakan Progress Indicator di setiap form.` 

- `Terapkan Conditional Logic yang ketat sesuai spesifikasi dokumen master.` 

- `Cegah submit berulang dengan mendisable tombol saat state `isLoading`.` 

```
## Keamanan (Security First)
```

- `Tidak boleh ada query database langsung dari Client Components. Semua interaksi database harus melalui Supabase Client atau Next.js Server Actions / Route Handlers.` 

- `Terapkan validasi input dua lapis (Client-side dengan Zod, Server-side sebelum masuk Supabase).` 

- `Pastikan tidak ada API Key atau Service Role Key yang terekspos di Clientside. Gunakan Environment Variables (`.env.local`).` 

- `Manfaatkan Parameterized Queries bawaan Supabase untuk mencegah SQL Injection.` 

- `Sanitasi semua input teks untuk mencegah serangan XSS.` 

