/* eslint-disable react/no-danger */
import Head from 'next/head';

function GoogleAnalytics() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`,
        }}
      />
    </>
  );
}

export function LiveChat() {
  return (
    <script
      defer
      dangerouslySetInnerHTML={{
        __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='${process.env.NEXT_PUBLIC_LIVE_CHAT}';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();`,
      }}
    />
  );
}

export function BaseHeadTags() {
  return (
    <>
      <link rel="shortcut icon" href="/static/favicon.png" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <GoogleAnalytics />
      <LiveChat />
    </>
  );
}

export function PageSEOTags({ title, description }: { title: string; description?: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
    </Head>
  );
}
