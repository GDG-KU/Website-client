"use client";

import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    background-color: #fbfbfb;
  }

  a {
    text-decoration: none;

    &:link {
      color: inherit;
      text-decoration: inherit;
    }

    &:visited {
      color: inherit;
      text-decoration: inherit;
    }
  }

  li {
    list-style: none;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
  }
`;
