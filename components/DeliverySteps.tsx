import { deliverySteps } from '@/lib/content';
import { Icon } from './Icon';

// Six-step delivery lifecycle as connected cards.
export function DeliverySteps() {
  return (
    <ol className="steps">
      {deliverySteps.map((s) => (
        <li key={s.num} className="step-card">
          <div className="step-top">
            <span className="step-icon"><Icon name={s.icon} size={22} /></span>
            <span className="step-num">{s.num}</span>
          </div>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
