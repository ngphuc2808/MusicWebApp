import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
import slugify from "slugify";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0].split("-") ?? [];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });

  // optionally access and extend (rather than replace) parent metadata

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Hỏi Dân IT",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-
        hosting/master/eric.png`,
      ],
    },
  };
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;

  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0].split("-") ?? [];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      cache: "no-store",
    },
  });

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
