import { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonBase, Dialog, DialogContent, Fade, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ArrowBack, Check, Close, EditOutlined } from "@mui/icons-material";
import moment from "moment";
import { customerSatifcationStyles as sx } from "./style/customerSatifcationStyles";
import { useConfirmConcernMutation } from "../../../features/api_request/concerns/concernApi";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";

const RATING_OPTIONS = [
  { value: "50-90%", tier: "low", description: "Needs improvement" },
  { value: "91-95%", tier: "mid", description: "Good" },
  { value: "96-100%", tier: "high", description: "Excellent" },
];

const MAX_REMARKS = 300;
const AUTO_ADVANCE_MS = 280;

const QUESTIONS = [
  { id: "q1", label: "The job was done according to the job description" },
  { id: "q2", label: "The job was done on the targeted completed date." },
  { id: "q3", label: "The job was carried out according to standard specification." },
  { id: "q4", label: "House keeping was performed after completion of job order." },
];

const REVIEW_STEP = QUESTIONS.length;
const INITIAL_ANSWERS = { q1: "", q2: "", q3: "", q4: "" };

const getTier = (value) => RATING_OPTIONS.find((o) => o.value === value)?.tier;

const CustomerSatisfactionDialog = ({ data, open, onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [remarks, setRemarks] = useState("");
  const [editingFromReview, setEditingFromReview] = useState(false);
  const advanceTimer = useRef(null);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== "").length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const isReview = step === REVIEW_STEP;
  const currentQuestion = isReview ? null : QUESTIONS[step];
  const currentAnswered = currentQuestion ? answers[currentQuestion.id] !== "" : false;
  const dispatch = useDispatch();

  const [confirmConcern, { isLoading: confirmConcernIsLoading }] = useConfirmConcernMutation();

  // Clear any pending auto-advance when the component unmounts
  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const resetForm = () => {
    clearTimeout(advanceTimer.current);
    setAnswers(INITIAL_ANSWERS);
    setRemarks("");
    setStep(0);
    setEditingFromReview(false);
  };

  const onCloseHandler = () => {
    resetForm();
    onClose();
  };

  const goTo = (target, fromReview = false) => {
    clearTimeout(advanceTimer.current);
    setEditingFromReview(fromReview);
    setStep(target);
  };

  const onSelectAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));

    // Auto-advance so each question is a single tap.
    // When editing from the review screen, jump straight back to it.
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (editingFromReview) {
        setEditingFromReview(false);
        setStep(REVIEW_STEP);
      } else {
        setStep((s) => Math.min(s + 1, REVIEW_STEP));
      }
    }, AUTO_ADVANCE_MS);
  };

  const onNextHandler = () => {
    if (editingFromReview) {
      goTo(REVIEW_STEP);
    } else {
      goTo(Math.min(step + 1, REVIEW_STEP));
    }
  };

  const onBackHandler = () => {
    if (editingFromReview) {
      goTo(REVIEW_STEP);
    } else {
      goTo(Math.max(step - 1, 0));
    }
  };

  const onConfirmHandler = () => {
    const payload = {
      concernType: data?.concernType,
      question1: answers?.q1,
      question2: answers?.q2,
      question3: answers?.q3,
      question4: answers?.q4,
      remarks: remarks,
      confirmTicketRequests: [
        {
          requestConcernId: data?.requestConcernId,
        },
      ],
    };

    Swal.fire({
      title: "Confirmation",
      text: "Confirm this concern?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      allowOutsideClick: false,
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
      preConfirm: async () => {
        try {
          Swal.getConfirmButton().innerHTML = `
            <div class="mui-btn-content">
              <span class="mui-spinner"></span>
              <span class="mui-label">Confirming...</span>
            </div>
          `;
          Swal.getConfirmButton().disabled = true;
          await confirmConcern(payload)
            .unwrap()
            .then(() => {
              toast.success("Success!", {
                description: "Confirm concern successfully!",
                duration: 1500,
              });

              dispatch(notificationApi.util.resetApiState());
              dispatch(notificationMessageApi.util.resetApiState());
              resetForm();
              onClose();
            })
            .catch((err) => {
              console.log("Error", err);
              toast.error("Error!", {
                description: err.data.error.message,
                duration: 1500,
              });
            });
          return true; // resolves success
        } catch (err) {
          console.log("Error", err);
          Swal.hideLoading();
          Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
          return false; // keeps modal open
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  };

  // Tracker segments: 4 questions + review
  const trackerSteps = [...QUESTIONS.map((q) => q.id), "review"];
  const getSegmentState = (index) => {
    if (index === step) return "current";
    const done = index === REVIEW_STEP ? false : answers[QUESTIONS[index].id] !== "";
    return done ? "done" : "todo";
  };
  const isSegmentDisabled = (index) => (index === REVIEW_STEP ? !allAnswered : false);

  const trackerCaption = isReview ? "Review and confirm" : `Question ${step + 1} of ${QUESTIONS.length}`;

  return (
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
      PaperProps={{ sx: { ...sx.dialogPaper, ...sx.reducedMotion } }}
    >
      {/* Header */}
      <Box sx={sx.header}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography sx={sx.headerSubtitle}>CUSTOMER SATISFACTION</Typography>
            <Typography variant="h6" sx={sx.headerTitle}>
              Ticket{" "}
              <Box component="span" sx={sx.ticketNumber}>
                #{data?.ticketRequestConcerns?.[0]?.ticketNumberId}
              </Box>
            </Typography>
          </Box>

          <IconButton onClick={onCloseHandler} size="small" aria-label="Close" sx={sx.closeButton}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        {/* Step tracker */}
        <Box sx={sx.tracker}>
          <Stack direction="row" sx={sx.trackerRow} role="group" aria-label="Survey progress">
            {trackerSteps.map((key, index) => {
              const disabled = isSegmentDisabled(index);
              return (
                <ButtonBase
                  key={key}
                  disabled={disabled}
                  onClick={() => goTo(index)}
                  aria-label={index === REVIEW_STEP ? "Go to review" : `Go to question ${index + 1}`}
                  aria-current={index === step ? "step" : undefined}
                  disableRipple
                  sx={sx.trackerSegment(getSegmentState(index), disabled)}
                >
                  <Box className="bar" />
                </ButtonBase>
              );
            })}
          </Stack>
          <Stack direction="row" sx={sx.trackerCaption}>
            <Typography sx={sx.trackerText}>
              {trackerCaption}
              {!isReview && (
                <Box component="span" sx={sx.requiredMark}>
                  {" "}
                  *
                </Box>
              )}
            </Typography>
            <Typography sx={sx.trackerText}>
              {answeredCount} of {QUESTIONS.length} answered
            </Typography>
          </Stack>
        </Box>
      </Box>

      <DialogContent sx={sx.content}>
        <Box sx={sx.stage}>
          <Fade in appear key={step} timeout={220}>
            <Box>
              {!isReview ? (
                /* ---------- Question step ---------- */
                <>
                  <Typography id={`${currentQuestion.id}-label`} sx={sx.questionLabel}>
                    {currentQuestion.label}
                  </Typography>
                  <Typography sx={sx.questionHint}>Please rate the quality of work served.</Typography>

                  <Stack role="radiogroup" aria-labelledby={`${currentQuestion.id}-label`} sx={sx.optionList}>
                    {RATING_OPTIONS.map((option) => {
                      const selected = answers[currentQuestion.id] === option.value;
                      return (
                        <ButtonBase key={option.value} role="radio" aria-checked={selected} onClick={() => onSelectAnswer(currentQuestion.id, option.value)} sx={sx.optionCard(option.tier, selected)}>
                          <Box sx={sx.optionRadio(option.tier, selected)}>{selected && <Check sx={sx.optionRadioIcon} />}</Box>
                          <Box>
                            <Typography sx={sx.optionValue}>{option.value}</Typography>
                            <Typography sx={sx.optionDescription}>{option.description}</Typography>
                          </Box>
                          <Box sx={sx.optionTierBar(option.tier)} />
                        </ButtonBase>
                      );
                    })}
                  </Stack>
                </>
              ) : (
                /* ---------- Review step ---------- */
                <>
                  <Typography sx={sx.reviewTitle}>Review your ratings</Typography>
                  <Typography sx={sx.reviewHint}>Select any row to change your answer.</Typography>

                  <Box sx={sx.reviewList}>
                    {QUESTIONS.map((q, index) => (
                      <ButtonBase key={q.id} onClick={() => goTo(index, true)} aria-label={`Edit answer: ${q.label}`} sx={sx.reviewRow(index === QUESTIONS.length - 1)}>
                        <Typography sx={sx.reviewQuestion}>{q.label}</Typography>
                        <Stack direction="row" sx={sx.reviewRight}>
                          <Box sx={sx.reviewChip(getTier(answers[q.id]))}>{answers[q.id]}</Box>
                          <EditOutlined sx={sx.reviewEditIcon} />
                        </Stack>
                      </ButtonBase>
                    ))}
                  </Box>

                  <Stack direction="row" sx={sx.remarksHeader}>
                    <Typography component="label" htmlFor="csat-remarks" sx={sx.remarksLabel}>
                      Remarks/Comments
                    </Typography>
                    <Typography sx={sx.remarksCount}>
                      {remarks.length}/{MAX_REMARKS}
                    </Typography>
                  </Stack>
                  <TextField
                    id="csat-remarks"
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={6}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value.slice(0, MAX_REMARKS))}
                    placeholder="Share any additional feedback..."
                    sx={sx.remarksField}
                  />
                </>
              )}
            </Box>
          </Fade>
        </Box>

        {/* Actions */}
        <Stack direction="row" sx={sx.actions}>
          {step === 0 ? (
            <Button onClick={onCloseHandler} sx={sx.backButton}>
              Cancel
            </Button>
          ) : (
            <Button onClick={onBackHandler} startIcon={<ArrowBack fontSize="small" />} sx={sx.backButton}>
              Back
            </Button>
          )}

          {isReview ? (
            <Button onClick={onConfirmHandler} disabled={!allAnswered} sx={sx.primaryButton(allAnswered)}>
              Confirm
            </Button>
          ) : (
            <Button onClick={onNextHandler} disabled={!currentAnswered} sx={sx.primaryButton(currentAnswered)}>
              {editingFromReview ? "Back to review" : step === REVIEW_STEP - 1 ? "Review" : "Next"}
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerSatisfactionDialog;
