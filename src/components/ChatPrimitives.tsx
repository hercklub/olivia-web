import type { ReactNode } from 'react';
import type { QuickReply } from '../types';

export function Row({
  side,
  first,
  voice,
  children,
}: {
  side: 'bot' | 'user';
  first?: boolean;
  voice?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`row ${side}${first ? ' first' : ''}${voice ? ' voice' : ''}`}>
      {side === 'bot' && <div className="mini-avatar" aria-hidden="true" />}
      {children}
    </div>
  );
}

export function Bubble({ children }: { children: ReactNode }) {
  return <div className="bubble">{children}</div>;
}

export function Typing() {
  return (
    <div className="row bot first">
      <div className="mini-avatar" aria-hidden="true" />
      <div className="typing" aria-label="Olívia píše">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function QuickReplies({
  options,
  onPick,
}: {
  options: QuickReply[];
  onPick: (opt: QuickReply) => void;
}) {
  return (
    <div className="quick">
      {options.map((opt, i) => (
        <button key={i} className={`chip ${opt.variant ?? ''}`} onClick={() => onPick(opt)}>
          {opt.emoji && <span className="emoji">{opt.emoji}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
