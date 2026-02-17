"use client";
import React, { useEffect, useRef } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { animate, createScope, stagger } from 'animejs';

const SignatureProcessingModal = ({ isOpen, progress = 0, currentStep = '' }) => {
    const root = useRef(null);
    const scope = useRef(null);

    useEffect(() => {
        if (!isOpen || !root.current) return;

        scope.current = createScope({ root }).add(() => {
            animate('.dot', {
                y: {
                    to: [0, -14, 0],
                    ease: 'inOut(2)',
                    duration: 1000,
                },
                scale: {
                    to: [1, 1.2, 1],
                    ease: 'inOut(2)',
                    duration: 1000,
                },
                delay: stagger(180),
                loop: true,
                loopDelay: 400,
            });
        });

        return () => {
            if (scope.current) scope.current.revert();
        };
    }, [isOpen]);

    const steps = [
        { label: 'Loading PDF', icon: '📄', threshold: 20 },
        { label: 'Applying signature', icon: '✍️', threshold: 60 },
        { label: 'Uploading & Finalizing', icon: '☁️', threshold: 100 },
    ];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => {}}
            width='400px'
            maxWidth='90vw'
            closeOnClickOutside={false}
        >
            <article ref={root} className="w-full flex flex-col gap-4 select-none py-1">

                {/* Dots Animation */}
                <div className='flex flex-col items-center gap-3'>
                    <div className='flex items-center gap-2.5'>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className='dot w-3 h-3 rounded-full bg-primary-500'
                                style={{ opacity: 0.3 + (i * 0.17) }}
                            />
                        ))}
                    </div>
                    <div className='flex flex-col items-center gap-0.5'>
                        <h1 className='text-sm font-semibold text-neutral-500 dark:text-white'>
                            Applying Signature...
                        </h1>
                        <p className='text-xs text-neutral-400 dark:text-neutral-300 h-4'>
                            {currentStep}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className='flex flex-col gap-1'>
                    <div className='relative w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden'>
                        <div
                            className='absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out'
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className='text-xs font-medium text-primary-500 text-right'>
                        {progress}%
                    </span>
                </div>

                {/* Steps - فقط ۳ تا */}
                <div className='flex flex-col gap-1.5'>
                    {steps.map((step, index) => {
                        const isCompleted = progress >= step.threshold;
                        const isActive = progress >= (steps[index - 1]?.threshold ?? 0) && progress < step.threshold;

                        return (
                            <div
                                key={step.label}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20'
                                        : isCompleted
                                        ? 'opacity-50'
                                        : 'opacity-25'
                                }`}
                            >
                                <span className='text-sm w-4 text-center'>
                                    {isCompleted ? '✅' : step.icon}
                                </span>
                                <span className={`text-xs ${
                                    isActive
                                        ? 'font-medium text-primary-600 dark:text-primary-400'
                                        : isCompleted
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-neutral-400 dark:text-neutral-500'
                                }`}>
                                    {step.label}
                                </span>
                                {isActive && (
                                    <div className='ml-auto flex gap-1'>
                                        <div className='w-1 h-1 rounded-full bg-primary-500 animate-bounce' style={{ animationDelay: '0ms' }} />
                                        <div className='w-1 h-1 rounded-full bg-primary-500 animate-bounce' style={{ animationDelay: '150ms' }} />
                                        <div className='w-1 h-1 rounded-full bg-primary-500 animate-bounce' style={{ animationDelay: '300ms' }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </article>
        </BaseModal>
    );
};

export default SignatureProcessingModal;