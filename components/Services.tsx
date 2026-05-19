'use client'

import { motion } from 'framer-motion'

const services = [
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'Modern, responsive websites built with cutting-edge technologies. SEO optimized and lightning-fast performance.',
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that engage users. We focus on user experience and accessibility.',
  },
  {
    icon: '📱',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications. iOS and Android solutions for your business needs.',
  },
  {
    icon: '🔒',
    title: 'Security',
    description: 'Enterprise-grade security practices. Data protection, encryption, and compliance standards.',
  },
  {
    icon: '⚡',
    title: 'Performance',
    description: 'Optimized for speed. We ensure your digital products load instantly and run smoothly.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'Data-driven insights. Track performance and make informed decisions with detailed analytics.',
  },
]

export function Services() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="services" className="py-20 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Our <span className="text-accent">Services</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10 }}
              className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-accent/50 transition-all"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
