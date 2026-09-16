'use client';

import { useState, useEffect } from 'react';

/**
 * Fixture for the skill-pack eval. Deliberately a plausible-but-flawed component:
 * it commits a prediction straight into the fields the user is about to type into,
 * with no indication that the values were guessed and no way to tell a guess from
 * something the user entered.
 *
 * Nothing here is a trick. It is the shape a real team ships when "smart defaults"
 * is on the roadmap and nobody has decided what happens when the guess is wrong.
 */

interface Client {
  id: string;
  name: string;
  lastAmount: number;
}

interface Props {
  recentClients: Client[];
  onSubmit: (invoice: { clientId: string; amount: number; notes: string }) => void;
}

export function InvoiceForm({ recentClients, onSubmit }: Props) {
  const [clientId, setClientId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Predict the client and amount from billing history and drop them straight in.
  useEffect(() => {
    if (recentClients.length === 0) return;
    const likely = recentClients[0];
    setClientId(likely.id);
    setAmount(String(likely.lastAmount));
  }, [recentClients]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ clientId, amount: Number(amount), notes });
      }}
    >
      <label htmlFor="client">Client</label>
      <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
        <option value="">Select a client</option>
        {recentClients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label htmlFor="notes">Notes</label>
      <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

      <button type="submit">Create invoice</button>
    </form>
  );
}
