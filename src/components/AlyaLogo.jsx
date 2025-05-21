import React from 'react';
    import { motion } from 'framer-motion';

    const AlyaLogo = ({ className = "h-10 w-auto text-primary", animated = false, iconOnly = false }) => {
      const svgVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: animated ? 0.2 : 0,
          }
        }
      };

      const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
          pathLength: 1,
          opacity: 1,
          transition: {
            duration: animated ? 1.2 : 0,
            ease: "easeInOut",
          }
        }
      };
      
      const pulseVariants = {
        initial: { scale: 0.9, opacity: 0.7 },
        animate: { 
            scale: [0.9, 1.05, 0.9], 
            opacity: [0.7, 1, 0.7],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: animated ? 1 : 0 }
        }
      };

      const orbitVariants = (radius, duration, delay = 0) => ({
        initial: { x: 0, y: 0 },
        animate: {
          x: [0, radius, 0, -radius, 0],
          y: [radius, 0, -radius, 0, radius],
          transition: {
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: animated ? delay : 0
          }
        }
      });
      
      if (iconOnly) {
         return (
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64" 
                className={className}
                variants={svgVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.circle 
                    cx="32" cy="32" r="12" 
                    fill="currentColor" 
                    variants={pulseVariants} 
                    initial="initial" 
                    animate="animate"
                />
                <motion.circle 
                    cx="32" cy="32" r="4" 
                    fill="hsl(var(--background))" 
                    variants={orbitVariants(10, 5, 0.5)} 
                    initial="initial" 
                    animate="animate"
                />
                 <motion.circle 
                    cx="32" cy="32" r="3" 
                    fill="hsl(var(--background))" 
                    variants={orbitVariants(18, 7, 1)} 
                    initial="initial" 
                    animate="animate"
                />
                <motion.path 
                    d="M32 5 V15 M32 59 V49 M5 32 H15 M59 32 H49"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    variants={pathVariants}
                />
                <motion.path 
                    d="M15 15 L22 22 M49 49 L42 42 M15 49 L22 42 M49 15 L42 22"
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                    opacity="0.6"
                    variants={pathVariants}
                />
            </motion.svg>
        );
      }


      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 40"
          className={className}
          variants={svgVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.circle 
              cx="20" cy="20" r="15" 
              stroke="currentColor" strokeWidth="3" fill="none" 
              variants={animated ? pathVariants : undefined}
          />
          <motion.path 
              d="M13 27 L20 13 L27 27" 
              stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
              variants={animated ? pathVariants : undefined}
          />
           <motion.circle cx="20" cy="19" r="2" fill="currentColor" variants={animated ? pathVariants : undefined}/>

          <motion.path 
              d="M38 27 L38 13" 
              stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"
              variants={animated ? pathVariants : undefined}
          />
           <motion.circle cx="38" cy="9" r="2" fill="currentColor" variants={animated ? pathVariants : undefined}/>
          
          <motion.text x="55" y="27" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="currentColor" variants={animated ? pathVariants : undefined}>
            LYA
          </motion.text>
        </motion.svg>
      );
    };

    export default AlyaLogo;