import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Target, Clock, Zap, TrendingUp, Shield, ChevronRight, Star } from 'lucide-react'
import Button, { SMALL_GLASS } from '../components/Button'
import Logo from '../components/Logo'
import LiquidGlass from '../components/LiquidGlass'
import heroBg from '../assets/MixCollage-14-Jul-2026-11-13-AM-531.jpg'
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
    <div className="relative min-h-screen">
      {/* Page-wide static backdrop: ONE image behind the whole landing page,
          not a per-section background. Every section below is transparent so
          this shows through, and the glass cards now refract the photo itself
          — which is the best backdrop the effect can have.

          A `position: fixed` element rather than `background-attachment:
          fixed`: both keep the image still while content scrolls, but a fixed
          element is promoted to its own compositor layer and never repaints,
          whereas fixed-attachment repaints the page every scroll frame and
          re-runs every glass filter (that was the earlier jank). This also
          works on iOS, where fixed attachment does not. */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      {/* Scrim. Still load-bearing — the collage has a near-white panel and
          plain copy sits over the photo — but pulled back from 85% to 60%:
          at 85% it was smothering the image and the whole page read as a
          dark slab. */}
      <div className="fixed inset-0 z-[-1] bg-dark-400/60" aria-hidden="true" />
      {/* Lift. The photo is mostly black, so simply removing scrim cannot
          brighten the page — there is nothing bright underneath to reveal.
          Light has to be added: a soft top-down glow that gives the page a
          light source and stops it reading as flat and unlit. */}
      <div
        className="fixed inset-0 z-[-1] bg-[radial-gradient(70rem_45rem_at_50%_-5%,rgba(233,231,255,0.16),transparent_65%)]"
        aria-hidden="true"
      />
      {/* The photo is greyscale — this wash is what gives the glass rims a
          colour to split into a prism fringe. Warmed up alongside the lift. */}
      <div
        className="fixed inset-0 z-[-1] bg-gradient-to-b from-primary-500/20 via-transparent to-primary-600/15"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
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
            {/* Pill glass: explicit radius because the library reads
                border-radius, and rounded-full resolves to 9999px — far
                larger than the element, which distorts the displacement map. */}
            <LiquidGlass
              as={motion.span}
              glassOptions={{ ...SMALL_GLASS, radius: 18 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-primary-400 text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
              AI-Powered Fitness
            </LiquidGlass>
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
              <Button variant="glass" size="xl">
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
              <LiquidGlass
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl p-6 hover:glow-primary transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </LiquidGlass>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      {/* No bg-dark-300 band here — an opaque section would cover the one
          static image, which is the whole point. Depth now comes from the
          photo behind it, not from a different fill. */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
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
              <LiquidGlass
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center rounded-2xl p-8"
              >
                <div className="text-6xl font-bold text-primary-500/30 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </LiquidGlass>
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
              <LiquidGlass
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl p-6"
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
              </LiquidGlass>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <LiquidGlass
          strong
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center"
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
        </LiquidGlass>
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
