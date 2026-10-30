import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Collapse,
  Divider,
  Drawer,
  Fade,
  Grow,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { Close, ExpandMore, MenuOpen, MoreHoriz } from "@mui/icons-material";

import { getMenuIcon, getSubMenuIcon } from "./GetIcon";
import { useSelector } from "react-redux";

import useDisclosure from "../hooks/useDisclosure";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetNotificationQuery } from "../features/api_notification/notificationApi";

import helpDeskLogo from "../assets/images/helpdesk_icon.png";
import { sidebarStyles as sx } from "./styles/sidebarStyles";

const OVERLAY_BREAKPOINT = 1281;
const MOBILE_BREAKPOINT = 640;
const RAIL_COLLAPSE_BREAKPOINT = 1639;
const MOBILE_QUICK_ITEM_NAMES = ["Overview", "Ticketing", "Checklist Management", "Reports"];
const MOBILE_MENU_ITEMS = [
  { id: 1, name: "Overview", path: "/overview", icon: "EqualizerOutlined" },
  {
    id: 2,
    name: "User Management",
    path: "/user-management",
    icon: "PeopleOutlinedIcon",
    sub: [
      {
        id: 1,
        name: "User Account",
        path: "/user-management/user-account",
        icon: "PermIdentityOutlinedIcon",
      },
      { id: 2, name: "User Role", path: "/user-management/user-role", icon: "ManageAccountsOutlinedIcon" },
    ],
  },
  {
    id: 3,
    name: "Masterlist",
    path: "/masterlist",
    icon: "ChecklistOutlinedIcon",
    sub: [
      { id: 1, name: "One Charging", path: "/masterlist/one-charging", icon: "BusinessOutlinedIcon" },
      { id: 2, name: "Service Provider", path: "/masterlist/service-provider", icon: "HubOutlined" },
      { id: 3, name: "Channel Setup", path: "/masterlist/channel-setup", icon: "HubOutlined" },
      { id: 4, name: "Category", path: "/masterlist/category", icon: "CategoryOutlined" },
      { id: 5, name: "Sub Category", path: "/masterlist/sub-category", icon: "AutoAwesomeMotionOutlined" },
      {
        id: 6,
        name: "Concern Category",
        path: "/masterlist/concern-category",
        icon: "AutoAwesomeMotionOutlined",
      },
      { id: 7, name: "Receiver Setup", path: "/masterlist/receiver-setup", icon: "ContactsOutlined" },
      { id: 8, name: "Approver Setup", path: "/masterlist/approver-setup", icon: "GroupsOutlined" },
    ],
  },
  {
    id: 4,
    name: "Requestor",
    path: "/requestor",
    icon: "DynamicFeedOutlined",
    sub: [{ id: 1, name: "Requestor Concerns", path: "/requestor/requestor-concerns", icon: "DiscountOutlined" }],
  },
  {
    id: 5,
    name: "Receiver",
    path: "/receiver",
    icon: "DynamicFeedOutlined",
    sub: [{ id: 1, name: "Receiver Concerns", path: "/receiver/receiver-concerns", icon: "DiscountOutlined" }],
  },
  {
    id: 6,
    name: "Approver",
    path: "/Approver",
    icon: "CreditScoreOutlined",
    sub: [
      { id: 1, name: "Approval", path: "/approver/approval", icon: "FactCheckOutlined" },
      { id: 2, name: "View Tickets", path: "/approver/view-tickets", icon: "VisibilityOutlined" },
    ],
  },
  {
    id: 7,
    name: "Ticketing",
    path: "/ticketing",
    icon: "ConfirmationNumberOutlined",
    sub: [
      {
        id: 1,
        name: "Tickets",
        path: "/ticketing/issue-handler-tickets",
        icon: "ConfirmationNumberOutlined",
      },
    ],
  },
  { id: 8, name: "Reports", path: "/reports", icon: "AssessmentOutlined" },
  { id: 9, name: "Filing", path: "/filing", icon: "AttachFileOutlined" },
  { id: 10, name: "Generate", path: "/generate", icon: "BallotOutlined" },
];

const Sidebar = () => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const isOverlay = useMediaQuery(`(max-width: ${OVERLAY_BREAKPOINT}px)`);
  const isSmallScreen = useMediaQuery(`(max-width: ${RAIL_COLLAPSE_BREAKPOINT}px)`);

  const [collapsed, setCollapsed] = useState(isSmallScreen);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [isOverlay]);

  useEffect(() => {
    if (!isOverlay || isMobile) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlay, isMobile, mobileOpen]);

  if (isMobile) {
    return <MobileBottomNav />;
  }

  if (isOverlay) {
    return (
      <>
        {!mobileOpen && (
          <IconButton onClick={() => setMobileOpen(true)} sx={sx.mobileTrigger} size="small">
            <MenuOpen sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        <Fade in={mobileOpen} unmountOnExit>
          <Box sx={sx.backdrop} onClick={() => setMobileOpen(false)} />
        </Fade>

        <SidebarContent collapsed={false} overlayOpen={mobileOpen} onClose={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
      </>
    );
  }

  return <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />;
};

export default Sidebar;

const SidebarContent = ({ collapsed, overlayOpen, onToggleCollapse, onClose, onNavigate }) => (
  <Stack sx={[sx.container(collapsed), onClose && sx.overlayPanel(overlayOpen)]}>
    <SidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} onClose={onClose} />
    <SidebarList collapsed={collapsed} onExpand={() => collapsed && onToggleCollapse?.()} onNavigate={onNavigate} />
  </Stack>
);

const SidebarHeader = ({ collapsed, onToggleCollapse, onClose }) => {
  return (
    <>
      {(onToggleCollapse || onClose) && (
        <Stack sx={sx.toggleRow(collapsed)}>
          <Tooltip title={onClose ? "Close" : collapsed ? "Expand" : "Collapse"} placement="right" arrow>
            <IconButton onClick={onClose ?? onToggleCollapse} sx={sx.toggleButton} size="small">
              {onClose ? <Close sx={{ fontSize: 20 }} /> : <MenuOpen sx={sx.toggleIcon(collapsed)} />}
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Stack sx={sx.header(collapsed)}>
        <Box component="img" src={helpDeskLogo} alt="Feedmill Helpdesk" className="logo-sidebar" sx={sx.logo(collapsed)} />

        {/* Kept mounted so it can fade/collapse smoothly in both directions */}
        <Box sx={sx.brandWrap(collapsed)}>
          <Stack sx={sx.brandRow}>
            <Typography sx={sx.brandMis}>FEEDMILL</Typography>
            <Typography sx={sx.brandHelpdesk}>HELPDESK</Typography>
          </Stack>
        </Box>
      </Stack>

      <Divider sx={sx.headerDivider(collapsed)} />
    </>
  );
};

// Wraps a nav button in a right-side tooltip only while the rail is collapsed.
const NavTooltip = ({ collapsed, title, children }) =>
  collapsed ? (
    <Tooltip title={title} placement="right" arrow>
      {children}
    </Tooltip>
  ) : (
    children
  );

// Resolves the notification count a given sub-item should surface (0 when none).
const subBadgeCount = (name, openNotification, ticketApprovalNotification) => {
  if (name === "Tickets") return openNotification;
  if (name === "Approval") return ticketApprovalNotification;
  return 0;
};

const SubMenuItem = ({ subItem, selected, onClick, openNotification, ticketApprovalNotification }) => {
  const badgeCount = subBadgeCount(subItem?.name, openNotification, ticketApprovalNotification);

  return (
    <ListItemButton onClick={onClick} selected={selected} sx={sx.subButton}>
      <ListItemIcon sx={sx.subIcon}>{getSubMenuIcon(subItem.icon)}</ListItemIcon>
      <ListItemText
        primary={
          badgeCount ? (
            <Box sx={sx.subBadgeRow}>
              <Typography sx={sx.subText}>{subItem.name}</Typography>
              <Box component="span" sx={sx.subCount}>
                {badgeCount > 99 ? "99+" : badgeCount}
              </Box>
            </Box>
          ) : (
            subItem.name
          )
        }
        primaryTypographyProps={sx.subText}
      />
    </ListItemButton>
  );
};

const NavRow = ({ item, subs, hasSubs, collapsed, pathname, navigate, onExpand, onNavigate, openNotification, ticketApprovalNotification }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const closeTimer = useRef();
  const flyoutOpen = collapsed && hasSubs && Boolean(anchorEl);

  const hasRowNotif = Boolean((item.name === "Ticketing" && openNotification) || (item.name === "Approver" && ticketApprovalNotification));

  const openFlyout = (e) => {
    if (!collapsed || !hasSubs) return;
    clearTimeout(closeTimer.current);
    setAnchorEl(e.currentTarget);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setAnchorEl(null), 140);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const handleClick = () => {
    if (collapsed) onExpand();
    if (hasSubs) {
      item.onToggle();
    } else {
      navigate(item.path);
      onNavigate?.();
    }
  };

  const handleSubClick = (subItem) => {
    if (!item.open) item.onToggle();
    navigate(subItem.path);
    setAnchorEl(null);
    onNavigate?.();
  };

  return (
    <Box onMouseEnter={openFlyout} onMouseLeave={scheduleClose} onFocus={openFlyout} onBlur={scheduleClose}>
      <NavTooltip collapsed={collapsed} title={item.name}>
        <ListItemButton onClick={handleClick} selected={item.path === pathname} sx={sx.navButton(collapsed)}>
          <ListItemIcon sx={sx.navIcon(collapsed)}>{getMenuIcon(item.icon)}</ListItemIcon>

          <Box sx={sx.navLabelWrap(collapsed)}>
            <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
            {hasSubs && <ExpandMore sx={sx.chevron(item.open)} />}
          </Box>

          {hasRowNotif && <Box sx={sx.rowNotifDot} />}
        </ListItemButton>
      </NavTooltip>

      {hasSubs && !collapsed && (
        <Collapse in={item.open} timeout={260} unmountOnExit>
          <List sx={sx.subList}>
            {subs.map((subItem, j) => (
              <SubMenuItem
                key={j}
                subItem={subItem}
                selected={subItem.path === pathname}
                onClick={() => {
                  navigate(subItem.path);
                  onNavigate?.();
                }}
                openNotification={openNotification}
                ticketApprovalNotification={ticketApprovalNotification}
              />
            ))}
          </List>
        </Collapse>
      )}

      {hasSubs && (
        <Popper open={flyoutOpen} anchorEl={anchorEl} placement="right-start" transition sx={sx.flyoutPopper} modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: "left top" }} timeout={180}>
              <Paper elevation={8} sx={sx.flyoutPaper} onMouseEnter={() => clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
                <Typography sx={sx.flyoutHeader}>{item.name}</Typography>
                <List sx={sx.flyoutList}>
                  {subs.map((subItem, j) => (
                    <SubMenuItem
                      key={j}
                      subItem={subItem}
                      selected={subItem.path === pathname}
                      onClick={() => handleSubClick(subItem)}
                      openNotification={openNotification}
                      ticketApprovalNotification={ticketApprovalNotification}
                    />
                  ))}
                </List>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </Box>
  );
};

const SidebarList = ({ collapsed, onExpand, onNavigate }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const { open: userManagementOpen, onToggle: userManagementOnToggle, onClose: userManagementOnClose } = useDisclosure(!!pathname.match(/user-management/gi));
  const { open: masterListOpen, onToggle: masterListOnToggle, onClose: masterlistOnClose } = useDisclosure(!!pathname.match(/masterlist/gi));
  const { open: requestOpen, onToggle: requestOnToggle, onClose: requestOnClose } = useDisclosure(!!pathname.match(/requestor/gi));
  const { open: receiverOpen, onToggle: receiverOnToggle, onClose: receiverOnClose } = useDisclosure(!!pathname.match(/receiver/gi));
  const { open: ticketingOpen, onToggle: ticketingOnToggle, onClose: ticketingOnClose } = useDisclosure(!!pathname.match(/ticketing/gi));
  const { open: approverOpen, onToggle: approverOnToggle, onClose: approverOnClose } = useDisclosure(!!pathname.match(/approver/gi));

  const sidebarMenu = [
    {
      id: 1,
      name: "Overview",
      path: "/overview",
      icon: "EqualizerOutlined",
    },
    {
      id: 2,
      name: "User Management",
      path: "/user-management",
      icon: "PeopleOutlinedIcon",
      open: userManagementOpen,
      onToggle: () => {
        userManagementOnToggle();
        masterlistOnClose();
        requestOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "User Account",
          path: "/user-management/user-account",
          icon: "PermIdentityOutlinedIcon",
        },
        {
          id: 2,
          name: "User Role",
          path: "/user-management/user-role",
          icon: "ManageAccountsOutlinedIcon",
        },
      ],
    },
    {
      id: 3,
      name: "Masterlist",
      path: "/masterlist",
      icon: "ChecklistOutlinedIcon",
      open: masterListOpen,
      onToggle: () => {
        masterListOnToggle();
        userManagementOnClose();
        requestOnClose();
        receiverOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "One Charging",
          path: "/masterlist/one-charging",
          icon: "BusinessOutlinedIcon",
        },
        {
          id: 2,
          name: "Service Provider",
          path: "/masterlist/service-provider",
          icon: "HubOutlined",
        },
        {
          id: 3,
          name: "Channel Setup",
          path: "/masterlist/channel-setup",
          icon: "HubOutlined",
        },
        {
          id: 4,
          name: "Category",
          path: "/masterlist/category",
          icon: "CategoryOutlined",
        },
        {
          id: 5,
          name: "Sub Category",
          path: "/masterlist/sub-category",
          icon: "AutoAwesomeMotionOutlined",
        },

        {
          id: 6,
          name: "Concern Category",
          path: "/masterlist/concern-category",
          icon: "AutoAwesomeMotionOutlined",
        },
        {
          id: 7,
          name: "Receiver Setup",
          path: "/masterlist/receiver-setup",
          icon: "ContactsOutlined",
        },
        {
          id: 8,
          name: "Approver Setup",
          path: "/masterlist/approver-setup",
          icon: "GroupsOutlined",
        },
      ],
    },
    {
      id: 4,
      name: "Requestor",
      path: "/requestor",
      icon: "DynamicFeedOutlined",
      open: requestOpen,
      onToggle: () => {
        requestOnToggle();
        userManagementOnClose();
        masterlistOnClose();
        receiverOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Requestor Concerns",
          path: "/requestor/requestor-concerns",
          icon: "DiscountOutlined",
        },
      ],
    },
    {
      id: 5,
      name: "Receiver",
      path: "/receiver",
      icon: "DynamicFeedOutlined",
      open: receiverOpen,
      onToggle: () => {
        receiverOnToggle();
        requestOnClose();
        userManagementOnClose();
        masterlistOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Receiver Concerns",
          path: "/receiver/receiver-concerns",
          icon: "DiscountOutlined",
        },
      ],
    },
    {
      id: 6,
      name: "Approver",
      path: "/Approver",
      icon: "CreditScoreOutlined",
      open: approverOpen,
      onToggle: () => {
        approverOnToggle();
        receiverOnClose();
        requestOnClose();
        userManagementOnClose();
        masterlistOnClose();
        ticketingOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Approval",
          path: "/approver/approval",
          icon: "FactCheckOutlined",
        },
        {
          id: 2,
          name: "View Tickets",
          path: "/approver/view-tickets",
          icon: "VisibilityOutlined",
        },
      ],
    },
    {
      id: 7,
      name: "Ticketing",
      path: "/ticketing",
      icon: "ConfirmationNumberOutlined",
      open: ticketingOpen,
      onToggle: () => {
        ticketingOnToggle();
        receiverOnClose();
        requestOnClose();
        userManagementOnClose();
        masterlistOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Tickets",
          path: "/ticketing/issue-handler-tickets",
          icon: "ConfirmationNumberOutlined",
        },
      ],
    },
    {
      id: 8,
      name: "Reports",
      path: "/reports",
      icon: "AssessmentOutlined",
    },
  ];

  return (
    <Stack>
      {/* <Box sx={sx.sectionLabelWrap(collapsed)}>
        <Typography sx={sx.sectionLabel}>MENU</Typography>
      </Box> */}

      <List sx={sx.list}>
        {sidebarMenu
          .filter((item) => userPermission?.includes(item.name))
          .map((item, i) => {
            const visibleSubs = item.sub?.filter((subItem) => userPermission.includes(subItem.name)) ?? [];
            const hasSubs = visibleSubs.length > 0;

            // Same NavRow for every item, collapsed or expanded — nothing swaps
            // component trees, so the width/padding/opacity CSS transitions can
            // actually animate instead of popping.
            return (
              <NavRow
                key={i}
                item={item}
                subs={visibleSubs}
                hasSubs={hasSubs}
                collapsed={collapsed}
                pathname={pathname}
                navigate={navigate}
                onExpand={onExpand}
                onNavigate={onNavigate}
                openNotification={openNotification}
                ticketApprovalNotification={ticketApprovalNotification}
              />
            );
          })}
      </List>
    </Stack>
  );
};

const isMobileItemActive = (item, pathname) => item.path === pathname || item.sub?.some((s) => s.path === pathname);

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const [moreOpen, setMoreOpen] = useState(false);
  const [subSheetItem, setSubSheetItem] = useState(null);

  const permittedItems = MOBILE_MENU_ITEMS.filter((item) => userPermission?.includes(item.name));

  const quickItems = MOBILE_QUICK_ITEM_NAMES.map((name) => permittedItems.find((item) => item.name === name))
    .filter(Boolean)
    .slice(0, 4);
  const quickNames = new Set(quickItems.map((item) => item.name));
  const restItems = permittedItems.filter((item) => !quickNames.has(item.name));

  const activeIndex = (() => {
    const quickIndex = quickItems.findIndex((item) => isMobileItemActive(item, pathname));
    if (quickIndex !== -1) return quickIndex;
    if (restItems.some((item) => isMobileItemActive(item, pathname))) return quickItems.length;
    return -1;
  })();

  const handleQuickTap = (item) => {
    const visibleSubs = item.sub?.filter((s) => userPermission.includes(s.name)) ?? [];
    if (visibleSubs.length) {
      setSubSheetItem({ ...item, sub: visibleSubs });
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <BottomNavigation
        value={activeIndex}
        showLabels
        onChange={(_e, newValue) => {
          if (newValue === quickItems.length) {
            setMoreOpen(true);
          } else {
            handleQuickTap(quickItems[newValue]);
          }
        }}
        sx={sx.bottomNav}
      >
        {quickItems.map((item) => {
          const hasNotif = (item.name === "Ticketing" && openNotification) || (item.name === "Approver" && ticketApprovalNotification);
          return (
            <BottomNavigationAction
              key={item.id}
              label={item.name}
              sx={sx.bottomNavAction}
              icon={
                <Badge color="error" variant="dot" invisible={!hasNotif}>
                  {getMenuIcon(item.icon)}
                </Badge>
              }
            />
          );
        })}
        <BottomNavigationAction label="More" icon={<MoreHoriz />} sx={sx.bottomNavAction} />
      </BottomNavigation>

      {/* Small sheet for a quick tab's own sub-items only. */}
      <Drawer anchor="bottom" open={Boolean(subSheetItem)} onClose={() => setSubSheetItem(null)} PaperProps={{ sx: sx.subSheetPanel }}>
        {subSheetItem && (
          <>
            <Box sx={sx.sheetHandle} />
            <Typography sx={sx.flyoutHeader}>{subSheetItem.name}</Typography>
            <List sx={sx.flyoutList}>
              {subSheetItem.sub.map((s, j) => (
                <SubMenuItem
                  key={j}
                  subItem={s}
                  selected={s.path === pathname}
                  onClick={() => {
                    navigate(s.path);
                    setSubSheetItem(null);
                  }}
                  openNotification={openNotification}
                  ticketApprovalNotification={ticketApprovalNotification}
                />
              ))}
            </List>
          </>
        )}
      </Drawer>

      <Drawer anchor="bottom" open={moreOpen} onClose={() => setMoreOpen(false)} PaperProps={{ sx: sx.bottomSheetPanel }}>
        <Box sx={sx.sheetHandle} />
        <Stack sx={sx.sheetHeaderRow}>
          <Typography sx={sx.sheetTitle}>More</Typography>
          <IconButton onClick={() => setMoreOpen(false)} size="small" sx={sx.toggleButton}>
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
        <MoreMenuList items={restItems} pathname={pathname} onNavigate={() => setMoreOpen(false)} />
      </Drawer>
    </>
  );
};

const MoreMenuList = ({ items, pathname, onNavigate }) => {
  const navigate = useNavigate();
  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const [openId, setOpenId] = useState(() => items.find((item) => item.sub?.some((s) => s.path === pathname))?.id ?? null);

  return (
    <List sx={sx.list}>
      {items.map((item) => {
        const visibleSubs = item.sub?.filter((s) => userPermission.includes(s.name)) ?? [];
        const hasSubs = visibleSubs.length > 0;
        const isOpen = openId === item.id;

        const hasRowNotif = Boolean((item.name === "Ticketing" && openNotification) || (item.name === "Approver" && ticketApprovalNotification));

        return (
          <Fragment key={item.id}>
            <ListItemButton
              onClick={() => {
                if (hasSubs) {
                  setOpenId(isOpen ? null : item.id);
                } else {
                  navigate(item.path);
                  onNavigate?.();
                }
              }}
              selected={item.path === pathname}
              sx={sx.navButton(false)}
            >
              <ListItemIcon sx={sx.navIcon(false)}>{getMenuIcon(item.icon)}</ListItemIcon>
              <Box sx={sx.navLabelWrap(false)}>
                <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
                {hasSubs && <ExpandMore sx={sx.chevron(isOpen)} />}
              </Box>
              {hasRowNotif && <Box sx={sx.rowNotifDot} />}
            </ListItemButton>

            {hasSubs && (
              <Collapse in={isOpen} timeout={220} unmountOnExit>
                <List sx={sx.subList}>
                  {visibleSubs.map((s, j) => (
                    <SubMenuItem
                      key={j}
                      subItem={s}
                      selected={s.path === pathname}
                      onClick={() => {
                        navigate(s.path);
                        onNavigate?.();
                      }}
                      openNotification={openNotification}
                      ticketApprovalNotification={ticketApprovalNotification}
                    />
                  ))}
                </List>
              </Collapse>
            )}
          </Fragment>
        );
      })}
    </List>
  );
};
