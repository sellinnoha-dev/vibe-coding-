'use client'

import { motion } from 'framer-motion'

export function Hero() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary via-slate-900 to-slate-800 dark:from-primary dark:to-slate-900 pt-20 px-6 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={item} className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Transform Your <span className="text-accent">Digital</span> Presence
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We create stunning, high-performance digital solutions that elevate your brand and drive real results. From web development to creative strategy.
            </p>
            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-cyan-300 transition-colors"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="relative h-96 bg-gradient-to-br from-accent/10 to-cyan-500/5 rounded-2xl border border-accent/20 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent"></div>
            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="text-6xl font-bold text-accent/30"
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
