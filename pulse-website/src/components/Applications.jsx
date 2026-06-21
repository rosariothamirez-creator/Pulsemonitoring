import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mountain, Building2, Train, Factory, Waves, Wrench, Globe, AlertTriangle } from 'lucide-react'

const applications = [
  {
    icon: Mountain,
    title: 'Open-Pit Mining',
    subtitle: 'Blast Monitoring',
    desc: 'Monitor explosive detonation vibrations at quarries and open-pit mines. Ensure compliance with limits to protect nearby structures and communities.',
    tags: ['Alert Zones'],
    color: 'orange',
    bg: 'from-orange-900/30 to-orange-900/5',
    border: 'border-orange-500/20',
    tag: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  },
  {
    icon: Mountain,
    title: 'Underground Mining',
    subtitle: 'Micro-seismic Events',
    desc: 'Detect rock-burst precursors and stress-release micro-seismic events in underground galleries. Early warning system for mine safety teams.',
    tags: ['Micro-seismic', 'Rock burst', 'Safety Alert'],
    color: 'red',
    bg: 'from-red-900/30 to-red-900/5',
    border: 'border-red-500/20',
    tag: 'border-red-500/30 bg-red-500/10 text-red-400',
  },
  {
    icon: Building2,
    title: 'Urban Infrastructure',
    subtitle: 'Construction Monitoring',
    desc: 'Track vibrations from construction activities, pile driving, and demolition. Protect historic buildings and ensure regulatory compliance in dense urban areas.',
    tags: ['DIN 4150', 'Heritage', 'Construction'],
    color: 'blue',
    bg: 'from-blue-900/30 to-blue-900/5',
    border: 'border-blue-500/20',
    tag: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  },
  {
    icon: Train,
    title: 'Railway Monitoring',
    subtitle: 'Traffic-Induced Vibrations',
    desc: 'Characterize vibration levels induced by rail and road traffic. Essential data for environmental impact assessments and infrastructure planning.',
    tags: ['Traffic', 'EIA', 'Frequency Analysis'],
    color: 'cyan',
    bg: 'from-cyan-900/30 to-cyan-900/5',
    border: 'border-cyan-500/20',
    tag: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  },
  {
    icon: Waves,
    title: 'Seismology Research',
    subtitle: 'Micro-seismic Networks',
    desc: 'Deploy low-cost seismic arrays for academic research and citizen science projects. Complement professional networks with dense spatial sampling.',
    tags: ['Research', 'Citizen Science', 'Array'],
    color: 'green',
    bg: 'from-emerald-900/30 to-emerald-900/5',
    border: 'border-emerald-500/20',
    tag: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Building2,
    title: 'Tunnel Construction',
    subtitle: 'TBM & Drilling Ops',
    desc: 'Monitor vibration propagation during TBM boring and drill-blast tunneling. Protect surface structures above active tunneling zones.',
    tags: ['TBM', 'Tunneling', 'Surface Risk'],
    color: 'purple',
    bg: 'from-purple-900/30 to-purple-900/5',
    border: 'border-purple-500/20',
    tag: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  },
  {
    icon: Factory,
    title: 'Industrial Facilities',
    subtitle: 'Machine Vibration',
    desc: 'Continuous condition monitoring of heavy machinery, compressors, and turbines. Detect bearing faults and imbalance before critical failure.',
    tags: ['Predictive Maintenance', 'FFT'],
    color: 'yellow',
    bg: 'from-yellow-900/30 to-yellow-900/5',
    border: 'border-yellow-500/20',
    tag: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  },
  {
    icon: Globe,
    title: 'Environmental Impact',
    subtitle: 'Assessment & Reporting',
    desc: 'Automated data collection for environmental impact assessments. Generate compliant reports with calibrated sensor data and statistical analysis.',
    tags: ['EIA Reports', 'Compliance', 'Automation'],
    color: 'teal',
    bg: 'from-teal-900/30 to-teal-900/5',
    border: 'border-teal-500/20',
    tag: 'border-teal-500/30 bg-teal-500/10 text-teal-400',
  },
]

export default function Applications() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="applications" ref={ref} className="py-28 bg-pulse-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pulse-cyan/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="tag-cyan mb-4 inline-flex">
            <Globe size={10} />
            Applications
          </div>
          <h2 className="section-heading mb-4">
            Where{' '}
            <span className="gradient-text">Pulse</span>{' '}
            Deploys
          </h2>
          <p className="section-sub mx-auto">
            From deep underground to city centers — Pulse adapts to any monitoring scenario
            where vibration data matters.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {applications.map((app, i) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-2xl border ${app.border} bg-pulse-surface/60 hover:bg-pulse-surface/90 transition-all duration-300 hover:scale-[1.02] cursor-default`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.bg} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10 p-5">
                <app.icon size={28} className="text-white/70 mb-3 group-hover:text-white transition-colors" />
                <div className="font-bold text-white text-sm mb-0.5">{app.title}</div>
                <div className="text-xs font-medium text-gray-400 mb-3">{app.subtitle}</div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors">
                  {app.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${app.tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compliance note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-10 flex items-center justify-center gap-3 glass border border-yellow-500/20 rounded-2xl px-6 py-4 max-w-2xl mx-auto"
        >
          <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-gray-400 text-center">
            Pulse is designed as a research and educational monitoring tool. For legally binding compliance measurements,
            certified instrumentation and accredited calibration are required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
