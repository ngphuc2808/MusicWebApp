import { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => {
  return {
    name: "PTMusic",
    short_name: "PTMusic",
    description: "Ứng dụng nghe nhạc",
    icons: [
      {
        src: "https://downloadr2.apkmirror.com/wp-content/uploads/2018/09/ic_music_round.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://cdn-icons-png.flaticon.com/512/9280/9280598.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#FF7F50",
    background_color: "#FF7F50",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    related_applications: [],
    scope: "/",
  };
  1;
};

export default manifest;
