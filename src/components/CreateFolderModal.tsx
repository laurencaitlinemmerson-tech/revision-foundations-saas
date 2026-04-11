'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import ModalShell from '@/components/ModalShell';

const COLOUR_OPTIONS = [
  { id: 'sage',  hex: '#8BBCAA' },
  { id: 'warm',  hex: '#D4A574' },
  { id: 'slate', hex: '#7BA7CC' },
  { id: 'rose',  hex: '#C89BB0' },
  { id: 'ink',   hex: '#3D3530' },
  { id: 'sand',  hex: '#C4B49A' },
];

interface CreateFolderModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (input: { name: string; emoji: string }) => Promise<void>;
}

export default function CreateFolderModal({
  isOpen,
  isLoading = false,
  onClose,
  onCreate,
}: CreateFolderModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('sage');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  function handleClose() {
    setName('');
    setEmoji('sage');
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
      await onCreate({ name: trimmedName, emoji });
      handleClose();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to create folder.');
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} title="Create folder">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full"
              style={{
                background: COLOUR_OPTIONS.find((c) => c.id === emoji)?.hex,
              }}
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">New folder</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--espresso)]">Create a folder</h2>
            </div>
          </div>
          <p className="text-sm text-[var(--charcoal)]/72">
            A place for pages you actually come back to.
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
          <p className="mb-2 text-sm text-[var(--charcoal)]">Colour</p>
          <div className="flex gap-2">
            {COLOUR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setEmoji(option.id)}
                className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                style={{
                  background: option.hex,
                  outline: emoji === option.id ? `2px solid ${option.hex}` : 'none',
                  outlineOffset: '2px',
                }}
                aria-label={`Choose ${option.id}`}
              />
            ))}
          </div>
        </div>

        {error ? <p className="rounded-[16px] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

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
            {isLoading ? 'Creating...' : 'Create folder'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
