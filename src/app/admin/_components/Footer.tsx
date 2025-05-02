"use client";

import styled, { css } from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const PATHS = [
  { path: "/admin/management", title: "멤버 포인트 관리" },
  { path: "/admin/activity", title: "멤버 활동 관리" },
  { path: "/admin/calendar", title: "캘린더 관리" },
  { path: "/admin/faq", title: "FAQ 관리" },
] as const;

export default function Footer() {
  const pathname = usePathname();

  return (
    <StyledFooter>
      <div />

      <div className="left">
        {PATHS.map(({ path, title }) => (
          <StyledLink key={path} href={path} $isActive={pathname.startsWith(path)}>
            {title}
          </StyledLink>
        ))}
      </div>

      <StyledLinkIcon href="/admin/qualification" $isActive={pathname.startsWith("/admin/qualification")}>
        <Image src="/icons/qualification.svg" alt="자격 관리" width={40} height={40} />
      </StyledLinkIcon>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  width: 100%;
  min-height: 80px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  padding: 2rem 0;

  .left {
    display: flex;
    gap: 1rem;
  }
`;

const StyledLink = styled(Link)<{ $isActive: boolean }>`
  padding: 0.6rem 1.2rem;

  border: none;
  border-radius: 20px;
  background-color: #ddd;

  font-size: 0.9rem;

  transition: background-color 0.2s;

  &:hover {
    background-color: #bbb;
  }

  &:link {
    color: inherit;
    text-decoration: inherit;
  }

  &:visited {
    color: inherit;
    text-decoration: inherit;
  }

  &.active {
    background-color: #333;
    color: #fff;
  }
`;

const StyledLinkIcon = styled(Link)<{ $isActive: boolean }>`
  img {
    transition: filter 0.2s;

    ${({ $isActive }) =>
      $isActive &&
      css`
        filter: brightness(0.6);
      `}
  }
`;
