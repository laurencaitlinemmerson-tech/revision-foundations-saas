'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import ModalShell from '@/components/ModalShell';
import type { Folder } from '@/lib/bookmarks/types';

const COLOUR_OPTIONS = [
  { id: 'sage',  hex: '#8BBCAA' },
  { id: 'warm',  hex: '#D4A574' },
  { id: 'slate', hex: '#7BA7CC' },
  { id: 'rose',  hex: '#C89BB0' },
  { id: 'ink',   hex: '#3D3530' },
  { id: 'sand',  hex: '#C4B49A' },
];

interface EditFolderModalProps {
  folder: Folder | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (input: { name: string; colour: string }) => Promise<void>;
}

export default function EditFolderModal({
  folder,
  isOpen,
  isLoading = false,
  onClose,
  onSave,
}: EditFolderModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(folder?.name ?? '');
  const [colour, setColour] = useState(folder?.colour ?? 'sage');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(folder?.name ?? '');
    setColour(folder?.colour ?? 'sage');
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen, folder]);

  function handleClose() {
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Folder name is required.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Folder names must be 50 characters or fewer.');
      return;
    }

    try {
      setError(null);
      await onSave({ name: trimmedName, colour });
      handleClose();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to update folder.');
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} title="Edit folder">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-10 w-10 flex-shrink-0 rounded-full"
              style={{
                background: COLOUR_OPTIONS.find((c) => c.id === colour)?.hex ?? '#8BBCAA',
              }}
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">Edit folder</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--espresso)]">Update folder</h2>
            </div>
          </div>
          <p className="text-sm text-[var(--charcoal)]/72">
            Rename it or pick a different colour.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-[var(--charcoal)]">Folder name</span>
          <input
            ref={inputRef}
            value={name}
            maxLength={50}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-[18px] border border-black/10 bg-[var(--linen-light)] px-4 py-3 text-[var(--espresso)] outline-none transition focus:border-black/20"
            placeholder="Name this folder"
          />
        </label>

        <div>
          <p className="mb-3 text-sm text-[var(--charcoal)]">Colour</p>
          <div className="flex gap-3">
            {COLOUR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setColour(option.id)}
                className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                style={{
                  background: option.hex,
                  outline: colour === option.id ? `2px solid ${option.hex}` : 'none',
                  outlineOffset: '2px',
                }}
                aria-label={`Choose ${option.id}`}
              />
            ))}
          </div>
        </div>

        {error ? (
          <p className="rounded-[16px] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-black/10 px-4 py-2 text-sm text-[var(--charcoal)] transition hover:border-black/16"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[var(--espresso)] px-5 py-2 text-sm text-white transition hover:bg-[#3a2010] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
