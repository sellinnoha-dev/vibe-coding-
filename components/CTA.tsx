'use client'

import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-accent/10 to-cyan-500/10 dark:from-accent/5 dark:to-cyan-500/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Let's work together to create something amazing. Get in touch with our team today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-accent text-primary font-bold text-lg rounded-lg hover:bg-cyan-300 transition-colors"
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
