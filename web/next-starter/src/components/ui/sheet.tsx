"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type Side = "left" | "right" | "top" | "bottom";

/** Vị trí ban đầu / lúc thoát của panel theo hướng trượt. */
const offscreen: Record<Side, { x?: string; y?: string }> = {
  left: { x: "-100%" },
  right: { x: "100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
};

const sideClass: Record<Side, string> = {
  left: "inset-y-0 left-0 h-full w-[min(20rem,85vw)] border-r",
  right: "inset-y-0 right-0 h-full w-[min(20rem,85vw)] border-l",
  top: "inset-x-0 top-0 w-full border-b",
  bottom: "inset-x-0 bottom-0 w-full border-t",
};

const transition: Transition = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 };

type SheetProps = React.ComponentProps<typeof DialogPrimitive.Root>;

/**
 * Drawer trượt theo 4 hướng — Radix Dialog lo a11y (focus trap, Esc, khoá scroll),
 * `motion` lo chuyển động (kiểu drawer của ui-layouts).
 */
function Sheet(props: SheetProps) {
  return <DialogPrimitive.Root {...props} />;
}

const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: Side;
  /** Ẩn nút X mặc định khi muốn tự đặt nút đóng. */
  hideClose?: boolean;
  /** Bắt buộc: Radix cần title để đọc màn hình; truyền chuỗi hoặc node. */
  title: React.ReactNode;
  /** Ẩn title về mặt thị giác nhưng vẫn giữ cho screen reader. */
  srOnlyTitle?: boolean;
  open: boolean;
};

function SheetContent({
  className,
  children,
  side = "left",
  hideClose = false,
  title,
  srOnlyTitle = true,
  open,
  ...props
}: SheetContentProps) {
  return (
    <AnimatePresence>
      {open ? (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            />
          </DialogPrimitive.Overlay>

          <DialogPrimitive.Content asChild forceMount {...props}>
            <motion.div
              initial={offscreen[side]}
              animate={{ x: 0, y: 0 }}
              exit={offscreen[side]}
              transition={transition}
              className={cn(
                "bg-background border-border fixed z-50 flex flex-col shadow-xl outline-none",
                sideClass[side],
                className,
              )}
            >
              <DialogPrimitive.Title className={cn(srOnlyTitle && "sr-only")}>
                {title}
              </DialogPrimitive.Title>

              {!hideClose && (
                <DialogPrimitive.Close
                  className="hover:bg-accent focus-visible:ring-ring/50 absolute top-3 right-3 rounded-md p-1.5 transition-colors outline-none focus-visible:ring-[3px]"
                  aria-label="Đóng"
                >
                  <X className="size-4" />
                </DialogPrimitive.Close>
              )}

              {children}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
