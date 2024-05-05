"use client";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

import { useToast } from "@/utils/toast";
import { sendRequest } from "@/utils/api";
import { handleNewPlaylistAction } from "@/utils/actions/actions";

const NewPlaylist = () => {
  const [open, setOpen] = useState(false);

  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const toast = useToast();
  const router = useRouter();

  const handleClose = (event: SyntheticEvent | string, reason: string) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }
    const res = await handleNewPlaylistAction(title, isPublic);
    if (res.data) {
      toast.success("Tạo mới playlist thành công!");
      setIsPublic(true);
      setTitle("");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Playlist
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
        <DialogTitle> Thêm mới playlist:</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "30px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <TextField
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              label="Tiêu đề"
              variant="standard"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={isPublic === true ? "Public" : "Private"}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewPlaylist;
