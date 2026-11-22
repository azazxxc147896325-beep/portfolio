import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
export default function Magnetic({ children, className = '' }) {
  const ref = useRef(null), x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 }), sy = useSpring(y, { stiffness: 180, damping: 18 });
  const reduced = useReducedMotion();
  const move = e => { if (reduced || e.pointerType !== 'mouse') return; const r = ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.22); y.set((e.clientY-r.top-r.height/2)*.22); };
  return <motion.span ref={ref} className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={() => {x.set(0);y.set(0);}} style={{x:sx,y:sy}}>{children}</motion.span>;
}
