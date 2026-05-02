import { useState } from 'react';
import { Icons } from './Icons';

const SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00'];
const DOWS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export function Calendar({ onBook }: { onBook: (b: { date: string; time: string }) => void }) {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const monthName = month.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });
  const firstDay = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const isAvailable = (d: number) => {
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = (date.getTime() - todayMid.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0 || diff > 21) return false;
    const dow = date.getDay();
    return dow !== 0 && dow !== 6;
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const confirm = () => {
    if (!selected || !slot) return;
    const date = new Date(month.getFullYear(), month.getMonth(), selected);
    const label = date.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' });
    onBook({ date: label, time: slot });
  };

  return (
    <div className="cal">
      <div className="cal-head">
        <div className="cal-month heading">{monthName}</div>
        <div className="cal-nav">
          <button
            className="icon-btn"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            aria-label="Predchádzajúci mesiac"
          >
            <Icons.Chevron />
          </button>
          <button
            className="icon-btn"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            aria-label="Ďalší mesiac"
          >
            <Icons.Chevron right />
          </button>
        </div>
      </div>
      <div className="cal-grid">
        {DOWS.map((d) => (
          <div key={d} className="cal-dow">
            {d}
          </div>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <div key={`e${i}`} />
          ) : (
            <button
              key={d}
              disabled={!isAvailable(d)}
              className={`cal-day ${selected === d ? 'selected' : ''}`}
              onClick={() => {
                setSelected(d);
                setSlot(null);
              }}
            >
              {d}
            </button>
          ),
        )}
      </div>
      {selected !== null && (
        <div className="cal-slots">
          {SLOTS.map((s) => (
            <button
              key={s}
              className={`cal-slot ${slot === s ? 'selected' : ''}`}
              onClick={() => setSlot(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {selected !== null && slot && (
        <button className="price-cta primary" onClick={confirm} style={{ marginTop: 4 }}>
          Potvrdiť termín →
        </button>
      )}
    </div>
  );
}
