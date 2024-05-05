"use client";
import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext<IGlobalContext | null>(null);

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const initValue = {
    _id: "",
    title: "",
    description: "",
    category: "",
    imgUrl: "",
    trackUrl: "",
    countLike: 0,
    countPlay: 0,
    uploader: {
      _id: "",
      email: "",
      name: "",
      role: "",
      type: "",
    },
    isDeleted: false,
    createdAt: "",
    updatedAt: "",
    isPlaying: false,
  };
  const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);

  return (
    <GlobalContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContextProvider;
