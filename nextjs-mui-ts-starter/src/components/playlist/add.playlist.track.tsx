"use client";
import { SyntheticEvent, useState } from "react";
import Button from "@mui/material/Button/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";

import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { handleAddPlaylistAction } from "@/utils/actions/actions";

interface IProps {
  playlists: IPlayList[];
  tracks: ITrackTop[];
}

const AddPlaylistTrack = (props: IProps) => {
  const { playlists, tracks } = props;

  const [open, setOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const [playlistId, setPlaylistId] = useState("");
  const [tracksId, setTracksId] = useState<string[]>([]);

  const theme = useTheme();

  const handleClose = (event: SyntheticEvent | string, reason: string) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
    setPlaylistId("");
    setTracksId([]);
  };

  const getStyles = (
    name: string,
    tracksId: readonly string[],
    theme: Theme
  ) => {
    return {
      fontWeight:
        tracksId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const handleSubmit = async () => {
    if (!playlistId) {
      toast.error("Please select playlist!");
      return;
    }
    if (!tracksId.length) {
      toast.error("Please select tracks!");
      return;
    }

    const chosenPlaylist = playlists.find((i) => i._id === playlistId);
    let tracks = tracksId?.map((item) => item?.split("###")?.[1]);

    tracks = tracks?.filter((item) => item);
    if (chosenPlaylist) {
      const res = await handleAddPlaylistAction(chosenPlaylist, tracks);
      if (res.data) {
        toast.success("Added track to playlist successfully!");
        handleClose("", "");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Tracks
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
        <DialogTitle>Add track to playlist:</DialogTitle>
        <DialogContent>
          <Box
            width={"100%"}
            sx={{ display: "flex", gap: "30px", flexDirection: "column" }}
          >
            <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
              <InputLabel>Choose playlist</InputLabel>
              <Select
                value={playlistId}
                label="Playlist"
                onChange={(e) => setPlaylistId(e.target.value)}
              >
                {playlists.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl sx={{ mt: 5, width: "100%" }}>
              <InputLabel id="demo-multiple-chip-label">Track</InputLabel>
              <Select
                multiple
                value={tracksId}
                onChange={(e) => {
                  setTracksId(e.target.value as string[]);
                }}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      return (
                        <Chip key={value} label={value?.split("###")?.[0]} />
                      );
                    })}
                  </Box>
                )}
              >
                {tracks.map((track) => {
                  return (
                    <MenuItem
                      key={track._id}
                      value={`${track.title}###${track._id}`}
                      style={getStyles(
                        `${track.title}###${track._id}`,
                        tracksId,
                        theme
                      )}
                    >
                      {track.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("", "")}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPlaylistTrack;
