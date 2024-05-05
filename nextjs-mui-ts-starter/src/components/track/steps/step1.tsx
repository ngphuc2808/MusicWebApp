"use client";
import "./theme.scss";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDropzone, FileWithPath } from "react-dropzone";
import Button from "@mui/material/Button/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { VisuallyHiddenInput } from "./styled.module";

interface IProps {
  setValue: (v: number) => void;
  setTrackUpload: Dispatch<SetStateAction<ITrackUploadProps>>;
  trackUpload: ITrackUploadProps;
}

const InputFileUpload = () => {
  return (
    <Button
      onClick={(event) => event.preventDefault()}
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
};

const Step1 = (props: IProps) => {
  const { trackUpload, setValue, setTrackUpload } = props;
  const { data: session } = useSession();
  //useMemo => variable
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      if (acceptedFiles && acceptedFiles[0]) {
        setValue(1);
        const audio = acceptedFiles[0];
        const formData = new FormData();
        formData.append("fileUpload", audio);
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                delay: 5000,
              },
              onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                  (progressEvent.loaded * 100) / progressEvent.total!
                );

                setTrackUpload({
                  ...trackUpload,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompleted,
                });
              },
            }
          );
          setTrackUpload((prevState) => ({
            ...prevState,
            uploadedTrackName: res.data.data.fileName,
          }));
        } catch (error) {
          //@ts-ignore
          alert(error?.response?.data?.message);
        }
      }
    },
    [session]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      audio: [".mp3", ".m4a", ".wav"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <InputFileUpload />
        <p>Click or Drag/Drop to upload the track file!</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};

export default Step1;
