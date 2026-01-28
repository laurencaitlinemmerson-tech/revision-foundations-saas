// src/app/hub/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getIsPro } from "@/lib/getIsPro"; // whatever your path is

export default async function HubPage() {
  const { userId } = await auth(); // ✅ await

  const isSignedIn = Boolean(userId);
  const isPro = userId ? await getIsPro(userId) : false;

  return (
    <main>
      {/* your UI */}
      <div>Signed in: {String(isSignedIn)}</div>
      <div>Pro: {String(isPro)}</div>
    </main>
  );
}
