"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { ExternalLink, Heart } from "lucide-react";

export function FeedbackToast() {
  useEffect(() => {
    // Check if feedback toast has already been shown in this session
    const hasShownFeedbackToast = localStorage.getItem(
      "polkadot-ui-feedback-toast-shown"
    );

    if (hasShownFeedbackToast) {
      return;
    }

    // Set a 5-second timer to show the feedback toast
    const timer = setTimeout(() => {
      toast(
        () => (
          <div className="flex !flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              <Heart className="h-5 w-5 text-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Help us improve polkadot-ui!
                </p>
                <p className="text-xs text-muted-foreground">
                  Share your feedback and help shape the future of Web3 UI
                  components
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: 10000, // 10 seconds duration
          position: "bottom-right",
          action: {
            label: (
              <div className="flex items-center gap-1">
                Give Feedback
                <ExternalLink className="h-3 w-3" />
              </div>
            ),
            onClick: () => {
              window.open(
                "https://8m793qvdaij.typeform.com/to/SeliZ404",
                "_blank"
              );
              // Mark as clicked so we don't show it again
              localStorage.setItem("polkadot-ui-feedback-toast-shown", "true");
            },
          },
          onDismiss: () => {
            // Mark as dismissed so we don't show it again in this session
            localStorage.setItem("polkadot-ui-feedback-toast-shown", "true");
          },
        }
      );

      // Mark as shown (regardless of user action)
      localStorage.setItem("polkadot-ui-feedback-toast-shown", "true");
    }, 3000); // 5 seconds delay

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything itself
}
