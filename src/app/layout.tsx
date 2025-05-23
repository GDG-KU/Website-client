import { Metadata } from "next";
import { wantedSans } from "@/styles/fonts";
import StyledComponentsRegistry from "@/styles/registry";
import RootContainer from "./_components/RootContainer";
import { GlobalStyle } from "@/styles/globalStyle";
import { ReactQueryProvider } from "@/modules/react-query/ReactQueryProvider";

export const metadata: Metadata = {
  title: "GDG KU",
  description: "GDG KU official page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={wantedSans.className}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <ReactQueryProvider>
            <RootContainer>{children}</RootContainer>
          </ReactQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
