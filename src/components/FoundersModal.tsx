import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X } from 'lucide-react';

interface FoundersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FoundersModal({ isOpen, onClose }: FoundersModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-5xl bg-zinc-900 md:border border-white/10 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Founders</h2>
                  <p className="text-xs text-zinc-400">The team behind GOCOSMIC</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-10 space-y-10 overflow-y-scroll custom-scrollbar flex-1">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  Captains
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      name: 'Prajwal C. Ingalalli', 
                      role: 'Lead Architect & Visionary', 
                      desc: 'Prajwal is the driving force behind the core AI infrastructure and the overarching platform architecture of GOCOSMIC. With a profound understanding of distributed systems and machine learning, he conceptualized the foundational models that power our intelligent features. His visionary approach has consistently pushed the boundaries of what is possible, ensuring our technology stack remains scalable, secure, and cutting-edge. Beyond coding, Prajwal orchestrates the technical roadmap, aligning complex engineering challenges with our long-term strategic goals. He has a unique ability to foresee technological shifts and adapt our architecture preemptively. His leadership fosters a culture of relentless innovation and technical excellence within the team. Every major architectural decision bears his signature, reflecting a perfect balance of performance and reliability.' 
                    },
                    { 
                      name: 'Dhruva Shetty', 
                      role: 'Head of Product', 
                      desc: 'Dhruva is the mastermind behind the seamless user experience and the strategic product roadmap of GOCOSMIC. He possesses an exceptional empathy for user needs, translating complex technical capabilities into intuitive, accessible features. His meticulous attention to detail ensures that every interaction within the platform feels natural and empowering. Dhruva bridges the gap between engineering and design, orchestrating product launches that consistently exceed user expectations. He conducts extensive market research, analyzing trends to keep GOCOSMIC ahead of the curve. His leadership in product strategy has been instrumental in defining our unique value proposition. By championing a user-centric design philosophy, Dhruva ensures that our powerful AI tools are democratized for everyone.' 
                    },
                    { 
                      name: 'Atharva Millanatti', 
                      role: 'Lead Engineer', 
                      desc: 'Atharva is the engineering powerhouse responsible for building GOCOSMIC\'s real-time execution engines and complex third-party integrations. His expertise in high-performance computing and algorithmic optimization ensures that our AI models respond with lightning speed. He tackles the most daunting technical challenges head-on, architecting solutions that are both elegant and highly efficient. Atharva\'s deep knowledge of backend systems allows him to seamlessly weave together disparate technologies into a unified, cohesive platform. He is a relentless problem solver, often debugging the most obscure issues to maintain flawless system uptime. His commitment to code quality and rigorous testing sets the gold standard for the entire engineering team. Atharva mentors junior developers, sharing his vast knowledge and fostering a collaborative engineering environment.' 
                    }
                  ].map((founder) => (
                    <li key={founder.name} className="flex flex-col gap-4 text-zinc-200 bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-lg font-bold shrink-0 border border-indigo-500/30">
                          {founder.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-lg block">{founder.name}</span>
                          <span className="text-sm text-indigo-300 font-medium">{founder.role}</span>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-400 leading-relaxed text-justify">
                        {founder.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  Vice Captains
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { 
                      name: 'Sampreeth Shetty', 
                      role: 'Frontend Developer', 
                      desc: 'Sampreeth is the creative genius who crafted the beautiful, responsive user interfaces and fluid animations of GOCOSMIC. His keen eye for aesthetics and mastery of modern web technologies bring the platform to life. He ensures that every pixel is perfectly placed, creating an immersive and engaging experience across all devices. Sampreeth\'s dedication to frontend performance guarantees that the application feels incredibly fast and smooth.' 
                    },
                    { 
                      name: 'Preetam Patil', 
                      role: 'Backend Engineer', 
                      desc: 'Preetam is the backbone of our server infrastructure, optimizing performance and designing our robust database architecture. He ensures that data flows securely and efficiently, handling massive volumes of requests with ease. His expertise in cloud technologies and microservices allows GOCOSMIC to scale dynamically based on user demand. Preetam is constantly monitoring system health, implementing optimizations that reduce latency.' 
                    },
                    { 
                      name: 'Sankalph Dindalkoppa', 
                      role: 'AI Researcher', 
                      desc: 'Sankalph is the brilliant mind dedicated to fine-tuning our language models and advancing our vision capabilities. He dives deep into the latest AI research, implementing cutting-edge algorithms to improve accuracy and contextual understanding. His rigorous testing and training methodologies ensure that GOCOSMIC\'s AI remains state-of-the-art. Sankalph\'s innovative approaches to machine learning have significantly reduced hallucination rates.' 
                    },
                    { 
                      name: 'Vikas Gouda', 
                      role: 'Systems Engineer', 
                      desc: 'Vikas is the guardian of our platform\'s stability, security, and automated deployment pipelines. He architects the robust CI/CD workflows that allow us to ship features rapidly without compromising quality. His vigilant approach to cybersecurity ensures that user data is protected against all emerging threats. Vikas manages our cloud infrastructure, optimizing resource allocation and maintaining near-perfect uptime.' 
                    }
                  ].map((founder) => (
                    <li key={founder.name} className="flex flex-col gap-4 text-zinc-200 bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-lg font-bold shrink-0 border border-emerald-500/30">
                          {founder.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-lg block">{founder.name}</span>
                          <span className="text-sm text-emerald-300 font-medium">{founder.role}</span>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-400 leading-relaxed text-justify">
                        {founder.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  Junior Captains
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'Aryan',
                      role: 'Junior Frontend Developer',
                      desc: 'Aryan assists in building responsive UI components and ensuring cross-browser compatibility across the GOCOSMIC platform, focusing on pixel-perfect implementations.'
                    },
                    {
                      name: 'Rajath R',
                      role: 'Junior Backend Developer',
                      desc: 'Rajath helps optimize server-side logic and manage database queries to ensure smooth and secure data flow for GOCOSMIC applications.'
                    },
                    {
                      name: 'Manit',
                      role: 'Junior AI Researcher',
                      desc: 'Manit supports the fine-tuning of GOCOSMIC\'s AI models, gathering high-quality datasets and rigorously testing model responses.'
                    },
                    {
                      name: 'Chandan Bangari',
                      role: 'Junior UX Designer',
                      desc: 'Chandan crafts wireframes, conducts user testing, and assists in shaping the aesthetic and usable interfaces of the platform.'
                    },
                    {
                      name: 'Gagan',
                      role: 'Junior DevOps Engineer',
                      desc: 'Gagan ensures our deployment pipelines are reliable, monitors system health, and helps structure our cloud environments for scalability.'
                    }
                  ].map((captain) => (
                    <li key={captain.name} className="flex flex-col gap-4 text-zinc-200 bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xl shrink-0 border border-cyan-500/30">
                          {captain.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-bold text-lg">{captain.name}</span>
                          <span className="text-cyan-400 text-sm font-medium">{captain.role}</span>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {captain.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
