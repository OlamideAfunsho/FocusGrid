"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "@clerk/nextjs";

type AuthCtaButtonProps = {
  className?: string;
  labelClassName?: string;
  signedOutLabel?: string;
  signedInLabel?: string;
  // Hide instead of linking to the dashboard, for places that already show a Dashboard link
  hideWhenSignedIn?: boolean;
  children?: React.ReactNode;
};

// Call-to-action that sends new visitors to sign-up and signed-in users to their dashboard.
// Shows the signed-out version while Clerk loads, so the button never disappears.
const AuthCtaButton = ({
  className,
  labelClassName,
  signedOutLabel = "Get started for free",
  signedInLabel = "Go to Dashboard",
  hideWhenSignedIn = false,
  children,
}: AuthCtaButtonProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = isLoaded && isSignedIn;

  if (signedIn && hideWhenSignedIn) return null;

  return (
    <Link href={signedIn ? "/dashboard" : "/sign-up"} className={className}>
      <span className={labelClassName}>{signedIn ? signedInLabel : signedOutLabel}</span>
      {children}
    </Link>
  );
};

export default AuthCtaButton;
