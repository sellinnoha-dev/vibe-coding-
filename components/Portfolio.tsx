'use client'

import { motion } from 'framer-motion'

const portfolioItems = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Full-stack e-commerce solution with payment integration',
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile App',
    description: 'Secure banking application for iOS and Android',
  },
  {
    title: 'SaaS Dashboard',
    category: 'Web Development',
    description: 'Analytics dashboard with real-time data visualization',
  },
  {
    title: 'Brand Identity',
    category: 'Design',
    description: 'Complete branding package for tech startup',
  },
  {
    title: 'Fitness Tracker',
    category: 'Mobile App',
    description: 'Cross-platform health and fitness tracking application',
  },
  {
    title: 'AI Chatbot',
    category: 'Web Development',
    description: 'Intelligent chatbot with natural language processing',
  },
]

export function Portfolio() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="portfolio" className="py-20 px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Featured <span className="text-accent">Work</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Check out our latest projects and success stories
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioItems.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-accent/20 to-cyan-500/10 border border-accent/30 cursor-pointer"
            >
              <div className="absolute inset-0 bg-primary/80 group-hover:bg-primary/90 transition-colors flex flex-col justify-center items-center p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-accent text-sm mb-3">{project.category}</p>
                <p className="text-slate-300 text-sm">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
