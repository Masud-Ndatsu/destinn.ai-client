"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import useModalStore from "@/stores/modal";

interface ModalProps {
  title?: string;
  trigger: ReactNode;
  children: ReactNode;
}

export function Modal({ trigger, children }: ModalProps) {
  const isOpenModal = useModalStore((state) => state.isOpen);
  const open = useModalStore((state) => state.open);

  return (
    <Dialog
      open={isOpenModal}
      onOpenChange={(openState) => (openState ? open(true) : open(false))}
    >
      <DialogTrigger asChild>
        <span
          onClick={() => open(!isOpenModal)}
          style={{ display: "inline-block", color: "white" }}
        >
          {trigger}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{null}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
