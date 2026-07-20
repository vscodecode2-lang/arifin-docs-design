"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
};

function createId() {
  return `experience-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyEntry(): ExperienceEntry {
  return { id: createId(), company: "", position: "", period: "", description: "" };
}

function parseExperienceEntries(rawValue: string): ExperienceEntry[] {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return [createEmptyEntry()];
  }

  const blocks = trimmed.split(/\n\s*---\s*\n/).filter(Boolean);

  if (blocks.length > 0) {
    const parsed = blocks.map((block) => {
      const entry = createEmptyEntry();
      const lines = block.split(/\n/);

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (/^Perusahaan:/i.test(trimmedLine)) {
          entry.company = trimmedLine.replace(/^Perusahaan:\s*/i, "");
        } else if (/^Posisi:/i.test(trimmedLine)) {
          entry.position = trimmedLine.replace(/^Posisi:\s*/i, "");
        } else if (/^Periode:/i.test(trimmedLine)) {
          entry.period = trimmedLine.replace(/^Periode:\s*/i, "");
        } else if (/^Deskripsi:/i.test(trimmedLine)) {
          entry.description = trimmedLine.replace(/^Deskripsi:\s*/i, "");
        } else {
          entry.description = entry.description
            ? `${entry.description}\n${trimmedLine}`
            : trimmedLine;
        }
      });

      return entry;
    });

    if (parsed.some((item) => Object.values(item).some((value) => value.trim()))) {
      return parsed;
    }
  }

  return [{ ...createEmptyEntry(), description: trimmed }];
}

function serializeExperienceEntries(entries: ExperienceEntry[]): string {
  const cleaned = entries
    .map((entry) => ({
      company: entry.company.trim(),
      position: entry.position.trim(),
      period: entry.period.trim(),
      description: entry.description.trim(),
    }))
    .filter((entry) => Object.values(entry).some((value) => value.length > 0));

  if (cleaned.length === 0) return "";

  return cleaned
    .map((entry) => {
      const lines: string[] = [];
      if (entry.company) lines.push(`Perusahaan: ${entry.company}`);
      if (entry.position) lines.push(`Posisi: ${entry.position}`);
      if (entry.period) lines.push(`Periode: ${entry.period}`);
      if (entry.description) lines.push(`Deskripsi: ${entry.description}`);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}

export function ExperienceEntryList({
  label,
  required,
  helper,
  error,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [entries, setEntries] = useState<ExperienceEntry[]>(() => parseExperienceEntries(value));

  const syncEntries = (nextEntries: ExperienceEntry[]) => {
    setEntries(nextEntries);
    onChange(serializeExperienceEntries(nextEntries));
  };

  const updateEntry = (index: number, field: keyof ExperienceEntry, nextValue: string) => {
    const nextEntries = entries.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: nextValue } : entry,
    );
    syncEntries(nextEntries);
  };

  const addEntry = () => {
    syncEntries([...entries, createEmptyEntry()]);
  };

  const removeEntry = (index: number) => {
    if (entries.length === 1) {
      syncEntries([createEmptyEntry()]);
      return;
    }

    const nextEntries = entries.filter((_, entryIndex) => entryIndex !== index);
    syncEntries(nextEntries);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah pengalaman
        </button>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={entry.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Pengalaman {index + 1}</p>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nama Perusahaan</label>
                <input
                  autoCapitalize="words"
                  autoComplete="off"
                  spellCheck={false}
                  value={entry.company}
                  onChange={(event) => updateEntry(index, "company", event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Contoh: PT Teknologi Maju"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Posisi / Jabatan</label>
                <input
                  autoCapitalize="words"
                  autoComplete="off"
                  spellCheck={false}
                  value={entry.position}
                  onChange={(event) => updateEntry(index, "position", event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Contoh: UI/UX Designer"
                />
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Periode</label>
                <input
                  autoCapitalize="words"
                  autoComplete="off"
                  spellCheck={false}
                  value={entry.period}
                  onChange={(event) => updateEntry(index, "period", event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Contoh: Jan 2022 - Sekarang"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deskripsi Singkat</label>
                <textarea
                  autoCapitalize="sentences"
                  autoComplete="off"
                  spellCheck={false}
                  rows={3}
                  value={entry.description}
                  onChange={(event) => updateEntry(index, "description", event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Ceritakan tanggung jawab utama, hasil, atau pencapaian"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
