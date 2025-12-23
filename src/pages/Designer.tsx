import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, Type, Image, RotateCcw, ZoomIn, ZoomOut, 
  Trash2, Move, Download, ShoppingCart, Save,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic
} from 'lucide-react';
import { Canvas as FabricCanvas, Rect, Circle, IText, FabricImage } from 'fabric';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TSHIRT_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Forest', hex: '#166534' },
];

const FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Impact',
  'Comic Sans MS',
];

const Designer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [tshirtColor, setTshirtColor] = useState('#ffffff');
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState([32]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [designName, setDesignName] = useState('My Custom Design');
  const { user } = useAuth();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 300,
      height: 350,
      backgroundColor: 'transparent',
      selection: true,
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const addText = () => {
    if (!fabricCanvas || !textInput.trim()) {
      toast.error('Please enter some text');
      return;
    }

    const text = new IText(textInput, {
      left: 150,
      top: 150,
      fontSize: fontSize[0],
      fontFamily: fontFamily,
      fill: textColor,
      originX: 'center',
      originY: 'center',
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    setTextInput('');
    toast.success('Text added!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = document.createElement('img');
      imgElement.src = event.target?.result as string;
      imgElement.onload = () => {
        FabricImage.fromURL(imgElement.src).then((img) => {
          // Scale image to fit
          const maxSize = 150;
          const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
          img.scale(scale);
          img.set({
            left: 150,
            top: 150,
            originX: 'center',
            originY: 'center',
          });
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          toast.success('Image added!');
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
      toast.success('Deleted');
    }
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = 'transparent';
    fabricCanvas.renderAll();
    toast.success('Canvas cleared');
  };

  const saveDesign = () => {
    if (!fabricCanvas) return;
    
    const designData = fabricCanvas.toJSON();
    const previewUrl = fabricCanvas.toDataURL({ multiplier: 1, format: 'png' });
    
    // For now, save to localStorage (would save to Supabase in production)
    const designs = JSON.parse(localStorage.getItem('customDesigns') || '[]');
    designs.push({
      id: Date.now(),
      name: designName,
      data: designData,
      preview: previewUrl,
      tshirtColor,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('customDesigns', JSON.stringify(designs));
    
    toast.success('Design saved!');
  };

  const downloadDesign = () => {
    if (!fabricCanvas) return;
    
    const dataUrl = fabricCanvas.toDataURL({ multiplier: 1, format: 'png' });
    const link = document.createElement('a');
    link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
    toast.success('Design downloaded!');
  };

  const addToCart = () => {
    if (!user) {
      toast.error('Please sign in to add to cart');
      return;
    }
    // Would integrate with cart system
    toast.success('Custom design added to cart!');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-luxe py-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Custom T-Shirt Designer
            </h1>
            <p className="text-muted-foreground">
              Create your unique design and wear your imagination
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Design Tools */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-card border rounded-sm p-6 sticky top-24">
                <div className="space-y-2 mb-6">
                  <Label>Design Name</Label>
                  <Input
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    placeholder="My Custom Design"
                  />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="text" className="gap-2">
                      <Type className="h-4 w-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="gap-2">
                      <Image className="h-4 w-4" />
                      Image
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter Text</Label>
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Your text here"
                        onKeyDown={(e) => e.key === 'Enter' && addText()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Font</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONTS.map(font => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={12}
                        max={72}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <Button onClick={addText} className="w-full">
                      <Type className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Upload Image</Label>
                      <div className="border-2 border-dashed rounded-sm p-8 text-center hover:border-accent transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="border-t mt-6 pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>T-Shirt Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {TSHIRT_COLORS.map(color => (
                        <button
                          key={color.name}
                          onClick={() => setTshirtColor(color.hex)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            tshirtColor === color.hex
                              ? 'border-accent ring-2 ring-accent ring-offset-2'
                              : 'border-border hover:border-accent'
                          )}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={deleteSelected} className="flex-1">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearCanvas} className="flex-1">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Preview */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-muted rounded-sm p-8 flex items-center justify-center min-h-[500px]">
                <div className="relative">
                  {/* T-Shirt SVG */}
                  <svg
                    viewBox="0 0 400 450"
                    className="w-full max-w-md"
                    style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
                  >
                    <path
                      d="M100,50 L80,80 L20,60 L40,150 L80,130 L80,400 L320,400 L320,130 L360,150 L380,60 L320,80 L300,50 C280,30 220,20 200,20 C180,20 120,30 100,50 Z"
                      fill={tshirtColor}
                      stroke="#e5e5e5"
                      strokeWidth="2"
                    />
                  </svg>
                  
                  {/* Canvas overlay */}
                  <div
                    className="absolute"
                    style={{
                      top: '28%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="border border-dashed border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                <Button variant="outline" onClick={saveDesign}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Design
                </Button>
                <Button variant="outline" onClick={downloadDesign}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={addToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart - $29.99
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Base price: $24.99 + $5.00 customization fee
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Designer;