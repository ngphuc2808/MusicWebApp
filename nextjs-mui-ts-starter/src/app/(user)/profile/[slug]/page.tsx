import ProfileTracks from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";
import React from "react";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: {
      id: params.slug,
    },
  });

  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={5}>
        {tracks.data?.result.map((item: any, index: number) => {
          return (
            <Grid item xs={12} md={6} key={index}>
              <ProfileTracks data={item} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
