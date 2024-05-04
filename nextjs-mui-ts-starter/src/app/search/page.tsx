import type { Metadata } from "next";
import Container from "@mui/material/Container";
import ClientSearch from "@/components/search/client.search";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search your tracks",
  description: "miêu tả thôi mà",
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
