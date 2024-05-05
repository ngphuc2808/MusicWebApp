"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../api";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/auth.options";

export const handleLikeTrackAction = async (
  id: string | undefined,
  quantity: number
) => {
  const session = await getServerSession(authOptions);
  await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "POST",
    body: {
      track: id,
      quantity: quantity,
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  revalidateTag("track-by-id");
  revalidateTag("liked-by-user");
};

export const handleUploadTrackAction = async (info: INewTrack) => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "POST",
    body: {
      title: info.title,
      description: info.description,
      trackUrl: info.trackUrl,
      imgUrl: info.imgUrl,
      category: info.category,
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  revalidateTag("track-by-profile");
  return res;
};

export const handleIncreaseViewAction = async (id: string | undefined) => {
  await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
    method: "POST",
    body: {
      trackId: id,
    },
  });

  revalidateTag("track-by-id");
};

export const handleNewPlaylistAction = async (
  title: string,
  isPublic: boolean
) => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
    method: "POST",
    body: { title, isPublic },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  revalidateTag("playlist-by-user");
  return res;
};

export const handleAddPlaylistAction = async (
  chosenPlaylist: IPlayList | undefined,
  tracks: string[]
) => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
    method: "PATCH",
    body: {
      id: chosenPlaylist?._id,
      title: chosenPlaylist?.title,
      isPublic: chosenPlaylist?.isPublic,
      tracks: tracks,
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  revalidateTag("playlist-by-user");
  return res;
};
