import { useId } from 'react';
import { useSound } from '@/hooks/useSound';

/* ---------------- Glass panel ---------------- */
export function Panel({
  children, className = '', pad = true, elevation = 'md', irisEdge = false, as: Tag = 'div', ...rest
}) {
  const cls = [
    'glass',
    pad && (pad === 'sm' ? 'glass-pad-sm' : 'glass-pad'),
    elevation === 'flat' && 'glass-flat',
    elevation === 'deep' && 'glass-deep',
    irisEdge && 'iris-edge',
    className,
  ].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

/* ---------------- Toggle switch ---------------- */
export function Switch({ checked, onChange, label, hint, disabled }) {
  const { play } = useSound();
  const id = useId();
  const flip = () => {
    if (disabled) return;
    play(checked ? 'off' : 'on');
    onChange(!checked);
  };
  return (
    <div className="row between gap-4" style={{ opacity: disabled ? 0.45 : 1 }}>
      {label && (
        <label htmlFor={id} className="stack" style={{ cursor: 'pointer' }} onClick={flip}>
          <span style={{ fontWeight: 500 }}>{label}</span>
          {hint && <span className="tiny muted">{hint}</span>}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="switch"
        data-on={checked}
        onClick={flip}
        onPointerEnter={() => play('hover')}
      />
    </div>
  );
}

/* ---------------- Slider ---------------- */
export function Slider({
  value, onChange, min = 0, max = 100, step = 1, label, display, tickSound = true,
}) {
  const { play } = useSound();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="field">
      {label && (
        <div className="row between">
          <span className="field-label">{label}</span>
          {display !== undefined && <span className="tiny soft">{display}</span>}
        </div>
      )}
      <input
        type="range"
        className="slider"
        style={{ '--fill': `${pct}%` }}
        min={min} max={max} step={step} value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (tickSound && Math.abs(v - value) >= step) play('type');
          onChange(v);
        }}
        onPointerEnter={() => play('hover')}
      />
    </div>
  );
}

/* ---------------- Segmented control ---------------- */
export function Segmented({ value, onChange, options, ariaLabel }) {
  const { play } = useSound();
  return (
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
      {options.map((o) => {
        const val = o.id ?? o;
        const label = o.label ?? o;
        return (
          <button
            key={val}
            role="tab"
            aria-selected={value === val}
            data-active={value === val}
            onPointerEnter={() => play('hover')}
            onClick={() => { play('click'); onChange(val); }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Chip ---------------- */
export function Chip({ children, tone, onClick, active, ...rest }) {
  const { play } = useSound();
  const cls = ['chip', tone && `chip-${tone}`, active && 'chip-iris'].filter(Boolean).join(' ');
  if (!onClick) return <span className={cls} {...rest}>{children}</span>;
  return (
    <button
      className={cls}
      style={{ cursor: 'pointer' }}
      onPointerEnter={() => play('hover')}
      onClick={() => { play('click'); onClick(); }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------------- Text field ---------------- */
export function Field({
  label, hint, value, onChange, as = 'input', options, maxLength, ...rest
}) {
  const { play } = useSound();
  const id = useId();
  const common = {
    id,
    value,
    maxLength,
    onChange: (e) => { play('type'); onChange(e.target.value); },
    onPointerEnter: () => play('hover'),
    ...rest,
  };
  return (
    <div className="field">
      {label && (
        <div className="row between">
          <label className="field-label" htmlFor={id}>{label}</label>
          {maxLength && (
            <span className="tiny muted">{String(value ?? '').length}/{maxLength}</span>
          )}
        </div>
      )}
      {as === 'textarea' && <textarea className="textarea" {...common} />}
      {as === 'select' && (
        <select className="select" {...common}>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
      )}
      {as === 'input' && <input className="input" {...common} />}
      {hint && <span className="tiny muted">{hint}</span>}
    </div>
  );
}

/* ---------------- Colour well ---------------- */
export function ColorWell({ value, onChange, label }) {
  const { play } = useSound();
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="colorwell"
      style={{ '--c': value }}
      title={`${label}: ${value}`}
      onPointerEnter={() => play('hover')}
    >
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="colorwell-face" />
      <span className="tiny colorwell-label">{label}</span>
    </label>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionTitle({ eyebrow, title, sub, action }) {
  return (
    <div className="row between wrap gap-3" style={{ marginBottom: 'var(--sp-4)' }}>
      <div className="stack">
        {eyebrow && <span className="caps" style={{ color: 'var(--aura-3)' }}>{eyebrow}</span>}
        <h3>{title}</h3>
        {sub && <p className="small muted" style={{ margin: 0 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Empty state ---------------- */
export function Empty({ icon = '☁', title, children, action }) {
  return (
    <div className="empty-state stack center gap-3">
      <span className="empty-icon">{icon}</span>
      <h4>{title}</h4>
      {children && <div className="small muted center-text" style={{ maxWidth: 420 }}>{children}</div>}
      {action}
    </div>
  );
}
