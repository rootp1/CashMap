import { MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AssistantBubbleProps {
  message: string;
  onTipClick?: () => void;
}

export function AssistantBubble({ message, onTipClick }: AssistantBubbleProps) {
  return (
    <div className="flex items-center justify-center space-x-3 py-4">
      <Card className="relative bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-bl-sm max-w-[280px] shadow-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        
        {/* Speech bubble tail */}
        <div className="absolute -bottom-1 left-4 w-3 h-3 bg-primary transform rotate-45"></div>
      </Card>
      
      {onTipClick && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground touch-target"
          onClick={onTipClick}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}