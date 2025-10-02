
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser, useAuth } from "@/firebase";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { signInWithGoogle } from "@/firebase/auth";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { copy } from "@/lib/locales";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailSignUp = async (values: z.infer<typeof formSchema>) => {
    try {
      initiateEmailSignUp(auth, values.email, values.password);
      toast({
        title: "Sign Up Successful",
        description: "Your account has been created.",
      });
      router.push('/');
    } catch (error) {
      console.error("Email sign-up error", error);
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: "Could not create account. Please try again.",
      });
    }
  };


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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up with Email
              </Button>
            </form>
          </Form>
          
          <Separator className="my-6" />

          <div className="flex flex-col items-center space-y-4">
            <GoogleLoginButton />
            <Button variant="link" onClick={() => router.push('/')}>
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
