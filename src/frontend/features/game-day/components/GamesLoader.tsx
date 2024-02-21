import { Game } from "@/frontend/types/Game";
import FileIcon from "@mui/icons-material/FileCopy";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";

export function GamesLoader({
  open,
  gamesLoadClose,
  gamesLoad,
}: {
  open: boolean;
  gamesLoadClose: () => void;
  gamesLoad: (games: Game[]) => void;
}) {
  type GameLoader = {
    Home: string;
    Separator: string;
    Away: string;
    GolsHome: number;
    GolsAway: number;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gameLoader, setGameLoader] = useState<GameLoader[]>([]);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(event.target.files[0]);

    const reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        range: 2,
        header: ["Home", "Separator", "Away", "GolsHome", "GolsAway"],
      }) satisfies GameLoader[];
      setGameLoader(parsedData);
    };
  };

  const handleClose = () => {
    setSelectedFile(null);
    setGameLoader([]);
    gamesLoadClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const games = gameLoader.map(
      (g, index) =>
        ({
          gameNumber: index + 1,
          home: {
            name: g.Home,
          },
          away: {
            name: g.Away,
          },
        } as any)
    );
    gamesLoad(games);
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Games Loader</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an Excel file containing the games to be loaded.
          </DialogContentText>
          <TextField
            type="text"
            placeholder="No file selected yet"
            value={selectedFile ? selectedFile.name : ""}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton component="label" onClick={handleFileInput}>
                  <FileIcon />
                </IconButton>
              ),
            }}
            sx={{ mt: 2 }}
          />
          <input
            style={{ display: "none" }}
            type="file"
            hidden
            onChange={handleLoad}
            name="games"
            ref={fileInputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Load</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
