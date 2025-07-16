"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useChatbotStore } from "@/store/chat";

export const ChatbotWidget = () => {
  const { isChatbotOpen, closeChatbot, toggleChatbot } = useChatbotStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I'm your AI career advisor. How can I help you discover amazing opportunities today?",
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content:
          "That's a great question! I'd be happy to help you find relevant opportunities. Let me search our database for you...",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div
      className="fixed 
  bottom-18 right-6
  left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none
  w-full max-w-md md:max-w-none md:w-auto 
  px-4 md:px-0 z-[700]"
      data-chat-widget
    >
      {/* Chat Window */}
      {isChatbotOpen && (
        <Card className="w-full md:w-96 h-96 mb-4 shadow-2xl border-0 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-[#3498db]/100 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">CareerBot</CardTitle>
                  <CardDescription className="text-blue-100">
                    Your AI Career Advisor
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChatbot}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-full p-0 bg-white">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 text-sm ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about opportunities..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Button */}

      {!isChatbotOpen && (
        <Button
          onClick={toggleChatbot}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-[#3498db]/100  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};
