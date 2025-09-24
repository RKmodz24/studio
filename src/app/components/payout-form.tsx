"use client";

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
import type { PayoutDetails } from "@/lib/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
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
});

type PayoutFormProps = {
  amount: number;
  onSubmit: (details: PayoutDetails) => void;
  isProcessing: boolean;
};

const PayoutForm = ({ amount, onSubmit, isProcessing }: PayoutFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
