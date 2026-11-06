import { theme } from "../../../theme/theme";

export const tokens = {
  bg: "#080D16",
  panel: "#0E1521",
  line: "#252D3B",

  text: "#e8edf8",
  muted: "#A0AEC0",

  violet: "#7c5cff",
  pink: "#ff4fa3",

  ok: "#34d399",
  warn: "#fbbf24",
  error: "#EF5350",
};

const fonts = {
  md: "15px",
  sm: "13px",
  xs: "12px",
};

const weights = {
  regular: 400,
  medium: 500,
  semibold: 600,
};

const t = tokens;
const f = fonts;
const w = weights;

export const approverStyles = {
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    background: t.panel,
    border: `1px solid ${t.line}`,
    borderRadius: "15px",
  },

  avatarIcon: { width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${t.violet}, ${t.pink})`, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16 },

  secondaryText: {
    color: t.muted,
    fontWeight: w.medium,
    fontSize: { xs: f.xs, md: f.sm },
  },

  requestorText: {
    fontSize: { xs: f.sm, md: f.md },
    color: t.text,
    fontWeight: w.semibold,
  },

  channelText: {
    fontSize: { xs: f.xs, md: f.sm },
    color: t.muted,
    fontWeight: w.medium,
  },

  sectionHeader: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.semibold,
    color: t.violet,
  },

  label: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.regular,
    color: t.muted,
  },

  description: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.medium,
    color: t.text,
    wordBreak: "break-word",
  },

  detailBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 1,
  },

  formBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 2,
    gap: 2,
  },

  divider: {
    background: t.line,
    marginTop: 1,
    marginBottom: 1,
  },

  rowContent: {
    flexDirection: { xs: "column", md: "row" },
    ml: 2,
  },

  titleDetailBox: {
    width: "20%",
  },

  spacer: {
    width: "8%",
  },

  descDetailBox: {
    width: "72%",
    flexDirection: "column",
  },

  // Pending Concern
  textField: {
    "& .MuiInputBase-input": { fontSize: "13px" },
  },

  filterSearchBox: {
    width: "100%",
    flexDirection: { xs: "column", md: "row" },
    padding: 1,
    gap: 1.5,
    mt: 1.5,
  },

  filterCatBox: {
    width: { xs: "100%", md: "30%" },
  },

  pageDivider: {
    background: "#2D3748",
    marginTop: "1px",
  },

  selectionBox: {
    padding: "10px 20px",
    backgroundColor: theme.palette.bgForm.black2,
    borderRadius: "20px",
    marginBottom: 0.5,
    marginTop: 0.5,
    justifyContent: "space-between",
    gap: 0.5,
  },

  paramsBox: {
    width: "100%",
    padding: 3,
    gap: 1,
  },

  // Cards
  cardContent: {
    cursor: "pointer",
    padding: "1px",
    "&:hover": {
      backgroundColor: "#1A222F",
      color: "#9e77ed",
    },
  },

  cardDetailContainer: {
    flexDirection: "row",
    spacing: 1,
    alignItems: "center",
    padding: 2,
  },

  fullnameText: {
    fontWeight: 500,
    fontSize: "17px",
    color: "#EDF2F7",
  },

  subNameText: {
    fontWeight: 500,
    fontSize: "12px",
    color: theme.palette.text.secondary,
  },

  cardDetailBox: {
    flexDirection: "row",
    gap: 0.5,
    alignItems: "center",
  },

  cardTitle: {
    fontWeight: 700,
    fontSize: "0.775rem",
    lineHeight: 1.57,
    color: "#D65DB1",
  },

  cardDescription: {
    fontWeight: 400,
    fontSize: "0.775rem",
    lineHeight: 1.57,
    color: theme.palette.text.main,
  },

  cardChip: {
    fontSize: "12px",
    backgroundColor: "#1D1F3B",
    color: theme.palette.primary.main,
    fontWeight: 800,
  },

  // Form
  formHeader: {
    fontSize: { xs: "15px", md: "16px" },
    fontWeight: w.semibold,
    color: t.text,
  },

  subHeader: {
    fontSize: { xs: "13px", md: "14px" },
    fontWeight: w.semibold,
    color: t.muted,
  },

  sectionHeader: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.semibold,
    color: t.violet,
  },

  label: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.regular,
    color: t.muted,
  },

  description: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.medium,
    color: t.text,
    wordBreak: "break-word",
  },

  container: {
    backgroundColor: t.panel,
    border: `1px solid ${t.line}`,
    borderRadius: "14px",
  },

  row: {
    borderBottom: `1px solid ${t.line}`,
    padding: "9px 0",
  },
  status: {
    success: {
      color: t.ok,
      fontWeight: w.semibold,
    },
    warning: {
      color: t.warning,
      fontWeight: w.semibold,
    },
    error: {
      color: t.error,
      fontWeight: w.semibold,
    },
  },

  chip: {
    fontSize: f.sm,
    fontWeight: w.medium,
    color: t.text,
    backgroundColor: t.panel,
    border: `1px solid ${t.line}`,
    borderRadius: "20px",
    padding: "3px 10px",
  },

  closeButton: {
    backgroundColor: "#1C2536",
    "&:hover": { backgroundColor: "#2f3c55" },
  },

  detailBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 1,
  },

  divider: {
    background: t.line,
    marginTop: 1,
    marginBottom: 1,
  },

  rowContent: {
    flexDirection: { xs: "column", md: "row" },
    ml: 2,
  },

  titleDetailBox: {
    width: "20%",
  },

  spacer: {
    width: "8%",
  },

  descDetailBox: {
    width: "72%",
    flexDirection: "column",
  },

  //   View Detail Dialog
  avatarIcon: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${t.violet}, ${t.pink})`,
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: 14,
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },

  avatarAndTitleBox: {
    flexDirection: "row",
    gap: 1,
    alignItems: "center",
  },

  section: {
    marginTop: 2,
    justifyContent: "space-between",
  },

  // Table
  table: {
    borderBottom: "none",
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
  },

  tableCellCb: {
    color: "#EDF2F7",
    fontSize: "12px",
    fontWeight: 500,
    "&:hover": {
      background: "",
      color: "#EDF2F7",
    },
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxText: {
    fontSize: "12px",
  },

  headCell: {
    background: "#1C2536",
    color: "#D65DB1",
    fontWeight: 700,
    fontSize: "11px",
  },

  bodyCell: {
    color: "#EDF2F7",
    fontSize: "12px",
    fontWeight: 500,
    wordBreak: "break-word",
  },

  sortIcon: {
    color: "#D65DB1",
    fontSize: "25px",
  },

  tableFullName: {
    color: "#EDF2F7",
    fontSize: "14px",
    fontWeight: 500,
  },

  tableDeptLoc: {
    color: theme.palette.text.secondary,
    fontSize: "12px",
    fontWeight: 500,
  },

  // ** Attachment
  attachmentBox: {
    width: "100%",
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
    borderRadius: "15px",
  },

  noAttachmentBox: {
    width: "100%",
    borderRadius: "15px",
  },

  attachmentContent: {
    flexDirection: "row",
    gap: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },

  fontSize: {
    fontSize: { xs: "12px", md: "13px" },
  },

  titleSubIcon: {
    color: theme.palette.text.secondary,
    fontSize: { xs: "16px", md: "18px" },
  },

  titleSubText: {
    color: theme.palette.text.secondary,
    fontSize: { xs: "12px", md: "14px" },
  },

  attachmentCards: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 1,
    border: `1px solid ${t.line}`,
    borderRadius: "15px",
  },

  attachmentNameBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0.5,
    // borderBottom: "1px solid #2D3748",
  },
};
