"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;
  console.log(props.className)

  return (
    <Button disabled={isPending} formAction={props.formAction} className={props.className}>
      {isPending ? pendingText : children}
    </Button>
  );
}
