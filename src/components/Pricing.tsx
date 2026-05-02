import { PRICE_TIERS } from '../data/flow';
import type { PriceTier } from '../types';

export function Pricing({ onPick }: { onPick: (tier: PriceTier) => void }) {
  return (
    <div className="pricing">
      {PRICE_TIERS.map((t) => (
        <div key={t.id} className={`price-card ${t.featured ? 'featured' : ''}`}>
          {t.badge && <div className="price-badge">{t.badge}</div>}
          <div className="price-name">{t.name}</div>
          <div className="price-amt">
            {t.price} Kč <small>/ mes.</small>
          </div>
          <div className="price-feats">
            {t.features.map((f, i) => (
              <div key={i} className="price-feat">
                {f}
              </div>
            ))}
          </div>
          <button className={`price-cta ${t.featured ? 'primary' : ''}`} onClick={() => onPick(t)}>
            Vybrať {t.name}
          </button>
        </div>
      ))}
    </div>
  );
}
