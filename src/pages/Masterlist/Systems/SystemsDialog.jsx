import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { CloseRounded, LinkRounded, Save, SupportAgentRounded } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useAddEditPmsTypeMutation } from "../../../features/api masterlist/pms-type/pmsTypeApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";
import { useLazyGetActiveSitesQuery } from "../../../features/api masterlist/sites/sitesApi";
import { C, METHOD_COLORS, fieldSx, formStyles as ui, methodChipSx } from "./styles/formStyles";

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

const required = (label) => yup.string().trim().required(`${label} is required.`);
const schema = yup.object().shape({
  id: yup.string().nullable(),
  helpdeskName: yup.string().required().label("Helpdesk name is required."),
  ...Object.fromEntries(URL_FIELDS.map(({ name, label }) => [name, required(label)])),
});

const defaultValues = {
  id: null,
  helpdeskName: "",
  ...Object.fromEntries(URL_FIELDS.map(({ name }) => [name, ""])),
};

const PmsTypeDialog = ({ data, open, onClose }) => {
  const [addEditPmsType, { isLoading }] = useAddEditPmsTypeMutation();

  const [getSite, { data: siteData, isLoading: siteIsLoading, isSuccess: siteIsSuccess }] = useLazyGetActiveSitesQuery();

  const isEditMode = Boolean(data?.id);
  const lookupDropdownOptions = ["Stores", "Employees", "Farms", "Departments", "Buildings"];

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
    defaultValues,
  });

  useEffect(() => {
    if (data) {
      reset({
        id: data.id ?? null,
        helpdeskName: data.helpdeskName ?? data.name ?? "",
        ...Object.fromEntries(URL_FIELDS.map(({ name }) => [name, data[name] ?? ""])),
      });
    }
  }, [data, reset]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  console.log("Data: ", data);

  const onSubmitAction = async (formData) => {
    const entry = isEditMode
      ? {
          id: data.id,
          name: formData.name,
          siteId: formData.site.id,
          totalAnnualPMS: Number(formData.noOfPmsEvalutions),
          lookup: formData.lookup,
        }
      : {
          name: formData.name,
          siteId: formData.site.id,
          totalAnnualPMS: Number(formData.noOfPmsEvalutions),
          lookup: formData.lookup,
        };

    try {
      await addEditPmsType(entry).unwrap();
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
                    placeholder="e.g. Acme Support Desk"
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

export default PmsTypeDialog;
