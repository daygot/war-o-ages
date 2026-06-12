import React from 'react';

/* War O' Ages letterpress button. Renders the .btn classes from styles.css. */
export function Button({ variant = 'primary', children, fullWidth = false, disabled = false, onClick, style, type = 'button' }) {
  const map = { primary: 'btn-primary', gold: 'btn-gold', ghost: 'btn-ghost' };
  return (
    <button
      type={type}
      className={'btn ' + (map[variant] || map.primary)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >{children}</button>
  );
}
