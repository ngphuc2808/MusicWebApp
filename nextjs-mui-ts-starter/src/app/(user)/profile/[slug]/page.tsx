import type { Metadata } from "next/types";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { sendRequest } from "@/utils/api";
import ProfileTracks from "@/components/global/header/profile.track";

export const metadata: Metadata = {
  title: "Your tracks page",
  description: "Your tracks page",
};

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=100`,
    method: "POST",
    body: {
      id: params.slug,
    },
    nextOption: {
      next: {
        tags: ["track-by-profile"],
      },
    },
  });

  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={5}>
        {tracks.data?.result.map((item, index: number) => {
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
