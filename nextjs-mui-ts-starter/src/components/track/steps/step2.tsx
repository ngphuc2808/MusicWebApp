"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

import { useToast } from "@/utils/toast";
import { VisuallyHiddenInput } from "./styled.module";
import { handleUploadTrackAction } from "@/utils/actions/actions";

interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
  setValue: (v: number) => void;
}

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

const LinearWithValueLabel = (props: IProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={props.trackUpload.percent} />
    </Box>
  );
};

const InputFileUpload = (props: IFile) => {
  const { setInfo, info, trackUpload } = props;
  const { data: session } = useSession();
  const toast = useToast();

  const handleUpload = async (image: File) => {
    const formData = new FormData();
    formData.append("fileUpload", image);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfo({
        ...info,
        imgUrl: res.data.data.fileName,
      });
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Button
      onChange={(e) => {
        const event = e.target as HTMLInputElement;
        if (event.files) {
          handleUpload(event.files[0]);
        }
      }}
      component="label"
      variant="contained"
      startIcon={
        trackUpload?.percent! < 100 ? (
          <CircularProgress size="1rem" color="inherit" />
        ) : (
          <CloudUploadIcon />
        )
      }
      disabled={trackUpload?.percent! < 100}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
};

const Step2 = (props: IProps) => {
  const toast = useToast();
  const router = useRouter();

  const { trackUpload, setValue } = props;
  const [info, setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });

  useEffect(() => {
    if (trackUpload && trackUpload.uploadedTrackName) {
      setInfo({
        ...info,
        trackUrl: trackUpload.uploadedTrackName,
      });
    }
  }, [trackUpload]);

  const handleSubmitForm = async () => {
    const res = await handleUploadTrackAction(info);
    if (res.data) {
      setValue(0);
      toast.success("create success");
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const category = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PARTY",
      label: "PARTY",
    },
  ];

  return (
    <div>
      <div>
        <div>{trackUpload.fileName}</div>
        <LinearWithValueLabel trackUpload={trackUpload} setValue={setValue} />
      </div>

      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ height: 250, width: 250, background: "#ccc" }}>
            <div>
              {info.imgUrl && (
                <Image
                  height={250}
                  width={250}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                  alt="info-img"
                />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload
              setInfo={setInfo}
              info={info}
              trackUpload={trackUpload}
            />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={info?.title}
            onChange={(e) =>
              setInfo({
                ...info,
                title: e.target.value,
              })
            }
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            value={info?.description}
            onChange={(e) =>
              setInfo({
                ...info,
                description: e.target.value,
              })
            }
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            value={info?.category}
            onChange={(e) =>
              setInfo({
                ...info,
                category: e.target.value,
              })
            }
            sx={{
              mt: 3,
            }}
            id="outlined-select-currency"
            select
            label="Category"
            fullWidth
            variant="standard"
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{
              mt: 5,
            }}
            onClick={() => handleSubmitForm()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Step2;
