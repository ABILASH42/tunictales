import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface GeneratedDescription {
  shortDescription: string;
  fullDescription: string;
}

interface AIDescriptionGeneratorProps {
  productName?: string;
  category?: string;
  onApply?: (description: GeneratedDescription) => void;
}

export const AIDescriptionGenerator = ({ 
  productName: initialName = '', 
  category = '',
  onApply 
}: AIDescriptionGeneratorProps) => {
  const [productName, setProductName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedDescription | null>(null);
  const [copied, setCopied] = useState<'short' | 'full' | null>(null);

  const generateDescription = async () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to use AI features');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-description`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ productName, category }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 402) {
          toast.error('AI credits exhausted. Please add more credits to continue.');
        } else {
          toast.error(errorData.error || 'Failed to generate description');
        }
        return;
      }

      const data = await response.json();
      setResult(data);
      toast.success('Description generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate description');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'short' | 'full') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-display font-semibold text-lg">AI Description Generator</h3>
        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Demo</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Enter a product name and let AI generate compelling descriptions for you.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="e.g., Silk Evening Gown, Cashmere Sweater..."
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateDescription()}
          className="flex-1"
        />
        <Button 
          onClick={generateDescription} 
          disabled={isLoading}
          className="bg-accent hover:bg-accent/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Short Description</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result.shortDescription, 'short')}
              >
                {copied === 'short' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea
              value={result.shortDescription}
              readOnly
              className="resize-none bg-background/50"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Full Description</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result.fullDescription, 'full')}
              >
                {copied === 'full' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea
              value={result.fullDescription}
              readOnly
              className="resize-none bg-background/50"
              rows={4}
            />
          </div>

          {onApply && (
            <Button 
              onClick={() => onApply(result)} 
              variant="outline"
              className="w-full"
            >
              Apply to Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
