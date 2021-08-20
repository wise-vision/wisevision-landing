/* eslint-disable react/no-danger */
import Head from 'next/head';

function GoogleTagManager() {
  return (
    <>
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_CODE}');`,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_CODE}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
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
      <GoogleTagManager />
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
