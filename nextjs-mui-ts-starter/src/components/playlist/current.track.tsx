"use client";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import IconButton from "@mui/material/IconButton";

import { useGlobalContext } from "@/app/lib/context.wrapper";
import { convertStrToSlugify } from "@/utils/api";
interface IProps {
  track: IShareTrack;
}
const CurrentTrack = (props: IProps) => {
  const { track } = props;

  const { currentTrack, setCurrentTrack } =
    useGlobalContext() as IGlobalContext;

  return (
    <Box
      sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
    >
      <Typography sx={{ py: 2 }}>
        <Link
          style={{ textDecoration: "none", color: "unset" }}
          href={`/track/${convertStrToSlugify(track.title)}-${
            track._id
          }.html?audio=${track.trackUrl}`}
        >
          {track.title}
        </Link>
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {(track._id !== currentTrack._id ||
          (track._id === currentTrack._id &&
            currentTrack.isPlaying === false)) && (
          <IconButton
            aria-label="play/pause"
            onClick={(e) => {
              setCurrentTrack({ ...track, isPlaying: true });
            }}
          >
            <PlayArrowIcon sx={{ height: 25, width: 25 }} />
          </IconButton>
        )}

        {track._id === currentTrack._id && currentTrack.isPlaying === true && (
          <IconButton
            aria-label="play/pause"
            onClick={(e) => {
              setCurrentTrack({ ...track, isPlaying: false });
            }}
          >
            <PauseIcon sx={{ height: 25, width: 25 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CurrentTrack;
