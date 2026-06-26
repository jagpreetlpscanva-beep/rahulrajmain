"use client";

import { useState, type ChangeEvent } from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "list"
  | "image"
  | "video"
  | "colorPair"
  | "select"
  | "date"
  | "number";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  optional?: boolean;
  hint?: string;
  options?: readonly string[];
}

interface Item {
  id: string;
  title: string;
}

interface Props<T extends Item> {
  label: string;
  items: T[];
  fields: FieldDef[];
  blank: () => T;
  onChange: (items: T[]) => void;
  onReset: () => void;
  previewHref: string;
}

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

export function CollectionManager<T extends Item>({
  label,
  items,
  fields,
  blank,
  onChange,
  onReset,
  previewHref,
}: Props<T>) {
  const [draft, setDraft] = useState<T | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((it) => {
        const rec = it as Record<string, unknown>;
        return [it.title, rec.category, rec.tagline, rec.description, rec.venue, rec.price, rec.level]
          .some((v) => typeof v === "string" && v.toLowerCase().includes(q));
      })
    : items;

  const startAdd = () => {
    setDraft(blank());
    setIsNew(true);
  };
  const startEdit = (item: T) => {
    setDraft({ ...item });
    setIsNew(false);
  };
  const cancel = () => {
    setDraft(null);
    setIsNew(false);
  };

  const setField = (name: string, value: unknown) =>
    setDraft((d) => (d ? ({ ...d, [name]: value } as T) : d));

  const save = () => {
    if (!draft) return;
    if (!String(draft.title).trim()) {
      alert("Please enter a title.");
      return;
    }
    const next = isNew
      ? [...items, draft]
      : items.map((it) => (it.id === draft.id ? draft : it));
    onChange(next);
    cancel();
  };

  const remove = (id: string) => {
    if (confirm("Delete this item? This cannot be undone.")) {
      onChange(items.filter((it) => it.id !== id));
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-ink">
          {label} <span className="text-ink/40">({items.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-ink/5"
          >
            View page ↗
          </a>
          <button
            type="button"
            onClick={() => confirm(`Reset all ${label.toLowerCase()} to the original demo content?`) && onReset()}
            className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-ink/5"
          >
            Reset demo
          </button>
          {!draft && (
            <button
              type="button"
              onClick={startAdd}
              className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-night shadow-gold-btn"
            >
              + Add New
            </button>
          )}
        </div>
      </div>

      {/* editor */}
      {draft ? (
        <div className="rounded-2xl border border-gold-500/25 bg-white p-5 shadow-card sm:p-6">
          <h3 className="mb-4 font-serif text-lg font-bold text-ink">
            {isNew ? `Add new ${label.replace(/s$/, "").toLowerCase()}` : `Edit “${draft.title}”`}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">
                  {f.label}
                  {f.optional && <span className="ml-1 font-normal text-ink/35">(optional)</span>}
                </label>
                <FieldInput field={f} value={(draft as Record<string, unknown>)[f.name]} onChange={(v) => setField(f.name, v)} />
                {f.hint && <p className="mt-1 text-xs text-ink/45">{f.hint}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={cancel} className="rounded-lg border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:bg-ink/5">
              Cancel
            </button>
            <button type="button" onClick={save} className="rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-night shadow-gold-btn">
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* search */}
          <div className="relative mb-4">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()} by name…`}
              className="w-full rounded-lg border border-ink/15 bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            />
          </div>

          <ul className="space-y-2.5">
            {filtered.map((item) => {
              const i = items.indexOf(item);
              const rec = item as Record<string, unknown>;
              const accent = Array.isArray(rec.accent) ? (rec.accent as string[]) : null;
              const img = (rec.image || rec.thumbnail) as string | undefined;
              const meta = [rec.category, rec.tagline, rec.venue, rec.date, rec.price]
                .filter(Boolean)
                .join(" · ");
              return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3 shadow-sm"
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={item.title} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span
                    className="h-11 w-11 shrink-0 rounded-lg"
                    style={{ background: accent ? `linear-gradient(150deg, ${accent[0]}, ${accent[1]})` : "#e9dcc2" }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{item.title || "Untitled"}</p>
                  <p className="truncate text-xs text-ink/55">{meta || "—"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="grid h-8 w-8 place-items-center rounded-md text-ink/50 hover:bg-ink/5 disabled:opacity-30" disabled={i <= 0 || !!q}>
                    ↑
                  </button>
                  <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="grid h-8 w-8 place-items-center rounded-md text-ink/50 hover:bg-ink/5 disabled:opacity-30" disabled={i === items.length - 1 || !!q}>
                    ↓
                  </button>
                  <button type="button" onClick={() => startEdit(item)} className="rounded-md px-3 py-1.5 text-sm font-medium text-gold-700 hover:bg-gold-100/70">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(item.id)} className="rounded-md px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
                    Delete
                  </button>
                </div>
              </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-ink/50">
                {q ? `No ${label.toLowerCase()} match “${query}”.` : "No items yet — click “Add New”."}
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response (server crash / proxy page) */
      }
      if (res.ok && data.url) {
        onChange(data.url);
      } else if (res.status === 401) {
        alert("Your admin session expired. Refresh the page, sign in again, then re-upload.");
      } else {
        alert(`Upload failed (status ${res.status})${data.error ? `: ${data.error}` : ""}`);
      }
    } catch {
      alert("Upload failed — could not reach the server. Is it still running?");
    } finally {
      setUploading(false);
    }
  };

  if (field.type === "textarea") {
    return (
      <textarea
        rows={3}
        className={inputCls}
        placeholder={field.placeholder}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "list") {
    const text = Array.isArray(value) ? (value as string[]).join("\n") : "";
    return (
      <textarea
        rows={3}
        className={inputCls}
        placeholder={field.placeholder ?? "One item per line"}
        value={text}
        onChange={(e) =>
          onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
        }
      />
    );
  }
  if (field.type === "colorPair") {
    const pair = (Array.isArray(value) ? value : ["#C08A2E", "#7A5212"]) as string[];
    return (
      <div className="flex items-center gap-3">
        {[0, 1].map((idx) => (
          <input
            key={idx}
            type="color"
            value={pair[idx] ?? "#000000"}
            onChange={(e) => {
              const next = [...pair];
              next[idx] = e.target.value;
              onChange(next);
            }}
            className="h-10 w-14 cursor-pointer rounded-md border border-ink/15"
          />
        ))}
        <span
          className="h-10 flex-1 rounded-md border border-ink/10"
          style={{ background: `linear-gradient(150deg, ${pair[0]}, ${pair[1]})` }}
        />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <select
        className={inputCls}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "date") {
    return (
      <input
        type="date"
        className={inputCls}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "number") {
    return (
      <input
        type="number"
        className={inputCls}
        placeholder={field.placeholder}
        value={value === undefined || value === null ? "" : (value as number)}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    );
  }
  if (field.type === "image" || field.type === "video") {
    const isVideo = field.type === "video";
    const url = (value as string) ?? "";
    return (
      <div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className={inputCls}
            placeholder={field.placeholder ?? (isVideo ? "/uploads/video.mp4 or a YouTube/Vimeo link" : "/uploads/image.jpg or https://…")}
            value={url}
            onChange={(e) => onChange(e.target.value)}
          />
          {url && !isVideo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
          )}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-gold-500/40 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 hover:bg-gold-100">
            {uploading ? "Uploading…" : isVideo ? "Upload video" : "Upload image"}
            <input
              type="file"
              accept={isVideo ? "video/*" : "image/*"}
              className="hidden"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
          {url && isVideo && (
            <a href={url} target="_blank" rel="noreferrer" className="text-xs text-gold-700 underline">
              Preview video ↗
            </a>
          )}
          {!url && <span className="text-xs text-ink/40">or paste a link above</span>}
        </div>
      </div>
    );
  }
  return (
    <input
      type="text"
      className={inputCls}
      placeholder={field.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
