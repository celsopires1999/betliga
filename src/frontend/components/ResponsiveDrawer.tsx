import {
  Box,
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
import { useSearchParams } from "next/navigation";
import qs from "qs";

const drawerWidth = 240;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ResponsiveDrawer({ open, onClose }: Props) {
  const searchParams = useSearchParams();
  const ligaId = searchParams.get("liga_id")?.toString();
  const gameDayId = searchParams.get("game_day_id")?.toString();
  const betterId = searchParams.get("better_id")?.toString();
  const query = qs.stringify({
    liga_id: ligaId,
    game_day_id: gameDayId,
    better_id: betterId,
  });

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
      path: "/bets/edit",
      name: "Edit Bet",
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
            <ListItemButton
              href={`${route.path}/?${query}`}
              LinkComponent={Link}
              // onClick={toggleDrawer}
            >
              <ListItemText>{route.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  function toggleDrawer(_event: React.MouseEvent) {
    if (!open) return;
    onClose();
  }

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
