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
        background-color: #d9d9d9;
      }

      body {
        min-height: 100vh;
        min-height: 100dvh;
        background-color: #d9d9d9;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-family: ${theme.fonts.base};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      #root {
        width: 100%;
        max-width: ${theme.app.maxWidth};
        min-height: 100vh;
        min-height: 100dvh;
        background-color: ${theme.colors.white};
        position: relative;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
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
      }

      input,
      textarea {
        outline: none;
        font-family: inherit;
      }
    `}
  />
);
