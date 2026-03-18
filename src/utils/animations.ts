/**
 * Общие варианты анимаций Framer Motion.
 * Используй в компонентах вместо локального определения.
 *
 * Пример:
 *   import { containerVariants, itemVariants } from '../utils/animations';
 *   <motion.div variants={containerVariants} initial="hidden" animate="visible">
 */

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};
