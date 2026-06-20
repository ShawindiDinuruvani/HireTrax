import { motion, useScroll, useTransform } from 'framer-motion';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden font-sans">
      
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-between px-20">
        
        {/* Text Section */}
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <h1 className="text-8xl font-bold tracking-tighter leading-none">
            Effortless<br />
            <span className="text-[#2DD4BF]">Tax integration</span><br />
            for business
          </h1>
        </motion.div>

        {/* 3D Orb replacement (This moves with mouse if you want) */}
        <motion.div 
          style={{ scale }}
          className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#2DD4BF] to-black opacity-80 blur-3xl"
        />
      </div>

      {/* Services Section */}
      <div className="py-20 px-20">
        <h2 className="text-4xl text-[#2DD4BF] mb-10">Our Services</h2>
        <div className="grid grid-cols-3 gap-10">
          {[1,2,3].map((i) => (
            <motion.div 
              whileHover={{ y: -20 }}
              className="h-64 bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md"
            >
              <h3 className="text-2xl mb-4">Service {i}</h3>
              <p className="text-gray-400">Detailed description about our professional tax services.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}