import '../styles/globals.css'

import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src='/stats/js/script.js'
        data-api='/stats/api/event'
        data-domain='randomizer.usefulclever.com' />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
