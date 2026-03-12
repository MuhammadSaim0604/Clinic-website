import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-bold tracking-wider uppercase text-xs lg:text-sm mb-2 lg:mb-3">
              Common Questions
            </h2>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold font-display text-slate-900"
          >
            Frequently Asked Questions
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-10 lg:w-12 h-1 bg-primary mx-auto mt-3 lg:mt-4 rounded-full"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <AccordionItem
                  value={faq.id}
                  className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <span className="text-left font-bold text-slate-900 flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-slate-600 leading-relaxed prose prose-sm prose-slate">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
