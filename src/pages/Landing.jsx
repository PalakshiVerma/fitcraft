import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Target, Clock, Zap, TrendingUp, Shield, ChevronRight, Star } from 'lucide-react'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { APP_CONFIG } from '../config/app'

const features = [
  {
    icon: Target,
    title: 'Goal-Focused Workouts',
    description: 'Whether you want fat loss, muscle gain, or strength, our AI crafts the perfect plan.',
  },
  {
    icon: Clock,
    title: 'Time-Efficient Plans',
    description: 'No time? No problem. Get effective workouts from 15 minutes to an hour.',
  },
  {
    icon: Dumbbell,
    title: 'Equipment Flexibility',
    description: 'Full gym? Just dumbbells? Bodyweight only? We adapt to what you have.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Intelligence',
    description: 'Smart algorithms that learn from your progress and optimize every session.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'See your improvements over time with detailed workout history and stats.',
  },
  {
    icon: Shield,
    title: 'Science-Backed',
    description: 'Every workout is built on proven training principles and research.',
  },
]

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Workouts Generated' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '4.9', label: 'App Rating', icon: Star },
]

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Fitness Enthusiast',
    content: 'FitCraft completely transformed my routine. The AI-generated workouts keep me challenged and engaged.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Sarah Martinez',
    role: 'Busy Professional',
    content: 'Finally, workouts that fit my schedule. The 20-minute sessions are incredibly effective.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Mike Johnson',
    role: 'Amateur Athlete',
    content: 'The strength programs helped me break through plateaus I\'ve had for months.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-400">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[150px]" />

        <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo size="lg" />
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="primary">Start Free</Button>
              </Link>
            </div>
            <Link to="/dashboard" className="md:hidden">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Fitness
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight"
          >
            Fitness,{' '}
            <span className="text-gradient">Crafted for You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
          >
            {APP_CONFIG.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button size="xl" icon={<ChevronRight className="w-5 h-5" />} iconPosition="right" className="glow-primary">
                Start Your Journey
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="secondary" size="xl">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-text-primary">
                  {stat.value}
                  {stat.icon && <stat.icon className="w-6 h-6 text-primary-500 fill-primary-500" />}
                </div>
                <p className="text-text-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Powerful features designed to help you reach your fitness goals faster.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:glow-primary transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-300">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Get your personalized workout in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set Your Goal', desc: 'Choose fat loss, muscle gain, or strength building.' },
              { step: '02', title: 'Configure Details', desc: 'Pick your duration and available equipment.' },
              { step: '03', title: 'Get Your Plan', desc: 'AI generates a personalized workout instantly.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="text-6xl font-bold text-primary-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Loved by Fitness Enthusiasts
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              See what our community has to say about FitCraft.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary">{testimonial.name}</h4>
                    <p className="text-text-muted text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-text-secondary italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-strong rounded-3xl p-8 sm:p-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Join thousands of users who have already discovered the power of AI-generated workouts.
          </p>
          <Link to="/dashboard">
            <Button size="xl" icon={<ChevronRight className="w-5 h-5" />} iconPosition="right" className="animate-pulse-glow">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} FitCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-text-muted hover:text-text-primary text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-text-muted hover:text-text-primary text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-text-muted hover:text-text-primary text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
