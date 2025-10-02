
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser, useAuth } from "@/firebase";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { signInWithGoogle, signInWithFacebook } from "@/firebase/auth";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { copy } from "@/lib/locales";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await signInWithGoogle(auth, credentialResponse.credential);
      toast({
        title: "Signed In",
        description: "You have successfully signed in with Google.",
      });
      router.push('/');
    } catch (error) {
      console.error("Google sign-in error", error);
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: "Could not sign in with Google. Please try again.",
      });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook(auth);
      toast({
        title: "Signed In",
        description: "You have successfully signed in with Facebook.",
      });
      router.push('/');
    } catch (error) {
      console.error("Facebook sign-in error", error);
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: "Could not sign in with Facebook. Please try again.",
      });
    }
  };

  const GoogleLoginButton = () => (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.error("Google login failed");
          toast({
            variant: "destructive",
            title: "Sign-in Failed",
            description: "Google login failed. Please try again.",
          });
        }}
      />
    </GoogleOAuthProvider>
  );
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
          <Button variant="ghost" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <CircleDollarSign className="h-10 w-10 text-yellow-500" />
            </div>
          <CardTitle>Join Golden Hours</CardTitle>
          <CardDescription>
            Sign up to save your progress and cash out your earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <GoogleLoginButton />
            <Button onClick={handleFacebookSignIn} className="w-full">
              Sign In with Facebook
            </Button>
            <Separator className="my-2" />
            <Button variant="link" onClick={() => router.push('/')}>
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
