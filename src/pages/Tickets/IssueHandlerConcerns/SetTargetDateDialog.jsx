import { LoadingButton } from "@mui/lab";
import { Box, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import moment from "moment";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { formStyle as sx } from "./style/formStyle";

import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { concernIssueHandlerApi, useUpdateTargetDateMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const schema = yup.object().shape({
  TicketConcernId: yup.number(),
  TargetDate: yup.date().required().label("Resolution is required"),
});

const SetTargetDateDialog = ({ data, open, onClose, viewOnClose }) => {
  const [updateTargetDate, { isLoading: updateTargetDateIsLoading }] = useUpdateTargetDateMutation();

  const dispatch = useDispatch();
  const isSetMode = Boolean(data?.id);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      TicketConcernId: "",
      TargetDate: "",
    },
  });

  const onSubmitAction = (formData) => {
    const payload = new FormData();

    payload.append("TicketConcernId", formData.TicketConcernId);
    payload.append("TargetDate", moment(formData.TargetDate).format("YYYY-MM-DD"));

    Swal.fire({
      title: "Confirmation",
      text: isSetMode
        ? `Update target date for ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`
        : `Set target date for ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Payload Entries: ", [...payload.entries()]);
        updateTargetDate(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Update target date successfully!",
              duration: 1500,
            });

            // dispatch(concernIssueHandlerApi.util.resetApiState());

            reset();
            onClose();
            viewOnClose();
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

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (data) {
      setValue("TicketConcernId", data?.ticketConcernId);

      if (data?.target_Date) {
        setValue("TargetDate", data?.target_Date);
      } else {
        setValue("TargetDate", "");
      }
    }
  }, [data]);

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
          onCloseHandler();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          <Stack>
            <Stack id="closeTicket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* Ticket Details */}
              <Stack sx={{ padding: 1, width: "100%" }}>
                {/* Ticket Number */}
                <Stack>
                  <Typography sx={sx.titleText}>Set Target Date</Typography>
                  <Typography sx={sx.captionText}>{` Ticket # ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                </Stack>

                {/* Fields */}
                <Stack sx={sx.targetFieldSection}>
                  <Stack sx={sx.fieldOneColStack}>
                    {/* Target Date */}
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Target Date:</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Controller
                        control={control}
                        name="TargetDate"
                        render={({ field }) => (
                          <DatePicker
                            value={field.value ? moment(field.value) : null}
                            onChange={(newValue) => {
                              const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                              field.onChange(formattedValue);
                            }}
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                sx: {
                                  "& .MuiInputBase-input": {
                                    padding: "8.5px 14px",
                                  },
                                  "& .MuiOutlinedInput-root": {
                                    fontSize: "13px",
                                  },
                                },
                              },
                            }}
                            minDate={new moment()}
                            error={!!errors.TargetDate}
                            helperText={errors.TargetDate ? errors.TargetDate.message : null}
                          />
                        )}
                      />
                      {errors.TargetDate && <Typography>{errors.TargetDate.message}</Typography>}
                    </LocalizationProvider>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton form="closeTicket" variant="contained" loading={updateTargetDateIsLoading} onClick={onCloseHandler} sx={sx.cancelButton}>
            Cancel
          </LoadingButton>

          <LoadingButton type="submit" form="closeTicket" variant="contained" loading={updateTargetDateIsLoading} disabled={!watch("TargetDate")}>
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SetTargetDateDialog;
