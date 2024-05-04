import UploadTrack from "@/components/track/upload.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";

const UploadPage = async () => {
  const refreshCache = async () => {
    "use server";
    await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-profile",
        secret: process.env.MY_SECRET_TOKEN,
      },
    });
  };

  return (
    <Container>
      <UploadTrack refreshCache={refreshCache} />
    </Container>
  );
};

export default UploadPage;
