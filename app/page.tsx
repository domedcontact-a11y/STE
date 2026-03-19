import Link from 'next/link'
import { 
  ClipboardList, 
  PencilRuler, 
  Layers, 
  Settings, 
  Truck, 
  Factory, 
  Construction, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">STE App</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Features</Link>
              <Link href="#workflow" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Workflow</Link>
              <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Login</Link>
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(37,99,235,0.1)_0%,transparent_100%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-8 border border-blue-100 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Next-Gen Steel Management IS HERE
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-balance">
              Master the Entire <span className="text-blue-600">Steel Lifecycle</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 text-balance">
              The only platform designed specifically for engineering, fabrication, and erection. Track every element from drafting to inspection with surgical precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2">
                Start Free Trial <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features for Precision Teams</h2>
              <p className="text-slate-600 dark:text-slate-400">Everything you need to eliminate errors and hit every deadline.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800 group-hover:bg-blue-600 transition-colors">
                  <ClipboardList className="text-blue-600 dark:text-blue-400 group-hover:text-white w-6 h-6 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lifecycle Tracking</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Monitor every stage from design to installation. Automatic status updates and real-time alerts for deviations.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-600 transition-colors">
                  <PencilRuler className="text-indigo-600 dark:text-indigo-400 group-hover:text-white w-6 h-6 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">Drawing-Based Workflow</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Upload PDF or CAD drawings and link them directly to assemblies and elements for seamless field access.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-800 group-hover:bg-emerald-600 transition-colors">
                  <Layers className="text-emerald-600 dark:text-emerald-400 group-hover:text-white w-6 h-6 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">Resource Management</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Optimize fabrication shop capacity and erection crews with data-driven scheduling and resource allocation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Visualization */}
        <section id="workflow" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">The Unified Steel Workflow</h2>
              <p className="text-slate-600 dark:text-slate-400">From the first line of code to the final bolt inspection.</p>
            </div>
            
            <div className="relative">
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-10"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                <WorkflowStep 
                  icon={<PencilRuler className="w-6 h-6" />} 
                  title="Engineering" 
                  desc="Drafting & Modeling"
                  color="bg-blue-500"
                />
                <WorkflowStep 
                  icon={<Factory className="w-6 h-6" />} 
                  title="Fabrication" 
                  desc="Shop Production"
                  color="bg-indigo-500"
                />
                <WorkflowStep 
                  icon={<Truck className="w-6 h-6" />} 
                  title="Delivery" 
                  desc="Logistics & Shipping"
                  color="bg-purple-500"
                />
                <WorkflowStep 
                  icon={<Construction className="w-6 h-6" />} 
                  title="Erection" 
                  desc="On-site Assembly"
                  color="bg-pink-500"
                />
                <WorkflowStep 
                  icon={<ShieldCheck className="w-6 h-6" />} 
                  title="Inspection" 
                  desc="QA & Final Approval"
                  color="bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to streamline your shop?</h2>
            <p className="text-blue-100 text-lg mb-10">Join 500+ steel contractors who have optimized their operations with STE App.</p>
            <Link href="/login" className="px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-2xl flex items-center justify-center gap-2 mx-auto w-fit">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Layers className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">STE App</span>
              </div>
              <p className="max-w-xs text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The world&apos;s most advanced platform for steel structure construction management.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Product</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link href="#workflow" className="hover:text-blue-600 transition-colors">Workflow</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Company</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} STE App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function WorkflowStep({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="flex flex-col items-center text-center group translate-y-0 transition-transform duration-300 hover:-translate-y-2">
      <div className={`w-16 h-16 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200 dark:shadow-none transition-all group-hover:scale-110`}>
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-1">{title}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{desc}</p>
    </div>
  )
}



