"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NProgessWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#ccc"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NProgessWrapper;
