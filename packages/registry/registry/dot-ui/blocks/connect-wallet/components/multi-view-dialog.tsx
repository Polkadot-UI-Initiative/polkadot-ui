"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ViewNavigationProps {
  next?: () => void;
  previous?: () => void;
}

export interface ViewMetadata {
  title: string;
  description?: string;
}

export interface ViewContentProps extends ViewNavigationProps, ViewMetadata {}

export type DialogView = ViewMetadata & {
  content: (navigation: ViewNavigationProps) => React.ReactNode;
};

export interface ViewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof ViewMetadata>,
    ViewMetadata {}

export interface MultiViewDialogProps {
  trigger: React.ReactNode;
  views: DialogView[];
  initialView?: number;
}

const View = ({ title, description, children, ...props }: ViewProps) => (
  <div {...props}>
    <DialogHeader className="pb-4">
      <DialogTitle>{title}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
    {children}
  </div>
);

export function MultiViewDialog({
  trigger,
  views,
  initialView = 0,
}: MultiViewDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(initialView);
  const [direction, setDirection] = React.useState(0);
  const [height, setHeight] = React.useState<number | "auto">("auto");
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);

  // Reset to initial view when dialog opens or initialView changes
  React.useEffect(() => {
    if (open) {
      setCurrentView(initialView);
      setDirection(0);
    }
  }, [open, initialView]);

  const containerRef = React.useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries?.[0]?.contentRect?.height;
        setHeight(observedHeight ?? "auto");
      });
      resizeObserverRef.current.observe(node);
    } else if (resizeObserverRef.current) {
      // Disconnect the observer when the node is unmounted to prevent memory leaks
      resizeObserverRef.current.disconnect();
    }
  }, []);

  const handleNext = () => {
    if (currentView < views.length - 1) {
      setDirection(1);
      setCurrentView(currentView + 1);
    }
  };

  const handlePrevious = () => {
    if (currentView > 0) {
      setDirection(-1);
      setCurrentView(currentView - 1);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
    }),
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <motion.div
          className="relative overflow-hidden"
          style={{
            height: height,
          }}
          animate={{ height }}
          transition={{
            duration: 0.15,
          }}
        >
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              ref={containerRef}
              key={currentView}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.15 },
                opacity: { type: "tween", duration: 0.15 },
              }}
              style={{ width: "100%" }}
            >
              <View
                title={views[currentView].title}
                description={views[currentView].description}
              >
                {views[currentView].content({
                  next: handleNext,
                  previous: handlePrevious,
                })}
              </View>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
