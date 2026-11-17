// customerStyles.js
// Styles for CustomerSatisfactionDialog. Import as: import sx from "./customerStyles";

export const COLORS = {
  surface: "#0d1526",
  card: "#111c33",
  field: "#1a2540",
  border: "#1f2a44",
  muted: "#94a3b8",
  purple: "#9f7de3",
  purple_2: "#7552ba",
  teal: "#14b8a6",
  amber: "#f59e0b",
  danger: "#ef4444",
};

export const GRADIENT = `linear-gradient(90deg, ${COLORS.purple} 0%, ${COLORS.purple_2} 100%)`;
export const GRADIENT_DIAGONAL = `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purple_2})`;

// Each rating tier gets its own accent so the choice reads at a glance.
export const TIER_COLORS = {
  low: COLORS.amber,
  mid: COLORS.purple,
  high: COLORS.teal,
};

const focusRing = {
  outline: `2px solid ${COLORS.teal}`,
  outlineOffset: 2,
};

export const customerSatifcationStyles = {
  /* ---------- Dialog shell ---------- */
  dialogPaper: {
    overflow: "hidden",
    color: "#fff",
    backgroundColor: COLORS.surface,
    backgroundImage: "none",
    borderRadius: 3,
    boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
    m: { xs: 1.5, sm: 4 },
    width: { xs: "calc(100% - 24px)", sm: "100%" },
  },

  /* ---------- Header ---------- */
  header: { px: 3, pt: 2.5, pb: 2 },
  headerSubtitle: { color: COLORS.muted, fontSize: 14, fontWeight: 700, lineHeight: 1.5 },
  headerTitle: { fontWeight: 700, lineHeight: 1.3 },
  ticketNumber: {
    // color: COLORS.purple_2,
    // background: GRADIENT,
    // WebkitBackgroundClip: "text",
    // WebkitTextFillColor: "transparent",
  },
  closeButton: {
    color: COLORS.muted,
    transition: "color 0.15s, background-color 0.15s",
    "&:hover": { color: "#fff", backgroundColor: COLORS.field },
    "&.Mui-focusVisible": focusRing,
  },

  /* ---------- Step tracker ---------- */
  tracker: { mt: 0.5 },
  trackerRow: { alignItems: "center", gap: 0.75 },
  // state: "done" | "current" | "todo"; disabled blocks navigation to unreachable steps
  trackerSegment: (state, disabled) => ({
    flex: 1,
    height: 28,
    display: "flex",
    alignItems: "center",
    cursor: disabled ? "default" : "pointer",
    borderRadius: 1,
    "&:focus-visible": focusRing,
    "& .bar": {
      width: "100%",
      height: 6,
      borderRadius: 3,
      background: state === "todo" ? COLORS.field : GRADIENT,
      opacity: state === "current" ? 1 : state === "done" ? 0.75 : 1,
      boxShadow: state === "current" ? "0 0 0 3px rgba(147,51,234,0.25)" : "none",
      transition: "background 0.25s, box-shadow 0.25s, opacity 0.25s",
    },
    "&:hover .bar": disabled ? undefined : { opacity: 1 },
  }),
  trackerCaption: { mt: 0.25, justifyContent: "space-between" },
  trackerText: { fontSize: 12, color: COLORS.muted },
  requiredMark: { color: COLORS.danger },

  /* ---------- Body ---------- */
  content: { px: 3, pt: 0, pb: 3 },
  stage: { minHeight: { xs: 320, sm: 340 }, pt: 1.5 },

  /* ---------- Question step ---------- */
  questionLabel: { fontSize: 18, fontWeight: 700, lineHeight: 1.4, mb: 0.5 },
  questionHint: { fontSize: 13, color: COLORS.muted, mb: 2.5 },
  optionList: { gap: 1.25 },

  optionCard: (tier, selected) => {
    const accent = TIER_COLORS[tier];
    return {
      width: "100%",
      justifyContent: "flex-start",
      textAlign: "left",
      gap: 1.75,
      p: 1.75,
      borderRadius: 2,
      backgroundColor: selected ? COLORS.card : COLORS.field,
      border: `1px solid ${selected ? accent : COLORS.border}`,
      boxShadow: selected ? `0 0 0 3px ${accent}26` : "none",
      transition: "border-color 0.15s, background-color 0.15s, box-shadow 0.15s, transform 0.1s",
      "&:hover": { borderColor: accent, backgroundColor: COLORS.card },
      "&:active": { transform: "scale(0.995)" },
      "&.Mui-focusVisible": focusRing,
    };
  },
  optionRadio: (tier, selected) => ({
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    border: `2px solid ${selected ? TIER_COLORS[tier] : COLORS.muted}`,
    backgroundColor: selected ? TIER_COLORS[tier] : "transparent",
    color: "#fff",
    transition: "all 0.15s",
  }),
  optionRadioIcon: { fontSize: 14 },
  optionValue: { fontSize: 16, fontWeight: 700, lineHeight: 1.3 },
  optionDescription: { fontSize: 12.5, color: COLORS.muted, lineHeight: 1.4 },
  optionTierBar: (tier) => ({
    ml: "auto",
    width: 4,
    alignSelf: "stretch",
    borderRadius: 2,
    backgroundColor: TIER_COLORS[tier],
    opacity: 0.8,
  }),

  /* ---------- Review step ---------- */
  reviewTitle: { fontSize: 18, fontWeight: 700, lineHeight: 1.4, mb: 0.5 },
  reviewHint: { fontSize: 13, color: COLORS.muted, mb: 2 },
  reviewList: {
    borderRadius: 2,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.card,
    overflow: "hidden",
  },
  reviewRow: (isLast) => ({
    width: "100%",
    justifyContent: "space-between",
    textAlign: "left",
    gap: 2,
    px: 2,
    py: 1.25,
    borderRadius: 0,
    borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`,
    transition: "background-color 0.15s",
    "&:hover": { backgroundColor: COLORS.field },
    "&.Mui-focusVisible": focusRing,
  }),
  reviewQuestion: { fontSize: 13, color: "#e2e8f0", flex: 1, lineHeight: 1.4 },
  reviewRight: { alignItems: "center", gap: 1, flexShrink: 0 },
  reviewChip: (tier) => ({
    px: 1.25,
    py: 0.25,
    borderRadius: 999,
    fontSize: 12.5,
    fontWeight: 600,
    color: "#fff",
    backgroundColor: `${TIER_COLORS[tier]}33`,
    border: `1px solid ${TIER_COLORS[tier]}`,
  }),
  reviewEditIcon: { fontSize: 16, color: COLORS.muted },

  remarksHeader: { mt: 2.5, mb: 1, justifyContent: "space-between" },
  remarksLabel: { fontSize: 14 },
  remarksCount: { fontSize: 12, color: COLORS.muted },
  remarksField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: COLORS.field,
      color: "#fff",
      borderRadius: 2,
      transition: "box-shadow 0.2s",
      "& fieldset": { borderColor: COLORS.border, borderWidth: 1 },
      "&:hover fieldset": { borderColor: COLORS.purple },
      "&.Mui-focused fieldset": { borderColor: COLORS.purple, borderWidth: 2 },
      "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(147,51,234,0.15)" },
    },
    "& .MuiInputBase-input::placeholder": { color: COLORS.muted, opacity: 1 },
  },

  /* ---------- Footer actions ---------- */
  actions: { mt: 3, gap: 1.5 },
  backButton: {
    textTransform: "none",
    color: "#fff",
    py: 1.1,
    px: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.field,
    border: `1px solid ${COLORS.border}`,
    "&:hover": { backgroundColor: "#22304f" },
    "&.Mui-disabled": { color: "rgba(255,255,255,0.3)", opacity: 0.6 },
    "&.Mui-focusVisible": focusRing,
  },
  primaryButton: (enabled) => ({
    flex: 1,
    textTransform: "none",
    fontWeight: 600,
    color: "#fff",
    py: 1.1,
    borderRadius: 2,
    background: GRADIENT,
    boxShadow: enabled ? "0 6px 20px rgba(147,51,234,0.35)" : "none",
    transition: "filter 0.15s, box-shadow 0.15s",
    "&:hover": { filter: "brightness(1.1)" },
    "&.Mui-disabled": { color: "rgba(255,255,255,0.5)", opacity: 0.45 },
    "&.Mui-focusVisible": focusRing,
  }),
  cancelLink: {
    textTransform: "none",
    color: COLORS.muted,
    "&:hover": { color: "#fff", backgroundColor: "transparent" },
  },

  /* ---------- Motion ---------- */
  reducedMotion: {
    "@media (prefers-reduced-motion: reduce)": {
      "& *": { transition: "none !important" },
    },
  },
};
