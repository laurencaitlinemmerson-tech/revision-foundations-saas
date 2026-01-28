import HubClient from './HubClient';

export default function HubPage() {
  const isSignedIn = false;
  const isPro = false;

  return <HubClient isPro={isPro} isSignedIn={isSignedIn} />;
}
