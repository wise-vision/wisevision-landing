import { Global } from '@emotion/react';
import { AppProps } from 'next/app';
import React from 'react';
import theme from 'theme';
import { ThemeProvider } from 'theme-ui';
import { Layout } from 'components/Layout';
import { PageSEOTags } from 'components/HeadTags';

const globalStyles = `
  html,
  body,
  body > div:first-of-type,
  div#__next {
    height: 100%;
    width: 100%;
  }

  html {
    overflow-x: hidden;
  }

  div#__next {
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
  }

  body.ReactModal__Body--open {
    overflow: hidden;
  }
`;

// extending Component with static properties that can be attached to it
interface CustomAppProps {
  Component: {
    seoTags?: JSX.Element;
  };
}

function App({ Component, pageProps }: AppProps & CustomAppProps) {
  const seoTags = Component.seoTags || <PageSEOTags title="WiseVision" />;

  return (
    <ThemeProvider {...{ theme }}>
      {seoTags}
      <Global styles={globalStyles} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
