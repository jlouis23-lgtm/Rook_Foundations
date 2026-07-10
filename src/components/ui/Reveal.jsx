import { motion } from 'framer-motion';

const offsets = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

/**
 * Standardised scroll-triggered reveal, replacing one-off whileInView blocks.
 * Wrap any section/card that should fade+slide in as it enters the viewport.
 */
export default function Reveal({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.55,
  className,
  once = true,
  margin = '-80px',
  ...props
}) {
  const Component = motion[as] || motion.div;
  const offset = offsets[direction] || offsets.up;

  return (
    <Component
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
