"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  shareableId: z.string().min(8, "Please select a valid shareableId Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      shareableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.shareableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      // create transfer
      const transfer = await createTransfer(transferParams);

      // create transfer transaction
      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
      <Controller
        control={form.control}
        name="senderBank"
        render={() => (
          <Field className="border-t border-gray-200">
            <div className="payment-transfer_form-item pb-6 pt-5">
              <div className="payment-transfer_form-content">
                <FieldLabel className="text-14 font-medium text-gray-700">
                  Select Source Bank
                </FieldLabel>
                <FieldDescription className="text-12 font-normal text-gray-600">
                  Select the bank account you want to transfer funds from
                </FieldDescription>
              </div>
              <div className="flex w-full flex-col">
                <BankDropdown
                  accounts={accounts}
                  setValue={form.setValue}
                  otherStyles="!w-full"
                />
                <FieldError className="text-12 text-red-500" />
              </div>
            </div>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <Field className="border-t border-gray-200">
            <div className="payment-transfer_form-item pb-6 pt-5">
              <div className="payment-transfer_form-content">
                <FieldLabel className="text-14 font-medium text-gray-700">
                  Transfer Note (Optional)
                </FieldLabel>
                <FieldDescription className="text-12 font-normal text-gray-600">
                  Please provide any additional information or instructions
                  related to the transfer
                </FieldDescription>
              </div>
              <div className="flex w-full flex-col">
                <Textarea
                  placeholder="Write a short note here"
                  className="input-class"
                  {...field}
                />
                <FieldError className="text-12 text-red-500" />
              </div>
            </div>
          </Field>
        )}
      />

      <div className="payment-transfer_form-details">
        <h2 className="text-18 font-semibold text-gray-900">
          Bank account details
        </h2>
        <p className="text-16 font-normal text-gray-600">
          Enter the bank account details of the recipient
        </p>
      </div>

      <Controller
        control={form.control}
        name="email"
        render={({ field }) => (
          <Field className="border-t border-gray-200">
            <div className="payment-transfer_form-item py-5">
              <FieldLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                Recipient&apos;s Email Address
              </FieldLabel>
              <div className="flex w-full flex-col">
                <Input
                  placeholder="ex: johndoe@gmail.com"
                  className="input-class"
                  {...field}
                />
                <FieldError className="text-12 text-red-500" />
              </div>
            </div>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="shareableId"
        render={({ field }) => (
          <Field className="border-t border-gray-200">
            <div className="payment-transfer_form-item pb-5 pt-6">
              <FieldLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                Receiver&apos;s Plaid Sharable Id
              </FieldLabel>
              <div className="flex w-full flex-col">
                <Input
                  placeholder="Enter the public account number"
                  className="input-class"
                  {...field}
                />
                <FieldError className="text-12 text-red-500" />
              </div>
            </div>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="amount"
        render={({ field }) => (
          <Field className="border-y border-gray-200">
            <div className="payment-transfer_form-item py-5">
              <FieldLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                Amount
              </FieldLabel>
              <div className="flex w-full flex-col">
                <Input
                  placeholder="ex: 5.00"
                  className="input-class"
                  {...field}
                />
                <FieldError className="text-12 text-red-500" />
              </div>
            </div>
          </Field>
        )}
      />

      <div className="payment-transfer_btn-box">
        <Button type="submit" className="payment-transfer_btn">
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
            </>
          ) : (
            "Transfer Funds"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PaymentTransferForm;
