// pages/index.js
import Head from 'next/head';
import LandingPage from '../components/LandingPage/LandingPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>TM AI Day | Interactive AI Assistant</title>
        <meta name="description" content="TM AI Day interactive AI assistant with competency test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <LandingPage />
    </>
  );
}
