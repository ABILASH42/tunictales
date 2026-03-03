import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const sizeData = [
  { size: 'S', bust: '34', waist: '28', hip: '36', shoulder: '13.5', length: '42' },
  { size: 'M', bust: '36', waist: '30', hip: '38', shoulder: '14', length: '43' },
  { size: 'L', bust: '38', waist: '32', hip: '40', shoulder: '14.5', length: '44' },
  { size: 'XL', bust: '40', waist: '34', hip: '42', shoulder: '15', length: '45' },
  { size: 'XXL', bust: '42', waist: '36', hip: '44', shoulder: '15.5', length: '46' },
];

const tips = [
  'Measure over your undergarments for the most accurate fit.',
  'Use a soft measuring tape and keep it snug but not tight.',
  'Stand straight and relaxed while measuring.',
  'If you fall between two sizes, we recommend ordering the larger size for a comfortable fit.',
  'Kurta length is measured from the highest point of the shoulder to the hem.',
];

const SizeGuide = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container-luxe max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-center mb-4">Size Guide</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find your perfect fit with our detailed size chart. All measurements are in inches.
          </p>

          {/* How to Measure */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-6">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-card border rounded-lg p-5">
                  <h3 className="font-semibold mb-1">Bust</h3>
                  <p className="text-sm text-muted-foreground">Measure around the fullest part of your bust, keeping the tape level.</p>
                </div>
                <div className="bg-card border rounded-lg p-5">
                  <h3 className="font-semibold mb-1">Waist</h3>
                  <p className="text-sm text-muted-foreground">Measure around the narrowest part of your natural waist.</p>
                </div>
                <div className="bg-card border rounded-lg p-5">
                  <h3 className="font-semibold mb-1">Hip</h3>
                  <p className="text-sm text-muted-foreground">Measure around the fullest part of your hips, about 8 inches below your waist.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-card border rounded-lg p-5">
                  <h3 className="font-semibold mb-1">Shoulder</h3>
                  <p className="text-sm text-muted-foreground">Measure from one shoulder edge to the other across the back.</p>
                </div>
                <div className="bg-card border rounded-lg p-5">
                  <h3 className="font-semibold mb-1">Length</h3>
                  <p className="text-sm text-muted-foreground">Measure from the highest point of the shoulder to the desired hem length.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-6">Kurta Size Chart (in inches)</h2>
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Size</th>
                      <th className="text-center p-4 font-semibold">Bust</th>
                      <th className="text-center p-4 font-semibold">Waist</th>
                      <th className="text-center p-4 font-semibold">Hip</th>
                      <th className="text-center p-4 font-semibold">Shoulder</th>
                      <th className="text-center p-4 font-semibold">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row) => (
                      <tr key={row.size} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-semibold text-accent">{row.size}</td>
                        <td className="p-4 text-center">{row.bust}</td>
                        <td className="p-4 text-center">{row.waist}</td>
                        <td className="p-4 text-center">{row.hip}</td>
                        <td className="p-4 text-center">{row.shoulder}</td>
                        <td className="p-4 text-center">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h2 className="font-display text-2xl font-semibold mb-6">Fitting Tips</h2>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;
