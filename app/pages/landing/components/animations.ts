export const getFadeUp = (reduceMotion: boolean | null) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
});

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const getScaleIn = (reduceMotion: boolean | null) => ({
  hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
});

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};
