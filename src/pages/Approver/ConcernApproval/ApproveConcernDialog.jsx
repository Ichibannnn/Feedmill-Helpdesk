import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { AddOutlined, Close, CloseOutlined, FiberManualRecord, RemoveCircleOutline, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

import * as yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { formStyle as sx } from "../../Tickets/IssueHandlerConcerns/style/formStyle";
import { useTakeCherryPickTicketMutation } from "../../../features/api_request/concerns/concernApi";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";

const schema = yup.object().shape({
  concernType: yup.string().oneOf(["Internal", "External"], "Invalid Concern Type").required("Concern Type is required"),
});

const ApproveConcernDialog = ({ open, onClose, selectedIds, setSelectedIds }) => {
  const [approveConcern, { isLoading: isApproveConcernLoading }] = useTakeCherryPickTicketMutation();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      concernType: "Internal",
    },
  });

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    const payload = {
      ticketConcernIdCherryLists: selectedIds?.map((item) => item),
      concernType: formData.concernType,
    };

    Swal.fire({
      title: "Confirmation",
      text: "Approve this concern?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await approveConcern(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket approved successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setSelectedIds([]);
            reset();
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseAction();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <Typography sx={sx.dialogTitle}>Concern Approval</Typography>
        <Typography sx={sx.dialogSubtitle}>Select a concern type before approving the request</Typography>

        <Stack sx={{ width: "100%", p: 1 }}>
          <form onSubmit={handleSubmit(onSubmitAction)}>
            <DialogContent>
              {/* Concern Type */}
              <Stack sx={sx.fieldOneColStack}>
                <Stack sx={sx.fieldTitleWithIconBox}>
                  <Typography sx={sx.fieldText}>Concern Type</Typography>
                  <FiberManualRecord sx={sx.requiredDot} />
                </Stack>

                <Controller
                  name="concernType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} size="small" displayEmpty inputProps={{ "aria-label": "Without label" }}>
                      <MenuItem value="Internal">Internal</MenuItem>
                      <MenuItem value="External">External</MenuItem>
                    </Select>
                  )}
                />
              </Stack>
            </DialogContent>

            <DialogActions>
              <LoadingButton variant="contained" size="small" loading={isApproveConcernLoading} onClick={onCloseAction} sx={sx.cancelButton}>
                Cancel
              </LoadingButton>
              <LoadingButton size="small" type="submit" variant="contained" loading={isApproveConcernLoading}>
                Approve
              </LoadingButton>
            </DialogActions>
          </form>
        </Stack>
      </Dialog>
    </>
  );
};

export default ApproveConcernDialog;
