import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useState } from "react";
import { global } from "../../../styles/global";
import { approverStyles as sx } from "../styles/approverStyles";

import moment from "moment";
import useDisclosure from "../../../hooks/useDisclosure";

import { theme } from "../../../theme/theme";
import { useGetReceiverConcernsQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import { CalendarMonthOutlined, Check, FlashOn, LocalOffer, SwapVertOutlined } from "@mui/icons-material";
import { CardListSkeleton, NoRecordsFound, NoRecordsFoundTable, SomethingWentWrong, SomethingWentWrongTable, TableSkeleton } from "../../../components/TableState";

import ConcernDetails from "./ConcernDetails";
import ApproveConcernDialog from "./ApproveConcernDialog";

const ConcernApproval = ({ search, categoryId }) => {
  const [concernDetails, setConcernDetails] = useState(null);
  const [ascending, setAscending] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, isFetching, isSuccess, isError } = useGetReceiverConcernsQuery({
    is_Approve: false,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
    CategoryId: categoryId,
    Ascending: ascending,
  });

  const rows = data?.value?.requestConcern ?? [];
  const success = isSuccess && !isLoading && !isFetching;
  const no_records = isSuccess && !data?.value?.requestConcern.length && !isLoading && !isFetching;
  const loading = isLoading || isFetching;
  const error = isError;

  const { open: viewConcernDetailsOpen, onToggle: viewConcernDetailsOnToggle, onClose: viewConcernDetailsOnClose } = useDisclosure();
  const { open: approveOpen, onToggle: approveOnToggle, onClose: approveOnClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onViewAction = (data) => {
    setConcernDetails(data);
    viewConcernDetailsOnToggle();
  };

  const handleSelectTicket = (item) => {
    const concernAndTicketNo = {
      ticketConcernId: item?.ticketRequestConcerns[0]?.ticketConcernId,
      requestConcernId: item?.requestConcernId,
    };

    setSelectedIds((prevSelected) => {
      const exists = prevSelected.some((id) => id.ticketConcernId === concernAndTicketNo.ticketConcernId && id.requestConcernId === concernAndTicketNo.requestConcernId);

      if (exists) {
        return prevSelected.filter((id) => !(id.ticketConcernId === concernAndTicketNo.ticketConcernId && id.requestConcernId === concernAndTicketNo.requestConcernId));
      } else {
        return [...prevSelected, concernAndTicketNo];
      }
    });
  };

  const isSelected = (item) => selectedIds.some((id) => id.ticketConcernId === item?.ticketRequestConcerns[0]?.ticketConcernId && id.requestConcernId === item?.requestConcernId);

  const openApproveDialog = () => {
    approveOnToggle();
  };

  const tableColumns = [{ type: "text", width: 80 }, { type: "multiline" }, { type: "multiline" }, { type: "text" }, { type: "chip" }, { type: "chip" }, { type: "text" }];

  return (
    <Stack sx={{ width: "100%", mt: 1 }}>
      {/* Selection */}
      {selectedIds.length > 0 && (
        <Stack direction={isScreenSmall ? "column" : "row"} alignItems={isScreenSmall ? "left" : "center"} sx={sx.selectionBox}>
          <Stack direction="row" gap={0.5}>
            <LocalOffer />
            <Typography>
              {selectedIds.length} {""}
              {selectedIds.length > 1 ? "Tickets selected" : "Ticket selected"}
            </Typography>
          </Stack>

          <Button variant="contained" color="success" onClick={openApproveDialog} startIcon={<Check />}>
            Take Ticket
          </Button>
        </Stack>
      )}

      <Stack sx={sx.contentBox}>
        {isScreenSmall ? (
          // Cards
          <>
            <Stack spacing={2}>
              {success &&
                rows?.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      sx={{
                        backgroundColor: isSelected ? "#1E2034" : theme.palette.bgForm.black3,
                        borderRadius: "15px",
                        borderColor: "#2D3748",
                      }}
                    >
                      <CardContent sx={sx.cardContent}>
                        <Stack sx={sx.cardDetailContainer}>
                          {/* Checkbox */}
                          <Stack>
                            <Checkbox
                              checked={isSelected(item)}
                              onChange={() => handleSelectTicket(item)}
                              inputProps={{
                                "aria-label": `select ticket ${item?.ticketRequestConcerns[0]?.ticketConcernId}`,
                              }}
                            />
                          </Stack>

                          {/* Details */}
                          <Stack spacing={1} onClick={() => onViewAction(item)}>
                            {/* Fullname */}
                            <Stack mb={2}>
                              <Stack sx={sx.cardDetailBox}>
                                <Typography sx={sx.fullnameText}>{item.fullName}</Typography>
                                {item.severity === "Urgent" && <FlashOn color="warning" />}
                              </Stack>

                              <Typography sx={sx.subNameText}>
                                {item.department_Code} - {item.department_Name}
                              </Typography>
                              <Typography sx={sx.subNameText}>
                                {item.location_Code} - {item.location_Name}
                              </Typography>
                            </Stack>

                            {/* Ticket Number */}
                            <Stack sx={sx.cardDetailBox}>
                              <Typography sx={sx.cardTitle}>TICKET NUMBER:</Typography>
                              <Typography sx={sx.cardDescription}>{`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns[0]?.ticketConcernId}`}</Typography>
                            </Stack>

                            {/* Concern */}
                            <Stack sx={sx.cardDetailBox}>
                              <Typography sx={sx.cardTitle}>CONCERN:</Typography>
                              <Typography sx={sx.cardDescription}>
                                {item.concern?.split("\r\n").map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </Typography>
                            </Stack>

                            {/* Category */}
                            <Stack sx={sx.cardDetailBox}>
                              <Typography sx={sx.cardTitle}>CATEGORY:</Typography>
                              <Typography sx={sx.cardDescription}>
                                {item?.getRequestTicketCategories?.length !== 0 ? item.getRequestTicketCategories?.map((item) => item.category_Description).join(", ") : "--"}
                              </Typography>
                            </Stack>

                            {/* Date Created */}
                            <Stack sx={sx.cardDetailBox}>
                              <Typography sx={sx.cardTitle}>DATE CREATED:</Typography>
                              <Chip variant="filled" size="30px" icon={<CalendarMonthOutlined fontSize="small" color="primary" />} sx={sx.cardChip} label={moment(item.created_At).format("LL")} />
                            </Stack>

                            {/* Date Needed */}
                            <Stack sx={sx.cardDetailBox}>
                              <Typography sx={sx.cardTitle}>DATE NEEDED:</Typography>
                              <Chip variant="filled" size="30px" icon={<CalendarMonthOutlined fontSize="small" color="primary" />} sx={sx.cardChip} label={moment(item.date_Needed).format("LL")} />
                            </Stack>

                            {/* Created By */}
                            <Stack sx={sx.cardDetailBox}>
                              <Typography sx={sx.cardTitle}>CREATED BY:</Typography>
                              <Typography sx={sx.cardDescription}>{item.added_By}</Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}

              {error && <SomethingWentWrong label="Something went wrong" />}
              {loading && <CardListSkeleton count={5} sx={global.cards} />}
              {no_records && <NoRecordsFound label="No records found" />}

              <TablePagination
                sx={global.tablePagination}
                rowsPerPageOptions={[100, 300, 500, { value: data?.value?.totalCount, label: "All" }]}
                component="div"
                count={data?.value?.totalCount || 0}
                rowsPerPage={data?.value?.pageSize || 100}
                page={data?.value?.currentPage - 1 || 0}
                onPageChange={onPageNumberChange}
                onRowsPerPageChange={onPageSizeChange}
              />
            </Stack>
          </>
        ) : (
          // Table
          <>
            <TableContainer>
              <Table stickyHeader size="small" sx={sx.table}>
                <TableHead sx={{ whiteSpace: "nowrap" }}>
                  <TableRow>
                    <TableCell sx={sx.headCell}>
                      TICKET NO.
                      <IconButton
                        size="small"
                        onClick={() => {
                          setAscending(!ascending);
                        }}
                      >
                        <SwapVertOutlined sx={sx.sortIcon} />
                      </IconButton>
                    </TableCell>

                    <TableCell sx={sx.headCell}>REQUESTOR</TableCell>
                    <TableCell sx={sx.headCell}>CONCERN</TableCell>
                    <TableCell sx={sx.headCell}>CATEGORY</TableCell>
                    <TableCell sx={sx.headCell}>DATE CREATED</TableCell>
                    <TableCell sx={sx.headCell}>DATE NEEDED</TableCell>
                    <TableCell sx={sx.headCell}>CREATED BY</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {success &&
                    rows?.map((item) => {
                      return (
                        <TableRow key={item.requestConcernId}>
                          <TableCell sx={sx.tableCellCb}>
                            <Stack sx={sx.checkboxContainer}>
                              <Checkbox
                                checked={isSelected(item)}
                                onChange={() => handleSelectTicket(item)}
                                inputProps={{
                                  "aria-label": `select ticket ${item?.ticketRequestConcerns[0]?.ticketConcernId}`,
                                }}
                              />
                              {item.severity === "Urgent" && <FlashOn color="warning" />}
                              <Typography sx={sx.checkboxText}>{`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns[0]?.ticketConcernId}`}</Typography>
                            </Stack>
                          </TableCell>

                          <TableCell onClick={() => onViewAction(item)}>
                            <Typography sx={sx.tableFullName}>{item.fullName}</Typography>
                            <Typography sx={sx.tableDeptLoc}>
                              {item.department_Code} - {item.department_Name}
                            </Typography>
                            <Typography sx={sx.tableDeptLoc}>
                              {item.location_Code} - {item.location_Name}
                            </Typography>
                          </TableCell>

                          <TableCell onClick={() => onViewAction(item)}>
                            <Stack sx={{ width: "200px" }}>
                              <Typography sx={sx.bodyCell}>
                                {item.concern
                                  ? item.concern?.split("\r\n").map((line, index) => (
                                      <span key={index}>
                                        {line}
                                        <br />
                                      </span>
                                    ))
                                  : "--"}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={sx.bodyCell} onClick={() => onViewAction(item)}>
                            {item?.getRequestTicketCategories?.length !== 0 ? item.getRequestTicketCategories?.map((item) => item.category_Description).join(", ") : "--"}
                          </TableCell>
                          <TableCell sx={sx.bodyCell} onClick={() => onViewAction(item)}>
                            {moment(item.created_At).format("LL hh:mma")}
                          </TableCell>
                          <TableCell sx={sx.bodyCell} onClick={() => onViewAction(item)}>
                            {moment(item.date_Needed).format("LL")}
                          </TableCell>
                          <TableCell sx={sx.bodyCell} onClick={() => onViewAction(item)}>
                            {item.added_By}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {loading && <TableSkeleton columns={tableColumns} rows={10} cellSx={sx.tableCellBody} />}
                  {no_records && <NoRecordsFoundTable colSpan={9} label="No records found" />}
                  {isError && <SomethingWentWrongTable colSpan={9} label="Something went wrong." />}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              sx={global.tablePagination}
              rowsPerPageOptions={[100, 300, 500]}
              component="div"
              count={data?.value?.totalCount || 0}
              rowsPerPage={data?.value?.pageSize || 100}
              page={data?.value?.currentPage - 1 || 0}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            />
          </>
        )}

        {viewConcernDetailsOpen && <ConcernDetails data={concernDetails} setData={setConcernDetails} open={viewConcernDetailsOpen} onClose={viewConcernDetailsOnClose} />}
        {approveOpen && <ApproveConcernDialog open={approveOpen} onClose={approveOnClose} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />}
      </Stack>
    </Stack>
  );
};

export default ConcernApproval;
