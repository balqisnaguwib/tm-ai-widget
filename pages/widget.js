// pages/widget.js
import Head from 'next/head';
import AIWidget from '../components/AIWidget/AIWidget';
import styles from '../styles/widget.module.css';

export default function WidgetPage() {
  return (
    <>
      <Head>
        <title>TM AI Day | Chat Widget</title>
        <meta name="description" content="TM AI Day AI Assistant Widget" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.widgetPage}>
        <div className={styles.container}>
          <h1>TM AI Day Chat Widget</h1>
          <p>Click on the chat button in the bottom right corner to start interacting with the AI assistant.</p>
        </div>
        
        <AIWidget />
      </div>
    </>
  );
}
