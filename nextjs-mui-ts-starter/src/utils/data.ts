export const idJsonObject = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "PTMusic Clone",
  image: {
    "@type": "ImageObject",
    url: "https://www.creatopy.com/blog/wp-content/uploads/2018/05/SoundCloud-Header.png",
    width: 1080,
    height: 1080,
  },
  telephone: "0866866923",
  url: "http://localhost:3000/",
  address: {
    "@type": "PostalAddress",
    streetAddress: "District 7, Ho Chi Minh City",
    addressLocality: "Ho Chi Minh",
    postalCode: "700000",
    addressRegion: "Ho Chi Minh",
    addressCountry: "VN",
  },
  priceRange: "1000 - 1000000000",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: "10.79664498748942",
    longitude: "106.65856519879867",
  },
};
