import { Icons } from './Icons';

export function Booked({ date, time }: { date: string; time: string }) {
  return (
    <div className="booked">
      <div className="booked-check">
        <Icons.Check />
      </div>
      <div className="booked-text">
        <strong>Termín potvrdený</strong>
        <small>
          {date} o {time} · pridané do kalendára
        </small>
      </div>
    </div>
  );
}
