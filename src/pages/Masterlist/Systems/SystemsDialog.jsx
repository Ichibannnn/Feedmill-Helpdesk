import { Box, Button, Chip, Dialog, DialogActions, DialogContent, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { CloseRounded, LinkRounded, Save, SupportAgentRounded } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useLazyGetActiveSitesQuery } from "../../../features/api masterlist/sites/sitesApi";
import { C, METHOD_COLORS, fieldSx, formStyles as ui, methodChipSx } from "./styles/formStyles";

import { useAddEditSystemsMutation } from "../../../features/api masterlist/systems/systemsApi";

// Adjust the methods to match your actual API
const URL_FIELDS = [
  { name: "createUrl", label: "Direct to Helpdesk URL", method: "POST" },
  { name: "updateOpenStatusUrl", label: "Update open status URL", method: "PATCH" },
  { name: "updateClosingStatusUrl", label: "Update closing status URL", method: "PATCH" },
  { name: "cancelTicketUrl", label: "Cancel URL", method: "PUT" },
  { name: "getChannelUrl", label: "Channel URL", method: "GET" },
];

const MethodChip = ({ method }) => {
  const color = METHOD_COLORS[method] ?? METHOD_COLORS.GET;

  return <Chip label={method} size="small" sx={methodChipSx(color)} />;
};

const schema = yup.object().shape({
  id: yup.string().nullable(),
  helpdeskName: yup.string().required().label("Helpdesk name"),
  createUrl: yup.string().required().label("Direct to Helpdesk URL"),
  updateOpenStatusUrl: yup.string().required().label("Update open status URL"),
  updateClosingStatusUrl: yup.string().required().label("Update closing status URL"),
  cancelTicketUrl: yup.string().required().label("Cancel URL"),
  getChannelUrl: yup.string().required().label("Channel URL"),
});

const SystemDialog = ({ data, open, onClose }) => {
  const [addEditSystem, { isLoading }] = useAddEditSystemsMutation();
  const isEditMode = Boolean(data?.id);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      id: null,
      helpdeskName: "",
      createUrl: "",
      updateOpenStatusUrl: "",
      updateClosingStatusUrl: "",
      cancelTicketUrl: "",
      getChannelUrl: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("helpdeskName", data?.helpdeskName);
      setValue("createUrl", data?.createUrl);
      setValue("updateOpenStatusUrl", data?.updateOpenStatusUrl);
      setValue("updateClosingStatusUrl", data?.updateClosingStatusUrl);
      setValue("cancelTicketUrl", data?.cancelTicketUrl);
      setValue("getChannelUrl", data?.getChannelUrl);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = async (formData) => {
    const entry = isEditMode
      ? {
          id: data.id,
          helpdeskName: formData.helpdeskName,
          createUrl: formData.createUrl,
          updateOpenStatusUrl: formData.updateOpenStatusUrl,
          updateClosingStatusUrl: formData.updateClosingStatusUrl,
          cancelTicketUrl: formData.cancelTicketUrl,
          getChannelUrl: formData.getChannelUrl,
        }
      : {
          helpdeskName: formData.helpdeskName,
          createUrl: formData.createUrl,
          updateOpenStatusUrl: formData.updateOpenStatusUrl,
          updateClosingStatusUrl: formData.updateClosingStatusUrl,
          cancelTicketUrl: formData.cancelTicketUrl,
          getChannelUrl: formData.getChannelUrl,
        };

    try {
      await addEditSystem(entry).unwrap();
      toast.success("Success!", {
        description: isEditMode ? "System updated successfully!" : "System added successfully!",
        duration: 1500,
      });
      onCloseAction();
    } catch (error) {
      toast.error("Error!", {
        description: error?.data?.error?.message || "Something went wrong",
        duration: 1500,
      });
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} PaperProps={{ sx: ui.paper }}>
      <Box sx={ui.accentBar} />

      <Stack direction="row" sx={ui.header}>
        <Box sx={ui.iconTile}>
          <SupportAgentRounded sx={ui.iconTileIcon} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={ui.title}>{isEditMode ? "Edit helpdesk" : "Add helpdesk"}</Typography>
          <Typography sx={ui.subtitle}>{isEditMode ? "Update the details of this helpdesk." : "Create a new helpdesk and its endpoint URLs."}</Typography>
        </Box>
        <IconButton aria-label="Close dialog" size="small" onClick={onCloseAction} sx={ui.closeButton}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </Stack>

      <form onSubmit={handleSubmit(onSubmitAction)} style={ui.form}>
        <DialogContent sx={ui.content}>
          <Stack spacing={2.5}>
            <Stack spacing={0.75}>
              <Typography sx={ui.fieldLabel}>Helpdesk name</Typography>
              <Controller
                control={control}
                name="helpdeskName"
                render={({ field: { ref, value, onChange, onBlur } }) => (
                  <TextField
                    inputRef={ref}
                    size="small"
                    value={value}
                    placeholder="Enter Helpdesk name"
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.helpdeskName)}
                    helperText={errors.helpdeskName?.message}
                    autoComplete="off"
                    sx={fieldSx(C.accent, false)}
                  />
                )}
              />
            </Stack>

            <Divider sx={ui.divider} />

            <Box>
              <Typography sx={ui.sectionTitle}>Endpoints</Typography>
              <Typography sx={ui.sectionHint}>Each URL is called with the HTTP method shown beside it.</Typography>
            </Box>

            {URL_FIELDS.map(({ name, label, method }) => (
              <Stack key={name} spacing={0.75}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={ui.fieldLabel}>{label}</Typography>
                  <MethodChip method={method} />
                </Stack>

                <Controller
                  control={control}
                  name={name}
                  render={({ field: { ref, value, onChange, onBlur } }) => (
                    <TextField
                      inputRef={ref}
                      size="small"
                      value={value}
                      placeholder="https://"
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors[name])}
                      helperText={errors[name]?.message}
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkRounded sx={ui.linkIcon} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx(METHOD_COLORS[method] ?? C.accent)}
                    />
                  )}
                />
              </Stack>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={ui.actions}>
          <Typography sx={ui.footnote}>All fields are required.</Typography>

          <Stack direction="row" spacing={1}>
            <Button variant="contained" disableElevation onClick={onCloseAction} sx={ui.cancelButton}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isLoading} loadingPosition="start" startIcon={<Save />} disabled={!isValid} sx={ui.saveButton}>
              {isEditMode ? "Save changes" : "Add helpdesk"}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SystemDialog;
