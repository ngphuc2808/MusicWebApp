"use client";
import { ReactNode, SyntheticEvent, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Step1 from "./steps/step1";
import Step2 from "./steps/step2";

const CustomTabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const UploadTabs = () => {
  const [value, setValue] = useState(0);
  const [trackUpload, setTrackUpload] = useState<ITrackUploadProps>({
    fileName: "",
    percent: 0,
    uploadedTrackName: "",
  });

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", border: "1px solid #ccc", mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab disabled={value !== 0} label="Tracks" />
          <Tab disabled={value !== 1} label="Basic information" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Step1
          setValue={setValue}
          setTrackUpload={setTrackUpload}
          trackUpload={trackUpload}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Step2 trackUpload={trackUpload} setValue={setValue} />
      </CustomTabPanel>
    </Box>
  );
};

export default UploadTabs;
