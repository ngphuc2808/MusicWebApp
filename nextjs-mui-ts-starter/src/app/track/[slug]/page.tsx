import WaveTrack from "@/components/track/wave.track";
import { notFound, useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
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
      title: "SoundClound Clone",
      description: "Clone soundclound application with NextJs",
      type: "website",
      images: [``],
    },
  };
}

export async function generateStaticParams() {
  return [
    {
      slug: "nu-hon-bisou-662c0ec506f1691c6b0ebc9b.html",
    },
    {
      slug: "tinh-co-yeu-em-662c0ec506f1691c6b0ebca1.html",
    },
  ];
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

  const refreshCache = async () => {
    "use server";
    await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id",
        secret: process.env.MY_SECRET_TOKEN,
      },
    });
  };

  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={res1.data?.result ?? []}
          refreshCache={refreshCache}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
