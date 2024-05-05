"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { convertStrToSlugify, sendRequest } from "@/utils/api";

const ClientSearch = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [tracks, setTracks] = useState<ITrackTop[]>([]);

  const fetchData = async (query: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    if (res.data?.result) {
      setTracks(res.data.result);
    }
  };
  useEffect(() => {
    document.title = `"${query}" PTMusic`;

    if (query) fetchData(query);
  }, [query]);

  return (
    <div>
      {!query || !tracks.length ? (
        <div>No search results exist!</div>
      ) : (
        <Box>
          <div>
            Search results for keywords: <b>{query}</b>
          </div>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {tracks.map((track) => {
              return (
                <div key={track._id}>
                  <Box sx={{ display: "flex", width: "100%", gap: "20px" }}>
                    <Image
                      style={{ borderRadius: "3px" }}
                      alt="avatar track"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                      height={50}
                      width={50}
                    />
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
                  </Box>
                </div>
              );
            })}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ClientSearch;
