import { Suspense } from "react";
import type { Metadata } from "next/types";
import Container from "@mui/material/Container";
import ClientSearch from "@/components/search/client.search";

export const metadata: Metadata = {
  title: "Search page",
  description: "Search page",
};

const SearchPage = () => {
  return (
    <Container sx={{ mt: 3 }}>
      <Suspense>
        <ClientSearch />
      </Suspense>
    </Container>
  );
};

export default SearchPage;
