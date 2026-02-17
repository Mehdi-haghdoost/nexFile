"use client";
import React, { useState, useEffect, useRef } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';

const SignatureProcessingModal = ({ isOpen, progress = 0 }) => {
    const [score, setScore] = useState(0);
    const [ballPosition, setBallPosition] = useState(50);
    const [targetPosition, setTargetPosition] = useState(50);
    const [gameActive, setGameActive] = useState(true);
    const gameRef = useRef(null);

    // Generate new target position
    useEffect(() => {
        if (!isOpen || !gameActive) return;
        
        const interval = setInterval(() => {
            setTargetPosition(Math.random() * 80 + 10);
        }, 1500);

        return () => clearInterval(interval);
    }, [isOpen, gameActive]);

    // Check if ball hits target
    useEffect(() => {
        if (Math.abs(ballPosition - targetPosition) < 8) {
            setScore(prev => prev + 10);
        }
    }, [ballPosition, targetPosition]);

    // Finish game when progress is 100
    useEffect(() => {
        if (progress >= 100) {
            setGameActive(false);
        }
    }, [progress]);

    const handleMouseMove = (e) => {
        if (!gameRef.current || !gameActive) return;
        
        const rect = gameRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setBallPosition(Math.max(5, Math.min(95, percentage)));
    };

    const handleTouchMove = (e) => {
        if (!gameRef.current || !gameActive) return;
        
        const rect = gameRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setBallPosition(Math.max(5, Math.min(95, percentage)));
    };

    const funFacts = [
        "Digital signatures use cryptography to secure documents 🔐",
        "E-signatures became legally valid in the US in 2000 📜",
        "Over 550 million documents are e-signed annually worldwide 🌍",
        "Digital signatures reduce paper usage by 95% 🌱",
        "The first digital signature was created in 1977 💻",
    ];

    const currentFact = funFacts[Math.floor(progress / 20) % funFacts.length];

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={() => {}} 
            width='500px' 
            maxWidth='90vw'
            closeOnClickOutside={false}
        >
            <article className="w-full flex flex-col gap-6 select-none">
                {/* Header */}
                <header className='flex flex-col items-center gap-3'>
                    <div className='relative'>
                        <div className='w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" className='animate-pulse'>
                                <path d="M3 20C7.333 17 10 14 10 11C10 7 8 7 6 7C4 7 2.354 8.758 2.4 11C2.45 13.548 4.658 14.477 5.5 16C7 18 8 19 10 17C11.167 15.5 11.917 14.167 12.5 13C14 17.318 16.333 19 19 19H22M22 19L18 15V2C18 0.897 18.897 0 20 0C21.103 0 22 0.897 22 2V15L22 19ZM18 5H22" 
                                    stroke="#4C3CC6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    className='dark:stroke-white'
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className='text-lg font-semibold text-neutral-500 dark:text-white'>
                        Applying Signature...
                    </h1>
                </header>

                {/* Progress Bar */}
                <div className='flex flex-col gap-2'>
                    <div className='relative w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden'>
                        <div 
                            className='absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out'
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm font-medium text-primary-500'>
                            {progress}%
                        </span>
                        <span className='text-sm font-medium text-green-500'>
                            Score: {score} 🎯
                        </span>
                    </div>
                </div>

                {/* Mini Game */}
                {gameActive ? (
                    <div className='flex flex-col gap-3'>
                        <div className='text-center'>
                            <h3 className='text-sm font-semibold text-neutral-600 dark:text-white mb-1'>
                                Quick Game! 🎮
                            </h3>
                            <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                                Move your mouse/finger to catch the target!
                            </p>
                        </div>

                        <div 
                            ref={gameRef}
                            onMouseMove={handleMouseMove}
                            onTouchMove={handleTouchMove}
                            className='relative w-full h-32 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl border-2 border-blue-200 dark:border-neutral-600 cursor-pointer overflow-hidden'
                        >
                            {/* Target */}
                            <div 
                                className='absolute top-4 w-12 h-12 rounded-full bg-red-400 border-4 border-white shadow-lg transition-all duration-300 flex items-center justify-center text-xl'
                                style={{ left: `calc(${targetPosition}% - 24px)` }}
                            >
                                🎯
                            </div>

                            {/* Ball (Player) */}
                            <div 
                                className='absolute bottom-4 w-10 h-10 rounded-full bg-primary-500 border-4 border-white shadow-lg flex items-center justify-center text-lg transition-all duration-100'
                                style={{ left: `calc(${ballPosition}% - 20px)` }}
                            >
                                ⚽
                            </div>

                            {/* Ground Line */}
                            <div className='absolute bottom-0 left-0 right-0 h-1 bg-green-500' />
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-3 py-4'>
                        <div className='text-6xl animate-bounce'>🎉</div>
                        <div className='text-center'>
                            <h3 className='text-lg font-semibold text-green-600 dark:text-green-400 mb-1'>
                                Great Job!
                            </h3>
                            <p className='text-sm text-neutral-400 dark:text-neutral-300'>
                                Final Score: {score} points!
                            </p>
                        </div>
                    </div>
                )}

                {/* Fun Fact */}
                <div className='flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                    <span className='text-xl shrink-0'>💡</span>
                    <div className='flex-1'>
                        <p className='text-xs font-medium text-blue-900 dark:text-blue-300 mb-1'>
                            Did you know?
                        </p>
                        <p className='text-xs text-blue-700 dark:text-blue-400'>
                            {currentFact}
                        </p>
                    </div>
                </div>
            </article>
        </BaseModal>
    );
};

export default SignatureProcessingModal;