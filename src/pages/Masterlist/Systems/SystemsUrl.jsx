import { LinkOutlined } from "@mui/icons-material";
import { alpha, Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const METHOD_COLORS = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

// Maps each API field to its HTTP method
const ENDPOINTS = [
  { field: "createUrl", method: "POST", label: "Create", title: "Direct to Helpdesk URL" },
  { field: "updateOpenStatusUrl", method: "PATCH", label: "Update open status", title: "Update open status URL" },
  { field: "updateClosingStatusUrl", method: "PATCH", label: "Update closing status", title: "Update closing status URL" },
  { field: "cancelTicketUrl", method: "PUT", label: "Cancel approval closing of ticket", title: "Cancel URL" },
  { field: "getChannelUrl", method: "GET", label: "Get channel", title: "Channel URL" },
];

const EndpointRow = ({ method, label, url, title }) => {
  const color = METHOD_COLORS[method];

  return (
    // <Tooltip title={label} placement="top-start" arrow>
    <Stack gap={1}>
      <Typography sx={{ fontWeight: 600, fontSize: "12.5px", wordBreak: "break-all", color: "#e8edf7" }}>{title}</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          py: 0.75,
          borderRadius: 1,
          border: `1px solid ${color}`,
          bgcolor: alpha(color, 0.1),
        }}
      >
        <Box
          sx={{
            minWidth: 64,
            py: 0.5,
            borderRadius: 0.75,
            textAlign: "center",
            bgcolor: color,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          {method}
        </Box>
        <Typography sx={{ fontFamily: 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace', fontWeight: 600, fontSize: 13, wordBreak: "break-all" }}>{url}</Typography>
      </Box>
    </Stack>
    // </Tooltip>
  );
};

const SystemsUrl = ({ urls }) => {
  const ref = useRef();
  const { open, onToggle, onClose } = useDisclosure();

  const onCloseAction = () => {
    onClose();
  };

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View URL">
          <Badge color="primary">
            <LinkOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        PaperProps={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "#111a2a",
          border: `1px solid #111a2a`,
          borderRadius: "14px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          View system URLs
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ padding: "10px" }}>
            <Stack gap={2}>
              {ENDPOINTS.filter(({ field }) => urls?.[field]).map(({ field, ...endpoint }) => (
                <EndpointRow key={field} url={urls[field]} {...endpoint} />
              ))}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={onCloseAction} size="small" sx={sx.cancelButton}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SystemsUrl;
