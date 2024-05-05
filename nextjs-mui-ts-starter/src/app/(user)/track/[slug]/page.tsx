import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next/types";
import Container from "@mui/material/Container";

import { sendRequest } from "@/utils/api";
import WaveTrack from "@/components/track/wave.track";

interface IProps {
  params: { slug: string };
}

export const generateMetadata = async (
  { params }: IProps,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0].split("-") ?? [];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "PTMusic",
      description: "PTMusic application with NextJs",
      type: "website",
      images: [
        `https://www.creatopy.com/blog/wp-content/uploads/2018/05/SoundCloud-Header.png`,
      ],
    },
  };
};

export const generateStaticParams = async () => {
  return [];
};

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0].split("-") ?? [];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      next: {
        tags: ["track-by-id"],
      },
    },
  });

  if (!res.data) {
    notFound();
  }

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={res1.data?.result ?? []}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
