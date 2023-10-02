import { GamesCards } from "@/frontend/features/game-day/components/GamesCards";
import { GameDayEvaluation } from "@/frontend/types/GameDay";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import * as React from "react";

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

type BettersTabsProps = {
  data?: GameDayEvaluation;
};

export function BettersTabs({ data }: BettersTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid xs={12} md={9}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="betters tabs">
            {data?.bets.map((b, index) => {
              return (
                <Tab
                  key={b.id}
                  label={
                    b.points === null
                      ? `${b.better.name}`
                      : `${b.better.name} (${b.points})`
                  }
                  {...a11yProps(index)}
                />
              );
            })}
          </Tabs>
        </Box>
        {data?.bets.map((b, index) => {
          return (
            <BettersTabPanel key={b.id} value={value} index={index}>
              <Grid container spacing={2} p={2}>
                <Grid xs={12}>
                  <Typography variant="h6">
                    {b.points !== null
                      ? `${b.points} Points`
                      : `Points not available yet`}
                  </Typography>
                </Grid>
                <GamesCards scores={b.scores} games={data.games} />
              </Grid>
            </BettersTabPanel>
          );
        })}
      </Box>
    </Grid>
  );
}

function BettersTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`betters-tabpanel-${index}`}
      aria-labelledby={`betters-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `betters-tab-${index}`,
    "aria-controls": `betters-tabpanel-${index}`,
  };
}
