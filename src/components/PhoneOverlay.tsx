import { Icons } from './Icons';

const PHONE = '+421 902 123 456';
const TEL = '+421902123456';

export function PhoneOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="phone-overlay" onClick={onClose}>
      <div className="phone-card" onClick={(e) => e.stopPropagation()}>
        <div className="ringer">
          <Icons.Phone size={28} />
        </div>
        <div className="head-name heading">Volajte priamo Olívii</div>
        <div className="phone-num">{PHONE}</div>
        <div className="phone-sub">Pravá AI recepčná. Spýtajte sa čokoľvek.</div>
        <div className="phone-actions">
          <button className="cancel" onClick={onClose}>
            Zavrieť
          </button>
          <a className="call" href={`tel:${TEL}`}>
            Zavolať
          </a>
        </div>
      </div>
    </div>
  );
}
