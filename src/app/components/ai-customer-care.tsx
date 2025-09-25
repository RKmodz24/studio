
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LifeBuoy, Send, Bot, User, Loader2 } from "lucide-react";
import { customerCare, type CustomerCareInput } from "@/ai/flows/customer-care-flow";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: 'user' | 'model';
  content: string;
};

const AICustomerCare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! How can I help you with Diamond Digger today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const result = await customerCare({ query: input, history });
      const aiMessage: Message = { role: 'model', content: result.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI customer care error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Sorry, I'm having trouble responding right now. Please try again later.",
      });
      // Restore user message so they can try again
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-40"
        onClick={() => setIsOpen(true)}
      >
        <LifeBuoy className="h-8 w-8" />
        <span className="sr-only">Need Help?</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] grid-rows-[auto_1fr_auto] max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>AI Customer Care</DialogTitle>
            <DialogDescription>
              Have a question about the app? Ask me anything!
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[50vh] px-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'model' && (
                    <div className="bg-primary rounded-full p-2 text-primary-foreground">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-3 text-sm",
                      message.role === 'user'
                        ? "bg-muted text-foreground"
                        : "bg-card border"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                     <div className="bg-secondary rounded-full p-2 text-secondary-foreground">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <div className="bg-primary rounded-full p-2 text-primary-foreground">
                      <Bot size={20} />
                    </div>
                    <div className="bg-card border rounded-lg p-3">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-6 pt-2">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                autoComplete="off"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AICustomerCare;
