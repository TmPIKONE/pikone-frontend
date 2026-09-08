import { Global, css } from '@emotion/react';
import { theme } from './theme';

export const GlobalStyle = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        min-height: 100%;
        background-color: #eef0f3;
        color-scheme: light;
        -webkit-text-size-adjust: 100%;
      }

      body {
        min-height: 100vh;
        min-height: 100dvh;
        background-color: #eef0f3;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-family: ${theme.fonts.base};
        color: ${theme.colors.text};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overscroll-behavior-y: none;
      }

      #root {
        width: 100%;
        max-width: ${theme.app.maxWidth};
        min-height: 100vh;
        min-height: 100dvh;
        background-color: ${theme.colors.white};
        position: relative;
        box-shadow: none;
        overflow-x: clip;
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      button {
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
        color: inherit;
        -webkit-tap-highlight-color: transparent;
      }

      input,
      textarea {
        outline: none;
        font-family: inherit;
        color: inherit;
      }

      img {
        max-width: 100%;
      }

      :focus-visible {
        outline: 3px solid rgba(17, 17, 17, 0.24);
        outline-offset: 3px;
      }

      h1,
      h2,
      h3,
      p {
        word-break: keep-all;
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}
  />
);
