'use client';

import { useState } from 'react';
import { Card } from '../../components/ui';
import type { WeddingContact } from '@/lib/wedding/types';
import type { SectionProps, WeddingWriter } from './types';

function ContactRow({
  contact,
  writer,
}: {
  contact: WeddingContact;
  writer: WeddingWriter;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto auto',
        gap: 12,
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '0.5px solid var(--hairline)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>{contact.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
          {[contact.role, contact.phone, contact.email, contact.detail]
            .filter(Boolean)
            .join(' · ') || 'no details yet'}
        </div>
      </div>

      {contact.kind === 'party' ? (
        <button
          type="button"
          className="op-btn"
          aria-pressed={contact.attendingHen}
          disabled={writer.busy}
          onClick={() => writer.save('contacts', { attendingHen: !contact.attendingHen }, contact.id)}
          style={
            contact.attendingHen
              ? { background: 'var(--card-tint)', borderColor: 'var(--line-violet)', color: 'var(--mauve)' }
              : undefined
          }
        >
          {contact.attendingHen ? '✓ hen' : 'hen?'}
        </button>
      ) : (
        <span />
      )}

      <button
        type="button"
        className="op-step"
        aria-label={`Delete ${contact.name}`}
        disabled={writer.busy}
        onClick={() => writer.remove('contacts', contact.id)}
      >
        ×
      </button>
    </div>
  );
}

function AddContact({ writer, kind }: { writer: WeddingWriter; kind: 'party' | 'vendor' }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [detail, setDetail] = useState('');

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    writer
      .save('contacts', { name: trimmed, kind, role: role.trim(), detail: detail.trim() || null })
      .then((ok) => {
        if (ok) {
          setName('');
          setRole('');
          setDetail('');
        }
      });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) auto',
        gap: 8,
        marginTop: 14,
        paddingTop: 14,
        borderTop: '0.5px solid var(--hairline)',
      }}
    >
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit();
        }}
        aria-label="Name"
      />
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder={kind === 'party' ? 'Role' : 'What they do'}
        value={role}
        onChange={(event) => setRole(event.target.value)}
        aria-label="Role"
      />
      <input
        className="op-input"
        style={{ fontSize: 13, padding: '9px 12px' }}
        placeholder={kind === 'party' ? 'Dress size, notes' : 'Phone, booking ref'}
        value={detail}
        onChange={(event) => setDetail(event.target.value)}
        aria-label="Details"
      />
      <button
        type="button"
        className="op-btn"
        data-variant="solid"
        disabled={writer.busy || !name.trim()}
        onClick={submit}
      >
        Add
      </button>
    </div>
  );
}

export default function People({ snapshot, summary, writer }: SectionProps) {
  const party = snapshot.contacts.filter((contact) => contact.kind === 'party');
  const vendors = snapshot.contacts.filter((contact) => contact.kind === 'vendor');

  return (
    <div className="op-grid op-grid-2" style={{ alignItems: 'start' }}>
      <Card
        title="Bridal party"
        sub="Who's in it, and who's coming to the hen."
        action={<span className="op-chip">{summary.henAttending} for the hen</span>}
      >
        {party.length ? (
          party.map((contact) => <ContactRow key={contact.id} contact={contact} writer={writer} />)
        ) : (
          <p className="op-empty">No one added yet.</p>
        )}
        <AddContact writer={writer} kind="party" />
      </Card>

      <Card title="Vendors & venue" sub="Everyone you might need to ring on the day.">
        {vendors.length ? (
          vendors.map((contact) => <ContactRow key={contact.id} contact={contact} writer={writer} />)
        ) : (
          <p className="op-empty">Florist, photographer, venue coordinator, cake…</p>
        )}
        <AddContact writer={writer} kind="vendor" />
      </Card>
    </div>
  );
}
