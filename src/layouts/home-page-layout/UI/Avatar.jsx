import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../../../assets/images/avatar.png";
import useMbStore from "../../../store/mb-store";

const Avatar = () => {
    const increment = useMbStore((state) => state.increment);
    const mbIncrement = useMbStore((state) => state.mbIncrement);
    const [popups, setPopups] = useState([]);

    const handleClick = (e) => {
        increment();
        
        const container = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - container.left;
        const y = e.clientY - container.top;

        const newPopup = {
            id: Date.now(),
            x,
            y,
            text: `+ ${mbIncrement}`,

            xVariation: (Math.random() - 0.5) * 40,
            scale: 0.8 + Math.random() * 0.4
        };

        setPopups((current) => [...current, newPopup]);

        setTimeout(() => {
            setPopups((current) => current.filter(popup => popup.id !== newPopup.id));
        }, 1200);
    };

    return (
        <div 
            className="avatar-container" 
            onClick={handleClick}
            style={{ 
                position: 'relative', 
                display: 'inline-block',
                cursor: 'pointer',
                overflow: 'visible',
                zIndex: 0
            }}
        >
            <img 
                src={avatar} 
                alt="Avatar" 
                style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    userSelect: 'none'
                }} 
            />
            
            <AnimatePresence>
                {popups.map((popup) => (
                    <motion.div
                        key={popup.id}
                        initial={{ 
                            opacity: 1,
                            y: 0,
                            x: popup.x,
                            rotate: 0,
                            scale: popup.scale,
                            position: 'absolute',
                            pointerEvents: 'none',
                            left: 0,
                            top: 0,
                            zIndex: 10
                        }}
                        animate={{ 
                            opacity: [1, 0.8, 0],
                            y: -60,
                            x: popup.x + popup.xVariation,
                            rotate: popup.rotation,
                        }}
                        transition={{ 
                            duration: 1.2,
                            ease: [0.2, 0.8, 0.4, 1]
                        }}
                        style={{
                            color: '#ffffff',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            transformOrigin: 'center center'
                        }}
                    >
                        {popup.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Avatar;