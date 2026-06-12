import type { CSSProperties, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<{
  variant?: 'primary' | 'gold' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}>;

export function Button({ variant = 'primary', fullWidth = false, disabled = false, onClick, children }: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    gold: 'btn-gold',
    ghost: 'btn-ghost',
  }[variant];

  return (
    <button
      type="button"
      className={`btn ${variantClass}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{ width: fullWidth ? '100%' : undefined }}
    >
      {children}
    </button>
  );
}

type PanelProps = PropsWithChildren<{
  title?: string;
  dark?: boolean;
  accent?: string;
  className?: string;
}>;

export function Panel({ title, dark = false, accent, className = '', children }: PanelProps) {
  const style: CSSProperties = accent ? { borderLeft: `4px solid ${accent}` } : {};
  return (
    <section className={`panel frame-rule ${dark ? 'panel-dark' : ''} ${className}`} style={style}>
      {title ? <div className="label panel-label">{title}</div> : null}
      {children}
    </section>
  );
}

export function SectionRule({ children }: PropsWithChildren) {
  return (
    <div className="section-rule">
      <span className="caps">{children}</span>
      <span className="section-line" />
    </div>
  );
}

export function Tag({ children }: PropsWithChildren) {
  return <span className="woa-tag">{children}</span>;
}
