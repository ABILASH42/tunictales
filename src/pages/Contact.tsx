import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container-luxe max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-center mb-4">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-12">
            We'd love to hear from you! Reach out to us through any of the channels below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">Call Us</h3>
              <a href="tel:+917902284933" className="text-muted-foreground hover:text-accent transition-colors text-lg">
                +91 7902284933
              </a>
            </div>

            <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">Email Us</h3>
              <a href="mailto:jrkoikkara@gmail.com" className="text-muted-foreground hover:text-accent transition-colors text-lg">
                jrkoikkara@gmail.com
              </a>
            </div>

            <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">Location</h3>
              <p className="text-muted-foreground text-lg">Kerala, India</p>
            </div>

            <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">Follow Us</h3>
              <a 
                href="https://www.instagram.com/tunic_tales?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors text-lg"
              >
                @tunic_tales
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
