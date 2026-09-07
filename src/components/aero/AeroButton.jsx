import { forwardRef, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';

/**
 * The house button. Glossy, ripples on press, blips on hover and click.
 * Renders as <button>, <a> or react-router <Link> depending on props.
 */
export const AeroButton = forwardRef(function AeroButton(
  {
    children,
    variant = 'default',   // default | primary | aqua | ghost | danger
    size = 'md',           // sm | md | lg
    icon = false,
    block = false,
    active = false,
    sound: soundEvent = 'click',
    to,
    href,
    onClick,
    onPointerEnter,
    className = '',
    ...rest
  },
  ref,
) {
  const { play } = useSound();
  const [ripples, setRipples] = useState([]);
  const seq = useRef(0);

  const handleClick = useCallback((e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const id = ++seq.current;
    const size = Math.max(box.width, box.height);
    setRipples((r) => [...r, {
      id,
      style: {
        left: e.clientX - box.left - size / 2,
        top: e.clientY - box.top - size / 2,
        width: size,
        height: size,
      },
    }]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 640);
    if (soundEvent) play(soundEvent);
    onClick?.(e);
  }, [onClick, play, soundEvent]);

  const handleEnter = useCallback((e) => {
    play('hover');
    onPointerEnter?.(e);
  }, [play, onPointerEnter]);

  const cls = [
    'btn',
    variant !== 'default' && `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    icon && 'btn-icon',
    block && 'btn-block',
    className,
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      {children}
      {ripples.map((r) => <span key={r.id} className="ripple" style={r.style} />)}
    </>
  );

  const shared = {
    ref,
    className: cls,
    onClick: handleClick,
    onPointerEnter: handleEnter,
    'data-active': active || undefined,
    ...rest,
  };

  if (to) return <Link to={to} {...shared}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" {...shared}>{inner}</a>;
  return <button type="button" {...shared}>{inner}</button>;
});
