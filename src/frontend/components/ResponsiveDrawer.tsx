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
      path: "/",
      name: "Dashboard",
    },
    {
      path: "/create-game-day",
      name: "Create Game Day",
    },
    {
      path: "/create-bet",
      name: "Create Bet",
    },
    {
      path: "/results",
      name: "Results",
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
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
