import { useState } from 'react';
import { Sparkles, Loader2, Download, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 402) {
          toast.error('AI credits exhausted. Please add more credits to continue.');
        } else {
          toast.error(errorData.error || 'Failed to generate image');
        }
        return;
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      toast.success('Image generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  return (
    <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-display font-semibold text-lg">AI Image Generator</h3>
        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Demo</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Describe what you want to create and let AI generate it for you.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="e.g., A luxury handbag on a marble surface with soft lighting..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          className="flex-1"
        />
        <Button 
          onClick={generateImage} 
          disabled={isLoading}
          className="bg-accent hover:bg-accent/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12 animate-pulse">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
            <p className="text-sm text-muted-foreground">Generating your image...</p>
          </div>
        </div>
      )}

      {generatedImage && !isLoading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative group">
            <img 
              src={generatedImage} 
              alt="AI Generated" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button onClick={downloadImage} variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={downloadImage} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
