import { Icons } from './Icons';
import { AudioPlayer } from './AudioPlayer';
import type { Customer } from '../types';

function CustomerAvatar({ customer, size = 44 }: { customer: Customer; size?: number }) {
  return (
    <div
      className={`cust-avatar tone-${customer.tone}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {customer.image ? (
        <img
          src={customer.image}
          alt={customer.businessName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      ) : (
        customer.initials
      )}
    </div>
  );
}

export function CustomerPreview({
  customer,
  onPick,
}: {
  customer: Customer;
  onPick: () => void;
}) {
  return (
    <button className={`cust-prev tone-${customer.tone}`} onClick={onPick}>
      <CustomerAvatar customer={customer} size={44} />
      <div className="cust-prev-body">
        <div className="cust-prev-top">
          <span className="cust-prev-name">{customer.businessName}</span>
          <span className="cust-prev-loc">· {customer.location}</span>
        </div>
        <div className="cust-prev-stat">{customer.stat}</div>
      </div>
      <div className="cust-prev-cta">
        <Icons.Play />
      </div>
    </button>
  );
}

export function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className={`cust-card tone-${customer.tone}`}>
      {customer.image && (
        <div className="cust-card-cover">
          <img src={customer.image} alt={customer.businessName} />
        </div>
      )}
      <div className="cust-card-head">
        <CustomerAvatar customer={customer} size={56} />
        <div className="cust-card-meta">
          <div className="cust-card-name">{customer.businessName}</div>
          <div className="cust-card-sub">
            {customer.tagline} · {customer.location}
          </div>
        </div>
        <div className="cust-card-tag">Pilot</div>
      </div>
      <div className="cust-card-stat">
        <div className="cust-card-stat-big">{customer.stat}</div>
        <div className="cust-card-stat-sub">{customer.statSub}</div>
      </div>
      <div className="cust-card-audio">
        <AudioPlayer caption={customer.caption} duration={28} />
      </div>
    </div>
  );
}

export function CustomerQuote({ customer }: { customer: Customer }) {
  return (
    <div className="cust-quote">
      <div className="cust-quote-bubble">"{customer.quote}"</div>
      <div className="cust-quote-attr">
        — {customer.ownerName}, {customer.businessName}
      </div>
    </div>
  );
}
