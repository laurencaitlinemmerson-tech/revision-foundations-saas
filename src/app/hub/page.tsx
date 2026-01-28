import { auth, redirectToSignIn } from "@clerk/nextjs/server";

export default async function HubPage() {
  const { userId } = await auth();
  if (!userId) return redirectToSignIn();

  // ...
}
