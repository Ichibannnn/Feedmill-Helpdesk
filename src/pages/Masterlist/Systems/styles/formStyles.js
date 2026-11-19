/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
export const C = {
  paper: "#111a2a",
  field: "#0b121e",
  border: "#273349",
  borderHover: "#3b4b69",
  text: "#e8edf7",
  muted: "#8a96ad",
  accent: "#8b5cf6",
  accentAlt: "#6366f1",
  error: "#f87171",
};

export const GRADIENT = `linear-gradient(135deg, ${C.accent}, ${C.accentAlt})`;
export const MONO = 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace';

export const METHOD_COLORS = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

/* ------------------------------------------------------------------ */
/* Dialog styles                                                       */
/* ------------------------------------------------------------------ */
export const formStyles = {
  paper: {
    position: "relative",
    overflow: "hidden",
    bgcolor: C.paper,
    backgroundImage: "none",
    border: `1px solid ${C.border}`,
    borderRadius: "14px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
  },
  accentBar: {
    height: "2px",
    flexShrink: 0,
    background: `linear-gradient(90deg, ${C.accent}, ${C.accentAlt} 55%, #38bdf8)`,
  },
  header: { px: 3, pt: 2.5, pb: 2, alignItems: "center", gap: 1.5 },
  iconTile: {
    width: 40,
    height: 40,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    color: "#a78bfa",
    background: "linear-gradient(135deg, rgba(139,92,246,0.28), rgba(99,102,241,0.08))",
    border: "1px solid rgba(139,92,246,0.38)",
  },
  iconTileIcon: { fontSize: 22 },
  title: { fontSize: "16px", fontWeight: 700, color: C.text, lineHeight: 1.3 },
  subtitle: { fontSize: "12.5px", color: C.muted, mt: 0.25 },
  closeButton: {
    alignSelf: "flex-start",
    color: C.muted,
    "&:hover": { color: C.text, bgcolor: "rgba(255,255,255,0.06)" },
  },
  form: { display: "flex", flexDirection: "column", minHeight: 0, flex: "1 1 auto" },
  content: {
    px: 3,
    py: 2.5,
    borderTop: `1px solid ${C.border}`,
    "&::-webkit-scrollbar": { width: 8 },
    "&::-webkit-scrollbar-thumb": { bgcolor: C.border, borderRadius: 8 },
  },
  fieldLabel: { fontSize: "12.5px", fontWeight: 600, color: C.text },
  divider: { borderColor: C.border },
  linkIcon: { fontSize: 16, color: C.muted },
  sectionTitle: { fontSize: "13.5px", fontWeight: 700, color: C.text },
  sectionHint: { fontSize: "12px", color: C.muted, mt: 0.25 },
  actions: {
    px: 3,
    py: 2,
    gap: 1,
    justifyContent: "space-between",
    borderTop: `1px solid ${C.border}`,
  },
  footnote: { fontSize: "12px", color: C.muted },
  cancelButton: {
    textTransform: "none",
    fontSize: "12.5px",
    fontWeight: 600,
    color: C.text,
    bgcolor: "#1a2438",
    border: `1px solid ${C.border}`,
    px: 2,
    "&:hover": { bgcolor: "#212d45", borderColor: C.borderHover },
  },
  saveButton: {
    textTransform: "none",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#fff",
    px: 2.25,
    background: GRADIENT,
    boxShadow: "0 6px 18px rgba(99,102,241,0.35)",
    "&:hover": { background: GRADIENT, filter: "brightness(1.12)", boxShadow: "0 8px 22px rgba(99,102,241,0.45)" },
    "&.Mui-disabled": {
      background: "rgba(139,92,246,0.16)",
      color: "rgba(255,255,255,0.35)",
      boxShadow: "none",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Style factories (depend on a method color)                          */
/* ------------------------------------------------------------------ */

// HTTP method chip: tinted background with a colored border and text.
export const methodChipSx = (color) => ({
  width: 52,
  height: 20,
  justifyContent: "center",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: 0.5,
  borderRadius: "4px",
  color,
  bgcolor: `${color}1f`, // ~12% tint of the Swagger color
  border: `1px solid ${color}`,
  "& .MuiChip-label": { px: 0 },
});

// Input styling. `color` drives the focus ring, so a URL field lights up in its method's color.
export const fieldSx = (color, mono = true) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    bgcolor: C.field,
    borderRadius: "8px",
    color: C.text,
    fontSize: "12.5px",
    fontFamily: mono ? MONO : "inherit",
    transition: "box-shadow 0.15s ease",
    "& fieldset": { borderColor: C.border, borderWidth: "1px", transition: "border-color 0.15s ease" },
    "&:hover fieldset": { borderColor: C.borderHover },
    "&.Mui-focused fieldset": { borderColor: color, borderWidth: "1px" },
    "&.Mui-focused": { boxShadow: `0 0 0 3px ${color}26` },
    "&.Mui-error fieldset": { borderColor: C.error },
    "&.Mui-error.Mui-focused": { boxShadow: `0 0 0 3px ${C.error}26` },
  },
  "& .MuiOutlinedInput-input": {
    py: "9px",
    "&::placeholder": { color: C.muted, opacity: 0.55, fontFamily: mono ? MONO : "inherit" },
  },
  "& .MuiFormHelperText-root": { mx: 0, mt: 0.75, fontSize: "11.5px", color: C.error },
});
