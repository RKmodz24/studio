"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PayoutDetails } from "@/lib/types";
import { Loader2 } from "lucide-react";

const bankSchema = z.object({
  payoutType: z.literal("bank"),
  accountHolderName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  accountNumber: z.string().regex(/^\d{9,18}$/, {
    message: "Enter a valid account number.",
  }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: "Enter a valid IFSC code.",
  }),
  bankName: z.string().min(3, {
    message: "Bank name seems too short.",
  }),
  rememberDetails: z.boolean().default(false),
});

const upiSchema = z.object({
  payoutType: z.literal("upi"),
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, {
    message: "Enter a valid UPI ID.",
  }),
  rememberDetails: z.boolean().default(false),
});

const formSchema = z.discriminatedUnion("payoutType", [
    bankSchema,
    upiSchema,
]);

type PayoutFormProps = {
  amount: number;
  onSubmit: (details: PayoutDetails, remember: boolean) => void;
  isProcessing: boolean;
  savedDetails?: PayoutDetails | null;
};

const PayoutForm = ({ amount, onSubmit, isProcessing, savedDetails }: PayoutFormProps) => {
  const defaultValues = savedDetails ? {
    ...savedDetails,
    rememberDetails: true,
    accountHolderName: savedDetails.payoutType === 'bank' ? savedDetails.accountHolderName : '',
    accountNumber: savedDetails.payoutType === 'bank' ? savedDetails.accountNumber : '',
    ifscCode: savedDetails.payoutType === 'bank' ? savedDetails.ifscCode : '',
    bankName: savedDetails.payoutType === 'bank' ? savedDetails.bankName : '',
    upiId: savedDetails.payoutType === 'upi' ? savedDetails.upiId : '',
  } : {
      payoutType: "bank" as const,
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      upiId: "",
      rememberDetails: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values, values.rememberDetails);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs
            defaultValue={savedDetails?.payoutType || "bank"}
            className="w-full"
            onValueChange={(value) => form.setValue("payoutType", value as "bank" | "upi")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            <TabsTrigger value="upi">UPI / Paytm</TabsTrigger>
          </TabsList>
          <TabsContent value="bank" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="State Bank of India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
                <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                        <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                        <Input placeholder="SBIN0001234" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </TabsContent>
          <TabsContent value="upi" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID</FormLabel>
                  <FormControl>
                    <Input placeholder="yourname@upi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <FormField
          control={form.control}
          name="rememberDetails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Save these details for future payouts
                </FormLabel>
                <FormDescription>
                  Your payout information will be pre-filled next time.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Request Payout of ₹${amount.toFixed(2)}`
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PayoutForm;