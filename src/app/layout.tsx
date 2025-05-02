import { Providers } from "./providers";
import { Metadata } from "next";
import { wantedSans } from "@/styles/fonts";
import StyledComponentsRegistry from "@/styles/registry";
import RootContainer from "./_components/RootContainer";
import { GlobalStyle } from "@/styles/globalStyle";

export const metadata: Metadata = {
  title: "GDG KU",
  description: "GDG KU official page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={wantedSans.className}>
      <body>
        <Providers>
          <StyledComponentsRegistry>
            <GlobalStyle />
            <RootContainer>{children}</RootContainer>
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
