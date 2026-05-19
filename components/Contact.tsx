'use client';

import { motion } from 'framer-motion';
import { ContactFormFunctional } from './ContactFormFunctional';

export function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Get In <span className="text-accent">Touch</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Have a project in mind? Let's talk about it!
          </p>
        </motion.div>

        <ContactFormFunctional />
      </div>
    </section>
  );
}
