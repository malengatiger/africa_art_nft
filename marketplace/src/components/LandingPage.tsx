import * as React from 'react';
import {ConnectButton, Button} from 'web3uikit'
export interface ILandingPageProps {
}

export default function LandingPage (props: ILandingPageProps) {
  return (
    <div>
      <h1>Landing Page</h1>
      <ConnectButton />
    </div>
  );
}

