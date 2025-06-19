import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";

const AIChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold">AI Chat Assistant</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-gray-500 flex items-center justify-center">
            <span>AI chat coming soon...</span>
          </div>
          <div className="p-3 border-t">
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              placeholder="Type your message..."
              disabled
            />
          </div>
        </div>
      ) : (
        <Button
          variant="default"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open AI chat"
        >
          <MessageCircle size={22} />
        </Button>
      )}
    </div>
  );
};

export default AIChatWidget;
