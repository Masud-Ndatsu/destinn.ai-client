"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ModalProps {
  trigger: ReactNode;
  children: ReactNode;
  openModal: boolean;
  closeModal: (value: boolean) => void;
}

export function Modal({
  trigger,
  children,
  openModal,
  closeModal,
}: ModalProps) {
  return (
    <Dialog
      open={openModal}
      onOpenChange={(openState) => closeModal(openState)}
    >
      <DialogTrigger asChild>
        <span
          onClick={() => closeModal(!openModal)}
          style={{ display: "inline-block", color: "white" }}
        >
          {trigger}
        </span>
      </DialogTrigger>
      <DialogContent className="md:max-w-4xl rounded-none md:p-20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{null}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
