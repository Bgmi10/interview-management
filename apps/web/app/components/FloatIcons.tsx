import { motion } from "framer-motion";

const FloatIcons = () => {
  return (
 <div>   
  <motion.div className="flex justify-between">
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TypeScript"
      role="img"
      viewBox="0 0 512 512"
      className="lg:block lg:size-12 sm: size-6 absolute lg:top-[95px] sm: top-[70px] lg:right-[355px] sm: right-16 drop-shadow-[0_16px_24px_rgba(49,120,198,0.35)]"
      animate={{
        y: [0, -5, 0]
     }}
      transition={{
        duration: 2,  
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{ zIndex: 10, filter: `drop-shadow(0 0 7px rgba(0, 123, 255, 0.9))` }}
    >
      <rect width="512" height="512" rx="15%" fill="#3178c6"></rect>
      <path
        fill="#ffffff"
        d="m233 284h64v-41H118v41h64v183h51zm84 173c8.1 4.2 18 7.3 29 9.4s23 3.1 35 3.1c12 0 23-1.1 34-3.4c11-2.3 20-6.1 28-11c8.1-5.3 15-12 19-21s7.1-19 7.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9c-5.2-2.6-9.7-5.2-13-7.8c-3.7-2.7-6.5-5.5-8.5-8.4c-2-3-3-6.3-3-10c0-3.4.89-6.5 2.7-9.3s4.3-5.1 7.5-7.1c3.2-2 7.2-3.5 12-4.6c4.7-1.1 9.9-1.6 16-1.6c4.2 0 8.6.31 13 .94c4.6.63 9.3 1.6 14 2.9c4.7 1.3 9.3 2.9 14 4.9c4.4 2 8.5 4.3 12 6.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12 0-23 1.3-34 3.8s-20 6.5-28 12c-8.1 5.4-14 12-19 21c-4.7 8.4-7 18-7 30c0 15 4.3 28 13 38c8.6 11 22 19 39 27c6.9 2.8 13 5.6 19 8.3s11 5.5 15 8.4c4.3 2.9 7.7 6.1 10 9.5c2.5 3.4 3.8 7.4 3.8 12c0 3.2-.78 6.2-2.3 9s-3.9 5.2-7.1 7.2s-7.1 3.6-12 4.8c-4.7 1.1-10 1.7-17 1.7c-11 0-22-1.9-32-5.7c-11-3.8-21-9.5-28.1-15.44z"
      ></path>
    </motion.svg>
    <motion.img
      src="https://turbo.build/images/docs/repo/repo-hero-logo-dark.svg"
      aria-label="TypeScript"
      alt="as"
      role="img"
      className="lg:block lg:size-12 sm: size-6 absolute lg:top-[152px] lg:left-[150px] sm: left-10 sm: top-80 drop-shadow-[0_16px_24px_rgba(49,120,198,0.35)]"
      animate={{
        y: [0, -5, 0]
     }}
     dangerouslySetInnerHTML={undefined}
      transition={{
        duration: 2,  
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{
        zIndex: 10,
        filter: `drop-shadow(0 0 7px rgba(0, 123, 255, 0.9)) drop-shadow(0 0 14px rgba(255, 0, 0, 0.7))`
      }}
      
   />
      <rect width="512" height="512" rx="15%" fill="#3178c6"></rect>
      <path
        fill="#ffffff"
        d="m233 284h64v-41H118v41h64v183h51zm84 173c8.1 4.2 18 7.3 29 9.4s23 3.1 35 3.1c12 0 23-1.1 34-3.4c11-2.3 20-6.1 28-11c8.1-5.3 15-12 19-21s7.1-19 7.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9c-5.2-2.6-9.7-5.2-13-7.8c-3.7-2.7-6.5-5.5-8.5-8.4c-2-3-3-6.3-3-10c0-3.4.89-6.5 2.7-9.3s4.3-5.1 7.5-7.1c3.2-2 7.2-3.5 12-4.6c4.7-1.1 9.9-1.6 16-1.6c4.2 0 8.6.31 13 .94c4.6.63 9.3 1.6 14 2.9c4.7 1.3 9.3 2.9 14 4.9c4.4 2 8.5 4.3 12 6.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12 0-23 1.3-34 3.8s-20 6.5-28 12c-8.1 5.4-14 12-19 21c-4.7 8.4-7 18-7 30c0 15 4.3 28 13 38c8.6 11 22 19 39 27c6.9 2.8 13 5.6 19 8.3s11 5.5 15 8.4c4.3 2.9 7.7 6.1 10 9.5c2.5 3.4 3.8 7.4 3.8 12c0 3.2-.78 6.2-2.3 9s-3.9 5.2-7.1 7.2s-7.1 3.6-12 4.8c-4.7 1.1-10 1.7-17 1.7c-11 0-22-1.9-32-5.7c-11-3.8-21-9.5-28.1-15.44z"
      ></path>
   
    </motion.div>  
    <motion.img
      src="https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca"
      aria-label="TypeScript"
      role="img"
      className="lg:block lg:size-12 sm: size-6 absolute rounded-md lg:top-[582px] lg:right-[355px] sm: top-[300px] sm: right-10 drop-shadow-[0_16px_24px_rgba(49,120,198,0.35)]"
      animate={{
        y: [0, -5, 0]
     }}
      transition={{
        duration: 2,  
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{
        zIndex: 10,
        filter: `
          drop-shadow(0 0 7px rgba(255, 165, 0, 0.5))  /* Lighter orange shadow */
          drop-shadow(0 0 10px rgba(245, 255, 25, 0.5)) /* Lighter yellow glow */
        `
      }}
    />
      <rect width="512" height="512" rx="15%" fill="#3178c6"></rect>
      <path
        fill="#ffffff"
        d="m233 284h64v-41H118v41h64v183h51zm84 173c8.1 4.2 18 7.3 29 9.4s23 3.1 35 3.1c12 0 23-1.1 34-3.4c11-2.3 20-6.1 28-11c8.1-5.3 15-12 19-21s7.1-19 7.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9c-5.2-2.6-9.7-5.2-13-7.8c-3.7-2.7-6.5-5.5-8.5-8.4c-2-3-3-6.3-3-10c0-3.4.89-6.5 2.7-9.3s4.3-5.1 7.5-7.1c3.2-2 7.2-3.5 12-4.6c4.7-1.1 9.9-1.6 16-1.6c4.2 0 8.6.31 13 .94c4.6.63 9.3 1.6 14 2.9c4.7 1.3 9.3 2.9 14 4.9c4.4 2 8.5 4.3 12 6.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12 0-23 1.3-34 3.8s-20 6.5-28 12c-8.1 5.4-14 12-19 21c-4.7 8.4-7 18-7 30c0 15 4.3 28 13 38c8.6 11 22 19 39 27c6.9 2.8 13 5.6 19 8.3s11 5.5 15 8.4c4.3 2.9 7.7 6.1 10 9.5c2.5 3.4 3.8 7.4 3.8 12c0 3.2-.78 6.2-2.3 9s-3.9 5.2-7.1 7.2s-7.1 3.6-12 4.8c-4.7 1.1-10 1.7-17 1.7c-11 0-22-1.9-32-5.7c-11-3.8-21-9.5-28.1-15.44z"
      ></path>
    
    <motion.img
     src="https://turbo.build/images/docs/pack/turbopack-hero-logo-dark.svg"
      aria-label="TypeScript"
      role="img"
      className="lg:block lg:size-12 sm: size-6 sm: top-35 absolute lg:top-[452px] lg:left-[150px] sm:left-20 drop-shadow-[0_16px_24px_rgba(49,120,198,0.35)]"
      animate={{
        y: [0, -5, 0]
     }}
      transition={{
        duration: 2,  
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{
        zIndex: 10,
        filter: `drop-shadow(0 0 7px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 10px rgba(0, 123, 255, 0.6))`
      }}
      
      
    />
      <rect width="512" height="512" rx="15%" fill="#3178c6"></rect>
      <path
        fill="#ffffff"
        d="m233 284h64v-41H118v41h64v183h51zm84 173c8.1 4.2 18 7.3 29 9.4s23 3.1 35 3.1c12 0 23-1.1 34-3.4c11-2.3 20-6.1 28-11c8.1-5.3 15-12 19-21s7.1-19 7.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9c-5.2-2.6-9.7-5.2-13-7.8c-3.7-2.7-6.5-5.5-8.5-8.4c-2-3-3-6.3-3-10c0-3.4.89-6.5 2.7-9.3s4.3-5.1 7.5-7.1c3.2-2 7.2-3.5 12-4.6c4.7-1.1 9.9-1.6 16-1.6c4.2 0 8.6.31 13 .94c4.6.63 9.3 1.6 14 2.9c4.7 1.3 9.3 2.9 14 4.9c4.4 2 8.5 4.3 12 6.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12 0-23 1.3-34 3.8s-20 6.5-28 12c-8.1 5.4-14 12-19 21c-4.7 8.4-7 18-7 30c0 15 4.3 28 13 38c8.6 11 22 19 39 27c6.9 2.8 13 5.6 19 8.3s11 5.5 15 8.4c4.3 2.9 7.7 6.1 10 9.5c2.5 3.4 3.8 7.4 3.8 12c0 3.2-.78 6.2-2.3 9s-3.9 5.2-7.1 7.2s-7.1 3.6-12 4.8c-4.7 1.1-10 1.7-17 1.7c-11 0-22-1.9-32-5.7c-11-3.8-21-9.5-28.1-15.44z"
      ></path>
    
  
    </div>
  );
};

export default FloatIcons;
