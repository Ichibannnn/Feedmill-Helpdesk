import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  OutlinedInput,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AddOutlined, Search } from "@mui/icons-material";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { masterlistStyles as sx } from "../styles/masterlistStyles";
import { showConfirmAction } from "../../../utils/sweetAlert";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";
import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import SystemsDialog from "./SystemsDialog";
import SystemsActions from "./SystemsActions";
import { useArchiveSystemsMutation, useGetSystemsQuery } from "../../../features/api masterlist/systems/systemsApi";
import SystemsUrl from "./SystemsUrl";

const STATUS_TABS = [
  { value: "", label: "ALL" },
  { value: "true", label: "ACTIVE" },
  { value: "false", label: "ARCHIVED" },
];
const TABLE_COLUMNS = ["LINE NO.", "HELPDESK NAME", "URL", "STATUS", "ACTIONS"];

const Systems = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editData, setEditData] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);
  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetSystemsQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [archiveSystems] = useArchiveSystemsMutation();

  const rows = data?.value?.helpdesk ?? [];
  const isBusy = isLoading || isFetching;
  const hasRows = isSuccess && !isBusy && rows.length > 0;
  const isEmpty = isSuccess && !isBusy && rows.length === 0;

  const onPageNumberChange = (_, page) => setPageNumber(page + 1);

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onStatusChange = (_, newValue) => {
    setStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
  };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  const onArchiveAction = async ({ id, isActive }) => {
    const copy = isActive
      ? { text: "archived", progress: "Archiving...", done: "archived", buttonText: "Archive" }
      : { text: "active", progress: "Restoring...", done: "restored", buttonText: "Restore" };
    const confirmed = await showConfirmAction({
      title: "Are you sure?",
      icon: "warning",
      text: `This will move the system to the ${copy.text} tab.`,
      confirmButtonText: copy.buttonText,
      loadingText: copy.progress,
      onConfirm: async () => {
        await archiveSystems(id).unwrap();
      },
    });
    if (confirmed) {
      toast.success("Success!", {
        description: `System ${copy.done} successfully!`,
      });
    }
  };

  const onEditAction = (row) => {
    setEditData(row);
    onToggle();
  };

  useEffect(() => {
    if (searchValue) setPageNumber(1);
  }, [searchValue]);

  return (
    <Stack sx={sx.pageContainer}>
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              Systems
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Configure helpdesks and their corresponding URLs</Typography>
        </Stack>

        <Button variant="contained" size="large" startIcon={<AddOutlined />} onClick={onToggle} sx={sx.addButton}>
          Add
        </Button>
      </Stack>

      <Stack sx={sx.contentContainer}>
        <Tabs value={status} onChange={onStatusChange} variant="scrollable" scrollButtons="auto" sx={sx.tabs}>
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.label} value={tab.value} label={tab.label} sx={sx.tab} />
          ))}
        </Tabs>

        <Divider variant="fullWidth" sx={sx.divider} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={sx.searchContainer} gap={4}>
          <OutlinedInput placeholder="Search PMS Type" startAdornment={<Search sx={sx.searchIcon} />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} sx={sx.searchInput} />
        </Stack>

        <TableContainer>
          <Table sx={sx.table}>
            <TableHead sx={sx.tableHead}>
              <TableRow>
                {TABLE_COLUMNS.map((column) => (
                  <TableCell key={column} sx={sx.headCell} align={column === "HELPDESK NAME" || column === "URL" ? "left" : "center"}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {hasRows &&
                rows.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell sx={sx.bodyCell} align="center">
                      {index + 1}
                    </TableCell>
                    <TableCell sx={sx.bodyCell}>{item.helpdeskName || "--"}</TableCell>
                    <TableCell sx={sx.bodyCell}>
                      <SystemsUrl urls={item} />
                    </TableCell>
                    <TableCell sx={sx.bodyCell} align="center">
                      <Chip variant="filled" size="small" sx={sx.statusChip(item.isActive)} label={item.isActive ? "ACTIVE" : "INACTIVE"} />
                    </TableCell>
                    <TableCell sx={sx.bodyCell} align="center">
                      <SystemsActions data={item} onArchive={onArchiveAction} onUpdate={onEditAction} />
                    </TableCell>
                  </TableRow>
                ))}

              {isError && (
                <TableRow>
                  <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                    <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                    <Typography variant="h5" sx={sx.feedbackText} marginLeft={2}>
                      Something went wrong.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {isBusy && (
                <TableRow>
                  <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                    <CircularProgress />
                    <Typography variant="h5" sx={sx.feedbackText}>
                      Please wait...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {isEmpty && (
                <TableRow>
                  <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                    <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" style={{ width: "100%", maxWidth: "300px" }} />
                    <Typography variant="h5" sx={sx.feedbackText} marginLeft={2}>
                      No records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          sx={sx.pagination}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.value?.totalCount || 0}
          rowsPerPage={data?.value?.pageSize || 5}
          page={(data?.value?.currentPage || 1) - 1}
          onPageChange={onPageNumberChange}
          onRowsPerPageChange={onPageSizeChange}
        />

        <SystemsDialog data={editData} open={open} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default Systems;
