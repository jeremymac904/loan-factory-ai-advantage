'use client';

import { useRef, useState } from 'react';
import { UploadCloud, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadBucket } from '@/lib/platform-types';

export interface UploadCardProps {
  title: string;
  description: string;
  /** Future Supabase Storage bucket name. */
  bucket: UploadBucket;
  /** Accept attribute for the file input (e.g. "image/*", ".pdf,.docx"). */
  accept?: string;
  /** Existing asset filename (renders as "uploaded"). */
  existingFileName?: string;
  /** Subtle helper text under the description. */
  helperText?: string;
  /** Fires when a file is chosen (filename only). */
  onSelect?: (fileName: string) => void;
  /** Fires when the chosen file is cleared. */
  onClear?: () => void;
}

/**
 * Drop-target style upload card. Demo-mode only — the file does not leave the
 * browser. When Supabase Storage is wired, `onSelect` should POST to a server
 * action that uploads to `bucket` and returns a signed URL.
 *
 * TODO(supabase): wire to a server action that uploads to the named bucket.
 *   Buckets to create in Storage:
 *     - profile-images
 *     - reference-images
 *     - persona-documents
 *     - brand-assets
 *     - compliance-documents
 *   Policy: write requires service-role; read public for `profile-images`
 *   and `brand-assets`, signed URL only for the others.
 */
export default function UploadCard({
  title,
  description,
  bucket,
  accept,
  existingFileName,
  helperText,
  onSelect,
  onClear,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState<string | null>(existingFileName ?? null);
  const [hover, setHover] = useState(false);

  function onPick(file: File | null) {
    if (!file) return;
    setChosen(file.name);
    // TODO(supabase): upload(file, bucket) → setUrl(signedUrl)
    console.info(`[demo] would upload "${file.name}" to bucket "${bucket}"`);
    onSelect?.(file.name);
  }

  return (
    <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full whitespace-nowrap">
          {bucket}
        </span>
      </div>

      <label
        htmlFor={`upload-${bucket}-${title.replace(/\s+/g, '-').toLowerCase()}`}
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onPick(f);
        }}
        className={cn(
          'flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors',
          chosen
            ? 'border-green-200 bg-green-50/50'
            : hover
            ? 'border-[var(--color-lf-orange)] bg-[var(--color-lf-orange-soft)]'
            : 'border-gray-200 hover:border-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-soft)]/40',
        )}
      >
        <div
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
            chosen
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-500',
          )}
        >
          {chosen ? <Check size={16} /> : <UploadCloud size={16} />}
        </div>

        <div className="min-w-0 flex-1">
          {chosen ? (
            <>
              <p className="text-sm font-semibold text-gray-800 truncate">{chosen}</p>
              <p className="text-[11px] text-gray-500">
                Saved locally — will sync when Supabase Storage is wired.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700">
                Drop file or <span className="text-[var(--color-lf-orange-dark)] underline">browse</span>
              </p>
              <p className="text-[11px] text-gray-400">
                {accept ? `Accepts ${accept}` : 'Any file'}
              </p>
            </>
          )}
        </div>

        {chosen && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setChosen(null);
              if (inputRef.current) inputRef.current.value = '';
              onClear?.();
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        )}

        <input
          ref={inputRef}
          id={`upload-${bucket}-${title.replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </label>

      {helperText && <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">{helperText}</p>}
    </div>
  );
}
