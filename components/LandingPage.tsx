import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, ChevronDown, ChevronRight, Menu, X, MessageSquare, 
  Send, CheckCircle, Target, BookOpen, User, Building, Mail, 
  Briefcase, ArrowRight, HelpCircle, Lock, LogOut, CreditCard, Check,
  MapPin, Phone, ShieldCheck, FileText, Loader2
} from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { UserProfile } from '../App';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'editor' | 'eventtree' | 'faulttree' | 'lopa' | 'qra' | 'hazop' | 'fmea' | 'case-studies') => void;
  user: UserProfile | null;
  onLogin: (user: UserProfile | null) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, user, onLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals State
  const [isTrialOpen, setTrialOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isLearnMoreOpen, setLearnMoreOpen] = useState(false);
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSupportOpen, setSupportOpen] = useState(false);
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  // Checkout State
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number, period: string} | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am the Safety Assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Forms State
  const [trialForm, setTrialForm] = useState({ name: '', email: '', company: '', role: '' });
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    const history = chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const response = await getChatResponse(userMsg.text, history);

    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setChatLoading(false);
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
        setTrialSubmitted(true);
    }, 800);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const VALID_EMAIL = "mubeen.ahsan@safetyforall.site";
    const VALID_PASS = "669914";

    if (signInEmail.toLowerCase() === VALID_EMAIL && signInPassword === VALID_PASS) {
        // Extract Name "Mubeen" from email
        const firstName = signInEmail.split('.')[0];
        const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        
        onLogin({
            name: capitalized,
            email: signInEmail
        });
        setSignInOpen(false);
        setSignInEmail('');
        setSignInPassword('');
    } else {
        setSignInError("Invalid credentials. Please contact administrator.");
    }
  };

  const handleSignOut = () => {
      onLogin(null);
  };

  const handleModuleClick = (module: any) => {
    if (module === 'editor') {
        // BowTie is always accessible (some features locked inside)
        onNavigate(module); 
    } else {
        // Other modules require login
        if (user) {
            onNavigate(module);
        } else {
            setSignInOpen(true);
        }
    }
  };

  // --- CHECKOUT LOGIC ---
  const handleSelectPlan = (name: string, price: number, period: string) => {
    setSelectedPlan({ name, price, period });
    setPricingOpen(false);
    setCheckoutSubmitted(false);
    setCheckoutForm({
      fullName: user ? user.name : '',
      email: user ? user.email : '',
      whatsapp: '',
      address: '',
      city: '',
      zip: '',
      country: ''
    });
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCheckout(true);

    // Simulate backend processing and email dispatch
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setCheckoutSubmitted(true);
      // In a real app, we would send data to an API here
      console.log("Order Submitted:", {
        plan: selectedPlan,
        billing: checkoutForm,
        tax: selectedPlan ? selectedPlan.price * 0.1 : 0,
        total: selectedPlan ? selectedPlan.price * 1.1 : 0
      });
    }, 2000);
  };

  const closeCheckout = () => {
    setSelectedPlan(null);
    setCheckoutSubmitted(false);
  };

  const calculateTotal = () => {
    if (!selectedPlan) return { tax: 0, total: 0 };
    const tax = selectedPlan.price * 0.10; // 10% Tax
    return {
      tax: tax,
      total: selectedPlan.price + tax
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center px-6 md:px-10 h-[70px] bg-slate-900/90 backdrop-blur-md border-b border-slate-800 relative z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-md shadow-lg shadow-emerald-500/20">
            <Activity className="text-white" strokeWidth={2.5} size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Safety for All</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400 items-center h-full">
          <div className="nav-item h-full flex items-center cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setAboutOpen(true)}>About us</div>
          
          <div className="nav-item h-full flex items-center cursor-pointer hover:text-emerald-400 transition-colors group relative">
            <span className="flex items-center gap-1">Products <ChevronDown size={14} /></span>
            <div className="absolute top-[70px] left-0 bg-slate-800 border border-slate-700 border-t-[3px] border-t-emerald-500 min-w-[260px] hidden group-hover:flex flex-col shadow-2xl rounded-b-md">
              
              {/* Qualitative Analysis */}
              <div className="group/sub relative px-5 py-3 text-slate-300 hover:bg-slate-700 hover:text-white flex justify-between items-center transition-colors border-b border-slate-700/50">
                <span>Qualitative Analysis</span>
                <ChevronRight size={14} className="text-slate-500" />
                {/* Submenu */}
                <div className="absolute top-0 right-full bg-slate-800 border border-slate-700 border-t-[3px] border-t-emerald-500 min-w-[240px] hidden group-hover/sub:flex flex-col shadow-2xl rounded-l-md rounded-br-md -mr-[1px]">
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('editor')}>
                    <span className="text-emerald-400 font-semibold">BowTie Analysis</span>
                  </div>
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('faulttree')}>
                    <span className="text-emerald-400 font-semibold">Fault Tree Analysis</span>
                    {!user && <Lock size={14} className="text-slate-500"/>}
                  </div>
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('eventtree')}>
                    <span className="text-emerald-400 font-semibold">Event Tree Analysis</span>
                    {!user && <Lock size={14} className="text-slate-500"/>}
                  </div>
                </div>
              </div>

              {/* Semi-Quantitative Analysis */}
              <div className="group/sub relative px-5 py-3 text-slate-300 hover:bg-slate-700 hover:text-white flex justify-between items-center transition-colors border-b border-slate-700/50">
                <span>Semi-Quantitative</span>
                <ChevronRight size={14} className="text-slate-500" />
                {/* Submenu */}
                <div className="absolute top-0 right-full bg-slate-800 border border-slate-700 border-t-[3px] border-t-emerald-500 min-w-[240px] hidden group-hover/sub:flex flex-col shadow-2xl rounded-l-md rounded-br-md -mr-[1px]">
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('hazop')}>
                    <span className="text-emerald-400 font-semibold">HAZOP Study</span>
                    {!user && <Lock size={14} className="text-slate-500"/>}
                  </div>
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('lopa')}>
                    <span className="text-emerald-400 font-semibold">LOPA</span>
                    {!user && <Lock size={14} className="text-slate-500"/>}
                  </div>
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('fmea')}>
                    <span className="text-emerald-400 font-semibold">FMEA</span>
                    {!user && <Lock size={14} className="text-slate-500"/>}
                  </div>
                </div>
              </div>

              {/* Quantitative Analysis */}
              <div className="group/sub relative px-5 py-3 text-slate-300 hover:bg-slate-700 hover:text-white flex justify-between items-center transition-colors">
                <span>Quantitative Analysis</span>
                <ChevronRight size={14} className="text-slate-500" />
                 {/* Submenu */}
                 <div className="absolute top-0 right-full bg-slate-800 border border-slate-700 border-t-[3px] border-t-emerald-500 min-w-[240px] hidden group-hover/sub:flex flex-col shadow-2xl rounded-l-md rounded-br-md -mr-[1px]">
                  <div className="px-5 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => handleModuleClick('qra')}>
                    <span className="text-emerald-400 font-semibold">QRA</span>
                    {!user && <Lock size={14} className="text-slate-500"/>}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="nav-item h-full flex items-center cursor-pointer hover:text-emerald-400 transition-colors gap-1.5" onClick={() => handleModuleClick('case-studies')}>
            Case Studies {!user && <Lock size={14} className="text-slate-500 opacity-70"/>}
          </div>
          <div className="nav-item h-full flex items-center cursor-pointer hover:text-emerald-400 transition-colors">Industries</div>
          <div className="nav-item h-full flex items-center cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setPricingOpen(true)}>Pricing</div>
          <div className="nav-item h-full flex items-center cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setSupportOpen(true)}>Support</div>
          
          {user ? (
             <div className="flex items-center gap-2 ml-2">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2 cursor-default">
                   <User size={16}/> {user.name}
                </button>
                <button onClick={handleSignOut} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 p-2 rounded-lg transition-all" title="Sign Out">
                   <LogOut size={18}/>
                </button>
             </div>
          ) : (
             <button onClick={() => setSignInOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 ml-2">
                Sign In
             </button>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative h-[calc(100vh-70px)] min-h-[500px] flex items-center px-6 md:px-20 bg-[image:linear-gradient(to_right,#0f172a_30%,rgba(15,23,42,0.6)),url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
        <div className="max-w-[700px] z-10 relative animate-fade-in-up">
          <div className="text-[13px] font-bold text-emerald-400 mb-4 tracking-[2px] uppercase flex items-center gap-2">
            <span className="w-8 h-0.5 bg-emerald-500 inline-block"></span>
            Enterprise Safety Solution
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-white drop-shadow-2xl">
            Visualizing Risk for<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Safer Operations</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-[550px]">
            Empower your organization with advanced Bowtie methodology. Identify hazards, visualize barriers, and prevent incidents before they happen with AI-powered insights.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button 
                onClick={() => setTrialOpen(true)} 
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xl shadow-emerald-900/50 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
            >
              Request Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <button 
                onClick={() => setLearnMoreOpen(true)} 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-emerald-400 text-white hover:text-emerald-400 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* PRICING MODAL */}
      {isPricingOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-fade-in text-white border border-slate-700 relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900 flex-shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="text-emerald-500" size={20}/> Pricing Plans</h2>
              <button onClick={() => setPricingOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
               <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-white mb-2">Simple, Transparent Pricing</h3>
                  <p className="text-slate-400">Choose the plan that best fits your risk management needs.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Monthly Plan */}
                  <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 flex flex-col hover:border-slate-500 transition-colors">
                     <div className="mb-4">
                        <h4 className="text-lg font-bold text-slate-300">Monthly</h4>
                        <div className="flex items-baseline gap-1 mt-2">
                           <span className="text-4xl font-extrabold text-white">$15</span>
                           <span className="text-slate-400 text-sm">/month</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Billed monthly. Cancel anytime.</p>
                     </div>
                     <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> All Qualitative Tools</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Basic AI Credits</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Standard Support</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Export to PDF</li>
                     </ul>
                     <button onClick={() => handleSelectPlan('Monthly Plan', 15, 'month')} className="w-full py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-colors">Choose Monthly</button>
                  </div>

                  {/* Quarterly Plan */}
                  <div className="bg-slate-700/50 rounded-xl p-6 border border-emerald-500/50 flex flex-col relative shadow-lg hover:border-emerald-500 transition-colors">
                     <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                     <div className="mb-4">
                        <h4 className="text-lg font-bold text-emerald-400">Quarterly</h4>
                        <div className="flex items-baseline gap-1 mt-2">
                           <span className="text-4xl font-extrabold text-white">$30</span>
                           <span className="text-slate-400 text-sm">/3 months</span>
                        </div>
                        <p className="text-xs text-emerald-400/80 mt-2 font-bold">Save 33% vs Monthly</p>
                     </div>
                     <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Everything in Monthly</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Semi-Quantitative Tools (LOPA)</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Increased AI Token Limit</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/> Priority Email Support</li>
                     </ul>
                     <button onClick={() => handleSelectPlan('Quarterly Plan', 30, '3 months')} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20">Choose Quarterly</button>
                  </div>

                  {/* Yearly Plan */}
                  <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 flex flex-col hover:border-blue-500 transition-colors">
                     <div className="mb-4">
                        <h4 className="text-lg font-bold text-blue-400">Yearly</h4>
                        <div className="flex items-baseline gap-1 mt-2">
                           <span className="text-4xl font-extrabold text-white">$100</span>
                           <span className="text-slate-400 text-sm">/year</span>
                        </div>
                        <p className="text-xs text-blue-400/80 mt-2 font-bold">Best Value (Save ~45%)</p>
                     </div>
                     <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/> Full Platform Access (QRA Included)</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/> Unlimited AI Generation</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/> 24/7 Dedicated Support</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/> Advanced Reporting Features</li>
                     </ul>
                     <button onClick={() => handleSelectPlan('Yearly Plan', 100, 'year')} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">Choose Yearly</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fade-in text-white border border-slate-700 flex flex-col md:flex-row h-auto max-h-[90vh]">
            
            {/* Left Column: Form */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="text-emerald-500"/> Billing Details</h2>
                   <button onClick={closeCheckout} className="md:hidden text-slate-400 hover:text-white"><X size={24}/></button>
                </div>

                {checkoutSubmitted ? (
                   <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-fade-in">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                         <CheckCircle size={48} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Order Received!</h3>
                      <p className="text-slate-400 mb-8 max-w-xs">
                         Thank you, {checkoutForm.fullName}. An invoice has been sent to <strong>{checkoutForm.email}</strong>. Our team will activate your plan shortly.
                      </p>
                      <button onClick={closeCheckout} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">Close</button>
                   </div>
                ) : (
                   <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                      <div>
                         <label className="block text-sm font-bold text-slate-300 mb-1">Full Name</label>
                         <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-500" size={18}/>
                            <input 
                               required 
                               className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500" 
                               placeholder="John Doe"
                               value={checkoutForm.fullName}
                               onChange={e => setCheckoutForm({...checkoutForm, fullName: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">Email Address <span className="text-emerald-500">*</span></label>
                            <div className="relative">
                               <Mail className="absolute left-3 top-3 text-slate-500" size={18}/>
                               <input 
                                  required 
                                  type="email"
                                  className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500" 
                                  placeholder="name@company.com"
                                  value={checkoutForm.email}
                                  onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">WhatsApp Number <span className="text-emerald-500">*</span></label>
                            <div className="relative">
                               <Phone className="absolute left-3 top-3 text-slate-500" size={18}/>
                               <input 
                                  required 
                                  className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500" 
                                  placeholder="+1 234 567 890"
                                  value={checkoutForm.whatsapp}
                                  onChange={e => setCheckoutForm({...checkoutForm, whatsapp: e.target.value})}
                               />
                            </div>
                         </div>
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-slate-300 mb-1">Billing Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-500" size={18}/>
                            <textarea 
                               required 
                               rows={3}
                               className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500 resize-none" 
                               placeholder="Street Address, P.O. Box..."
                               value={checkoutForm.address}
                               onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                         <div>
                            <input 
                               required 
                               className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500" 
                               placeholder="City"
                               value={checkoutForm.city}
                               onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})}
                            />
                         </div>
                         <div>
                            <input 
                               required 
                               className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500" 
                               placeholder="Country"
                               value={checkoutForm.country}
                               onChange={e => setCheckoutForm({...checkoutForm, country: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="pt-4">
                         <button 
                            type="submit" 
                            disabled={isProcessingCheckout}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                            {isProcessingCheckout ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                            {isProcessingCheckout ? 'Processing Order...' : 'Confirm & Request Invoice'}
                         </button>
                         <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
                            <Lock size={10} /> Secure checkout. Invoice sent to email.
                         </p>
                      </div>
                   </form>
                )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full md:w-80 bg-slate-900 p-8 border-t md:border-t-0 md:border-l border-slate-700 flex flex-col relative">
                <button onClick={closeCheckout} className="hidden md:block absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Order Summary</h3>
                
                <div className="flex-grow space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                      <div>
                         <div className="font-bold text-white">{selectedPlan.name}</div>
                         <div className="text-xs text-slate-400">Billed every {selectedPlan.period}</div>
                      </div>
                      <div className="font-mono text-slate-300">${selectedPlan.price.toFixed(2)}</div>
                   </div>
                   
                   <div className="flex justify-between items-center text-sm">
                      <div className="text-slate-400">Subtotal</div>
                      <div className="font-mono text-slate-300">${selectedPlan.price.toFixed(2)}</div>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <div className="text-slate-400">Tax (10%)</div>
                      <div className="font-mono text-slate-300">${calculateTotal().tax.toFixed(2)}</div>
                   </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-700">
                   <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-lg text-white">Total</div>
                      <div className="font-mono text-2xl font-bold text-emerald-400">${calculateTotal().total.toFixed(2)}</div>
                   </div>
                   <div className="text-xs text-slate-500 text-right">USD</div>
                </div>
            </div>

          </div>
        </div>
      )}

      {/* SIGN IN MODAL */}
      {isSignInOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in text-white border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
              <h2 className="text-xl font-bold flex items-center gap-2"><Lock className="text-emerald-500" size={20}/> Sign In</h2>
              <button onClick={() => { setSignInOpen(false); setSignInError(''); }} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleSignIn} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Email</label>
                <input 
                  required 
                  type="email" 
                  className="w-full p-3 bg-slate-900 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-500" 
                  placeholder="name@company.com" 
                  value={signInEmail} 
                  onChange={e => setSignInEmail(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Password</label>
                <input 
                  required 
                  type="password" 
                  className="w-full p-3 bg-slate-900 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-500" 
                  placeholder="••••••" 
                  value={signInPassword} 
                  onChange={e => setSignInPassword(e.target.value)} 
                />
              </div>
              {signInError && <p className="text-red-400 text-xs font-bold text-center bg-red-900/20 p-2 rounded">{signInError}</p>}
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg">Access Dashboard</button>
            </form>
          </div>
        </div>
      )}

      {/* TRIAL REQUEST MODAL */}
      {isTrialOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in text-white border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
              <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400"><Briefcase className="text-emerald-500" size={20}/> Request 7-Day Trial</h2>
              <button onClick={() => { setTrialOpen(false); setTrialSubmitted(false); }} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            
            {trialSubmitted ? (
               <div className="p-10 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4"><CheckCircle size={32}/></div>
                 <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                 <p className="text-slate-400 mb-6">Our admin team will review your details. Once approved, you will receive an authorization email to sign in.</p>
                 <button onClick={() => { setTrialOpen(false); setTrialSubmitted(false); }} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">Close</button>
               </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input required className="w-full pl-10 p-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-400" placeholder="John Doe" value={trialForm.name} onChange={e => setTrialForm({...trialForm, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input required type="email" className="w-full pl-10 p-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-400" placeholder="john@company.com" value={trialForm.email} onChange={e => setTrialForm({...trialForm, email: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Company</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input required className="w-full pl-10 p-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-400" placeholder="Acme Inc." value={trialForm.company} onChange={e => setTrialForm({...trialForm, company: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Job Title</label>
                    <input required className="w-full p-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-400" placeholder="Safety Manager" value={trialForm.role} onChange={e => setTrialForm({...trialForm, role: e.target.value})} />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {isSupportOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in text-white border border-slate-700">
             <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
              <h2 className="text-xl font-bold flex items-center gap-2 text-teal-400"><HelpCircle className="text-teal-500" size={20}/> Contact Support</h2>
              <button onClick={() => setSupportOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-8">
               <p className="text-slate-300 mb-6">
                 Need assistance with a specific module? Reach out to our dedicated support teams directly.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-teal-500/50 transition-colors group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-teal-400">Support</div>
                     <a href="mailto:support@sfl.com.pk" className="text-teal-400 hover:underline font-mono text-sm">support@sfl.com.pk</a>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-emerald-500/50 transition-colors group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-emerald-400">Quantitative Analysis</div>
                     <a href="mailto:Quantitative.Analysis@sfl.com.pk" className="text-emerald-400 hover:underline font-mono text-xs break-all">Quantitative.Analysis@sfl.com.pk</a>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-blue-500/50 transition-colors group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-400">Qualitative Analysis</div>
                     <a href="mailto:Qualitative.Analysis@sfl.com.pk" className="text-blue-400 hover:underline font-mono text-xs break-all">Qualitative.Analysis@sfl.com.pk</a>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-orange-500/50 transition-colors group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-orange-400">Semi-Quantitative Analysis</div>
                     <a href="mailto:Semi-Quantitative.Analysis@sfl.com.pk" className="text-orange-400 hover:underline font-mono text-xs break-all">Semi-Quantitative.Analysis@sfl.com.pk</a>
                  </div>
               </div>
            </div>
            <div className="bg-slate-900 p-4 flex justify-end border-t border-slate-700">
              <button onClick={() => setSupportOpen(false)} className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT US MODAL */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-fade-in text-white border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
              <h2 className="text-xl font-bold flex items-center gap-2">About Us</h2>
              <button onClick={() => setAboutOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh]">
               <div className="flex gap-6">
                 <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0"><Target size={24}/></div>
                 <div>
                   <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
                   <p className="text-slate-400 leading-relaxed">
                     To democratize advanced safety analysis by providing intuitive, AI-powered tools that empower every safety professional, from the shop floor to the boardroom, to proactively identify and mitigate risks.
                   </p>
                 </div>
               </div>
               
               {/* Founder Section */}
               <div className="mt-8 pt-8 border-t border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><User size={20} className="text-emerald-500"/> Meet the Founder</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                       <img 
                         src="./Mubeen Ahsan.jpg" 
                         alt="Mubeen Ahsan" 
                         className="w-32 h-32 rounded-full object-cover border-4 border-slate-600 shadow-xl"
                       />
                       <div className="text-center mt-3">
                         <div className="font-bold text-white">Mubeen Ahsan</div>
                         <div className="text-xs text-emerald-400 font-medium">Founder & CEO</div>
                       </div>
                    </div>
                    <div className="flex-grow space-y-4 text-slate-300 leading-relaxed text-sm">
                       <p>
                         I am a Chemical Engineer and a graduate of the <strong>University of Engineering and Technology (UET), Lahore, Pakistan</strong>, driven by a simple yet powerful belief: safety should never be complicated or out of reach.
                       </p>
                       <p>
                         During my Master’s degree studies, I witnessed the unseen struggle of safety professionals—skilled individuals spending countless hours manually preparing reports, diagrams, and risk assessments. In an age defined by automation and innovation, safety work remained trapped in outdated, labor-intensive processes. This gap did not just waste time; it limited the true potential of safety to protect lives.
                       </p>
                       <p>
                         Motivated by this realization, I introduced the vision of <strong>Safety for All (SfL)</strong>. My mission is to break barriers in safety management by making modern, intelligent safety tools accessible to everyone—from small workplaces to large industries.
                       </p>
                       <p>
                         For me, safety is more than compliance; it is a responsibility, a culture, and a fundamental right. Through Safety for All, I envision a future where technology empowers people, simplifies safety, and ensures that every life is protected—because safety is for all.
                       </p>
                    </div>
                  </div>
               </div>
            </div>
            <div className="bg-slate-900 p-4 flex justify-end border-t border-slate-700">
              <button onClick={() => setAboutOpen(false)} className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* LEARN MORE MODAL */}
      {isLearnMoreOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-fade-in text-white border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900 flex-shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="text-emerald-500" size={20}/> Learn More</h2>
              <button onClick={() => setLearnMoreOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 leading-relaxed text-slate-300 text-base">
               <div>
                 <strong className="text-white block mb-2 text-lg border-b border-slate-600 pb-2">Our Aims</strong>
                 <ul className="space-y-2 list-disc pl-5 marker:text-emerald-500">
                    <li>Reducing time wastage in conventional risk assessment processes</li>
                    <li>Preventing the neglect of small but high-impact hazards</li>
                    <li>Minimizing human error in safety documentation</li>
                    <li>Enabling smarter, faster, and more reliable safety decisions</li>
                 </ul>
               </div>

               <p>
                 <strong className="text-white block mb-1">Evolution of Risk Management</strong>
                 Traditionally, risk management has been confined to static spreadsheets and dense reports that are difficult to interpret and often collect dust on shelves. This approach creates a disconnect between the analyzed risks and the operational reality. Our platform bridges this gap by transforming static data into dynamic, visual models that are easily understood by all stakeholders, ensuring that safety critical information is accessible when and where it's needed most.
               </p>
               <p>
                 <strong className="text-white block mb-1">The Power of BowTie Methodology</strong>
                 At the core of our solution is the BowTie methodology, a powerful visual tool that maps the path from potential causes (threats) to the central hazard and subsequent consequences. By clearly visualizing the "barriers" on both sides of the top event—preventive controls on the left and recovery measures on the right—organizations can instantly identify weaknesses in their defense systems. This clarity is essential for prioritizing maintenance, training, and resource allocation.
               </p>
               <p>
                 <strong className="text-white block mb-1">Integrating Quantitative Analysis</strong>
                 While qualitative models provide the big picture, quantitative data drives precision. Our platform seamlessly integrates Event Tree Analysis (ETA) and Fault Tree Analysis (FTA) with the broader risk framework. This allows safety engineers to not only visualize the "what" and "how" of potential accidents but also calculate the "how likely," enabling data-driven decision-making for complex systems where reliability is paramount.
               </p>
               <p>
                 <strong className="text-white block mb-1">AI-Driven Insights</strong>
                 We leverage cutting-edge Artificial Intelligence to augment human expertise. Our AI assistants help identify potential blind spots by suggesting threats and consequences based on vast databases of industrial incidents. This doesn't replace the safety expert but acts as a tireless co-pilot, reducing cognitive load and helping to ensure that no critical scenario is overlooked in the analysis process. Our Gemini 3 models analyze specific contextual data to generate bespoke diagrams.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* --- AI CHATBOT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Window */}
        {isChatOpen && (
          <div className="mb-4 w-[350px] h-[500px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><MessageSquare size={16}/></div>
                <div>
                  <h3 className="font-bold text-sm">Safety Assistant</h3>
                  <span className="text-xs text-emerald-100 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={18}/></button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto bg-slate-900 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-slate-700 border border-slate-600 text-white rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                   <div className="bg-slate-700 border border-slate-600 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
              <input 
                className="flex-grow bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
        
        {/* Toggle Button */}
        {!isChatOpen && (
           <button 
             onClick={() => setChatOpen(true)} 
             className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95"
           >
             <MessageSquare size={24} />
           </button>
        )}
      </div>

    </div>
  );
};

export default LandingPage;