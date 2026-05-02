import { useState } from 'react';
import { Icons } from './Icons';
import type { FaqItem } from '../types';

export function FAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div className="faq">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id} className={`faq-row ${isOpen ? 'open' : ''}`}>
            <button className="faq-q" onClick={() => toggle(item.id)} aria-expanded={isOpen}>
              <span className="faq-q-text">{item.q}</span>
              <span className="faq-chev" aria-hidden="true">
                <Icons.ChevronDown />
              </span>
            </button>
            {isOpen && <div className="faq-a">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
