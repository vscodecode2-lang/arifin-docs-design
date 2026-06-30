```
-- DRAFT DATABASE SCHEMA (PostgreSQL - Supabase)
-- Tabel Klien/Pengguna Jasa Umum
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  service_type TEXT NOT NULL, -- Enum: 'CV', 'Lamaran', 'Legal', 'NPWP',
'Akademik', 'Data Entry'
  status TEXT DEFAULT 'pending' -- Enum: 'pending', 'in_progress', 'completed'
);
```

```
-- Tabel Detail Form CV ATS (Contoh spesifik)
CREATE TABLE cv_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  target_position TEXT NOT NULL,
  domicile TEXT NOT NULL,
  education_history JSONB, -- Menyimpan array riwayat pendidikan
  work_experience JSONB, -- Menyimpan array pengalaman kerja
  file_url TEXT -- URL foto atau dokumen pendukung dari Supabase Storage
);
```

```
-- (AI diinstruksikan untuk membuat tabel relasional serupa
-- untuk layanan NPWP, Legal, Akademik, dll. merujuk pada
MASTER_FORM_SERVICES.md)
-- SECURITY: Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_submissions ENABLE ROW LEVEL SECURITY;
```

```
-- Hanya Admin (Authenticated User) yang bisa membaca data
CREATE POLICY "Allow admin read access" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');
```

```
-- Siapapun (Anon) bisa melakukan Insert data via form
CREATE POLICY "Allow anon insert access" ON clients
  FOR INSERT WITH CHECK (true);
```

