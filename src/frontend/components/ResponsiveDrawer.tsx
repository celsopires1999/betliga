import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
const drawerWidth = 240;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ResponsiveDrawer({ open, onClose }: Props) {
  const routes = [
    {
      path: "/dashboard",
      name: "Dashboard",
    },
    {
      path: "/game-days/create",
      name: "Create Game Day",
    },
    {
      path: "/bets/create",
      name: "Create Bet",
    },
    {
      path: "/game-days/result",
      name: "Game Day Result",
    },
    {
      path: "/game-days/evaluation",
      name: "Game Day Evaluation",
    },
  ];

  const drawer = (
    <div>
      <Paper elevation={3}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            BetLiga
          </Typography>
        </Toolbar>
      </Paper>
      {/* <Divider /> */}
      <List>
        {routes.map((route, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={route.path} LinkComponent={Link}>
              <ListItemText>{route.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const toggleDrawer = (_event: React.MouseEvent) => {
    onClose();
  };

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      onClick={toggleDrawer}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
