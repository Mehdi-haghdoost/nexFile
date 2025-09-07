'use client';
import React from 'react';
import styles from '@/styles/pdf-editor/pdf-editor.module.css';

const PageThumbnail = ({ pageNumber, isSelected, hasContent, onClick }) => {
    const handleClick = () => {
        onClick(pageNumber);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(pageNumber);
        }
    };

    return (
        <article className='flex flex-col items-center gap-2'>
            <div
                className={`flex flex-col items-center gap-[1.882px] w-[112px] h-[158.494px] p-[11.294px] rounded border-[1.5px] bg-white overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                        ? 'border-primary-500 shadow-sm'
                        : 'border-stroke-500 hover:border-primary-300'
                }`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Page ${pageNumber} thumbnail`}
                aria-pressed={isSelected}
            >
                {hasContent ? (
                    <PageContent />
                ) : (
                    <EmptyPageContent />
                )}
            </div>
            
            <span className='text-medium-14 select-none'>{pageNumber}</span>
        </article>
    );
};

const PageContent = () => (
    <div className='flex flex-col items-start gap-[4.518px] self-stretch'>
        <div className='flex flex-col items-start gap-[2.259px] self-stretch'>
            <header className='flex items-center gap-2 self-stretch'>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
                <h3 className='text-neutral-500 font-inter text-[3.765px] font-semibold leading-[150%] tracking-[-0.075px]'>
                    Ugly websites sell better.
                </h3>
                <div className="flex-1 h-px bg-gradient-to-l from-gray-600 to-transparent" />
            </header>
            
            <p className='text-neutral-500 font-inter text-[2.259px] font-normal leading-normal tracking-[-0.023px]'>
                I've been in the web design business since 1998. It has gone through some phases, but the place its at right now feels the weirdest in a long time.

                For years UX designers battled the "dribbblization" of the industry. What it means, is creating eye-candy projects and posing them as serious work.

                Beautiful at first glance, but either impossible to code, or completely dysfunctional.
            </p>
        </div>

        <div className='flex flex-col items-start gap-[2.259px] self-stretch'>
            <h4 className='text-neutral-500 font-inter text-[3.012px] font-semibold leading-[150%] tracking-[-0.06px]'>
                Understanding design
            </h4>
            <p className='text-neutral-500 font-inter text-[2.259px] font-normal leading-normal tracking-[-0.023px]'>
                Let's take a step back.
            </p>
            <p className='text-neutral-500 font-inter text-[2.259px] font-normal leading-normal tracking-[-0.023px]'>
                What is the role of a website? 99% of the time it's to sell something. To get you to click a button.
            </p>
            
            <div className={styles.navbar_img} />
            
            <p className='text-neutral-500 font-inter text-[2.259px] font-normal leading-normal tracking-[-0.023px]'>
                Beautiful background with mountains and a person gazing into the distance doesn't sell. Sure, it tickles your sense of aesthetics. I'll give you that.

                But on its own that's only a piece of artwork. Nothing more.
            </p>
        </div>
        
        <div className={styles.navbar_img_second} />
    </div>
);

const EmptyPageContent = () => (
    <div className='flex items-center justify-center w-full h-full'>
        <span className='text-regular-12-neutral-300 text-center'>
            Empty Page
        </span>
    </div>
);

export default PageThumbnail;