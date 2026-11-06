import { Autocomplete, Badge, Divider, OutlinedInput, Stack, Tab, Tabs, TextField, Typography, useMediaQuery } from "@mui/material";
import { CommentOutlined, DiscountOutlined, PendingOutlined, Search, WifiProtectedSetupOutlined } from "@mui/icons-material";

import * as yup from "yup";
import useDebounce from "../../../hooks/useDebounce";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { theme } from "../../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, set, useForm } from "react-hook-form";
import { approverStyles as sx } from "../styles/approverStyles";

import { useGetOnHoldApprovalQuery } from "../../../features/api_ticketing/approver/ticketApprovalApi";
import { useGetNotificationQuery } from "../../../features/api_notification/notificationApi";

import OnHoldApproval from "./OnHoldApproval/OnHoldApproval";
import ConcernApproval from "../ConcernApproval/ConcernApproval";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";

const schema = yup.object().shape({
  CategoryId: yup.object().notRequired(),
});

const Approval = () => {
  const [tabNavigation, setTabNavigation] = useState("1");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);
  const userChannelId = useSelector((state) => state?.user?.channels?.[0]?.channelId);
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data: notificationBadge } = useGetNotificationQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();

  const { control, watch, setValue, resetField } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      CategoryId: null,
    },
  });

  const {
    data: onHoldData,
    isLoading: onHoldIsLoading,
    isFetching: onHoldIsFetching,
    isSuccess: onHoldIsSuccess,
    isError: onHoldIsError,
  } = useGetOnHoldApprovalQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const onStatusChange = (_, newValue) => {
    setTabNavigation(newValue);
    setPageNumber(1);
    setPageSize(100);
    setSearchValue("");
    setValue("CategoryId", null);
  };

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  useEffect(() => {
    if (tabNavigation === "2") {
      setValue("CategoryId", null);
    }
  }, [tabNavigation, setValue]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "14px 44px 44px 44px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant={isScreenSmall ? "h5" : "h4"}>Approval</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row" marginTop={1}></Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          backgroundColor: theme.palette.bgForm.black3,
          borderRadius: "20px",
          marginTop: "10px",
        }}
      >
        <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
          <Tabs
            value={tabNavigation}
            onChange={onStatusChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              ".MuiTab-root": {
                minWidth: isScreenSmall ? "80px" : "120px",
                fontSize: { xs: "10px", sm: "12px", md: "13px" },
              },
              ".MuiTabs-scrollButtons": {
                color: "#fff",
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab
              value="1"
              className="tabs-styling"
              label="Concern Approval"
              icon={
                <Badge
                  // badgeContent={notificationBadge?.value?.forApprovalTargetDate}
                  max={100000}
                  color="error"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{
                    ".MuiBadge-badge": {
                      fontSize: "0.55rem",
                      fontWeight: 400,
                    },
                  }}
                >
                  <CommentOutlined />
                </Badge>
              }
              iconPosition="start"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                ".MuiBadge-badge": {
                  color: "#ffff",
                },
              }}
            />

            <Tab
              value="2"
              className="tabs-styling"
              label="On Hold"
              icon={
                <Badge
                  badgeContent={notificationBadge?.value?.forApprovalOnHoldNotif}
                  max={100000}
                  color="error"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{
                    ".MuiBadge-badge": {
                      fontSize: "0.55rem",
                      fontWeight: 400,
                    },
                  }}
                >
                  <PendingOutlined />
                </Badge>
              }
              iconPosition="start"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                ".MuiBadge-badge": {
                  color: "#ffff",
                },
              }}
            />
          </Tabs>
        </Stack>

        <Divider variant="fullWidth" sx={sx.pageDivider} />

        <Stack sx={sx.filterSearchBox}>
          <OutlinedInput
            placeholder="Search"
            startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "1.4375rem",
              flex: 1,
            }}
          />

          {tabNavigation === "1" && (
            <Stack sx={sx.filterCatBox}>
              <Controller
                control={control}
                name="CategoryId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      value={value}
                      options={categoryData?.value?.category?.filter((item) => item.channelId === userChannelId) || []}
                      loading={categoryIsLoading}
                      renderInput={(params) => <TextField {...params} label="Category" sx={sx.textField} />}
                      onOpen={() => {
                        if (!categoryIsSuccess)
                          getCategory({
                            Status: true,
                          });
                      }}
                      onChange={(_, value) => onChange(value)}
                      getOptionLabel={(option) => `${option.category_Description}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      fullWidth
                    />
                  );
                }}
              />
            </Stack>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {tabNavigation === "1" ? (
            <>
              <ConcernApproval
                search={search}
                categoryId={watch("CategoryId")?.id}
                // data={targetApprovalData}
                // isLoading={targetApprovalIsLoading}
                // isFetching={targetApprovalIsFetching}
                // isSuccess={targetApprovalIsSuccess}
                // isError={targetApprovalIsError}
                // setPageNumber={setPageNumber}
                // setPageSize={setPageSize}
              />
            </>
          ) : (
            <>
              <OnHoldApproval
                data={onHoldData}
                isLoading={onHoldIsLoading}
                isFetching={onHoldIsFetching}
                isSuccess={onHoldIsSuccess}
                isError={onHoldIsError}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Approval;
