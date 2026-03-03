import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What fabrics are your kurtas made from?',
    answer: 'Our kurtas are crafted from premium fabrics including pure cotton, cotton silk, rayon, modal, and chanderi. Each product page specifies the exact fabric composition so you can choose what suits your comfort best.',
  },
  {
    question: 'How do I choose the right size for a kurta?',
    answer: 'We recommend checking our detailed Size Guide page. Measure your bust, waist, and hip and compare with our chart. If you fall between two sizes, we suggest going one size up for a relaxed fit. Our kurtas generally have a semi-relaxed silhouette.',
  },
  {
    question: 'Can I machine wash my kurta?',
    answer: 'Most of our kurtas can be gently machine washed in cold water on a delicate cycle. However, for embroidered or embellished pieces, we recommend hand washing or dry cleaning to preserve the detailing. Always check the care instructions on the product page.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Orders within India are typically delivered within 5–7 business days. Metro cities may receive orders sooner (3–5 days). You will receive a tracking link via email once your order is shipped.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Currently, we do not offer Cash on Delivery. All orders must be prepaid via UPI, credit/debit card, or net banking. This helps us keep our prices competitive and ensures smooth order processing.',
  },
  {
    question: 'What is your return/exchange policy?',
    answer: 'Due to the handcrafted and boutique nature of our products, we do not offer returns or exchanges. Please refer to our size guide carefully and reach out to us before ordering if you have any fit concerns. We are happy to assist you in choosing the perfect size.',
  },
  {
    question: 'Are the product colors accurate in the photos?',
    answer: 'We make every effort to display colors as accurately as possible. However, slight variations may occur due to screen settings, lighting during photography, and the natural characteristics of handcrafted fabrics. Each piece is unique!',
  },
  {
    question: 'How do I style a kurta for different occasions?',
    answer: 'For casual wear, pair your kurta with jeans or palazzos. For festive occasions, style it with a matching dupatta and statement earrings. Our coord sets and kurta sets come pre-styled for an effortlessly elegant look.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship only within India. We are working on expanding our delivery to international locations. Follow us on Instagram to stay updated on new shipping destinations.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a shipping confirmation email with a tracking link. You can also check your order status by logging into your account and visiting the "My Orders" section.',
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container-luxe max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-center mb-4">Frequently Asked Questions</h1>
          <p className="text-center text-muted-foreground mb-12">
            Everything you need to know about our kurtas, ordering, and more.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
