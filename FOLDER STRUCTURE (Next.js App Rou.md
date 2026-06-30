```
# FOLDER STRUCTURE (Next.js App Router)
```

```
/
├── app/
│   ├── (admin)/
│   │   ├── dashboard/       # Halaman admin dashboard (Protected)
│   │   └── login/           # Halaman login admin
│   ├── (public)/
│   │   ├── cv-ats/          # Landing page & form CV
│   │   ├── surat-lamaran/   # Landing page & form Lamaran
│   │   ├── legal/           # Landing page & form Legal
│   │   ├── npwp/            # Landing page & form NPWP
│   │   ├── akademik/        # Landing page & form Joki Tugas
│   │   └── data-entry/      # Landing page & form Data Entry
│   ├── api/                 # Route handlers / Serverless functions
│   ├── globals.css          # Tailwind base
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage (Daftar produk & layanan)
├── components/
│   ├── ui/                  # Reusable UI (Buttons, Inputs, Cards)
│   ├── forms/               # Komponen spesifik form (Multi-step logic)
│   └── layout/              # Navbar, Footer
├── lib/
│   ├── supabase.ts          # Konfigurasi & inisialisasi Supabase client
│   └── utils.ts             # Helper functions (termasuk generator link WA)
├── types/                   # Definisi TypeScript interface
└── public/                  # Assets (Images, Icons)
```

