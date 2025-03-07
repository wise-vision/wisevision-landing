import TestCube from '../components/TestCube';
import Head from 'next/head';

export default function TestCubePage() {
  return (
    <>
      <Head>
        <title>WebGL Test - Simple Cube</title>
      </Head>
      <TestCube />
    </>
  );
}
