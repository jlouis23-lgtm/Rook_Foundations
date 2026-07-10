import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Router Link with framer-motion tap/hover physics attached.
 * Use for primary CTAs so every click gets the same satisfying press feedback.
 */
export const MotionLink = motion(Link);

export const ctaTap = { scale: 0.96 };
