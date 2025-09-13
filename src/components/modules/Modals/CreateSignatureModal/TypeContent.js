import React, { useState } from 'react';
import { signatureFonts, getFontById, getFontCategories } from '@/components/ui/signatureFonts';

const TypeContent = () => {
    const [signatureText, setSignatureText] = useState('');
    const [selectedFont, setSelectedFont] = useState('dancing-script');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...getFontCategories()];
    
    const getFilteredFonts = () => {
        if (selectedCategory === 'All') {
            return signatureFonts;
        }
        return signatureFonts.filter(font => font.category === selectedCategory);
    };

    const getCurrentFont = () => {
        return getFontById(selectedFont);
    };

    return (
        <article className='flex flex-col items-start gap-6 self-stretch'>
            <header className='flex flex-col items-center gap-4 self-stretch'>
                <figure className='flex w-18 h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-white/70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 7V4C4 3.45 4.45 3 5 3H19C19.55 3 20 3.45 20 4V7M9 20H15M12 3V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <section className='flex flex-col items-center gap-1'>
                    <h2 className='text-medium-16 text-neutral-500'>Type Your Signature</h2>
                    <p className='text-regular-12 text-neutral-300 text-center'>
                        Enter your signature text and choose a font style
                    </p>
                </section>
            </header>

            <main className='flex flex-col items-start gap-4 self-stretch'>
                <form className='contents' onSubmit={(e) => e.preventDefault()}>
                    <fieldset className='flex flex-col items-start gap-2 self-stretch border-0 p-0 m-0'>
                        <legend className='sr-only'>Signature Text Configuration</legend>
                        <label htmlFor="signatureText" className='text-medium-14 text-neutral-500'>
                            Signature Text
                        </label>
                        <input
                            id="signatureText"
                            type="text"
                            value={signatureText}
                            onChange={(e) => setSignatureText(e.target.value)}
                            placeholder="Enter your signature text"
                            className='flex h-12 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 bg-white text-regular-16 focus:outline-none focus:border-primary-500'
                        />
                    </fieldset>

                    {/* Font Category Filter */}
                    <fieldset className='flex flex-col items-start gap-2 self-stretch border-0 p-0 m-0'>
                        <legend className='sr-only'>Font Category Selection</legend>
                        <label htmlFor="fontCategory" className='text-medium-14 text-neutral-500'>
                            Font Category
                        </label>
                        <select 
                            id="fontCategory"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className='flex h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 bg-white text-regular-14 focus:outline-none focus:border-primary-500'
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    {/* Font Style Selection */}
                    <fieldset className='flex flex-col items-start gap-2 self-stretch border-0 p-0 m-0'>
                        <legend className='sr-only'>Font Style Selection</legend>
                        <label htmlFor="fontStyle" className='text-medium-14 text-neutral-500'>
                            Font Style
                        </label>
                        <select 
                            id="fontStyle"
                            value={selectedFont}
                            onChange={(e) => setSelectedFont(e.target.value)}
                            className='flex h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 bg-white text-regular-14 focus:outline-none focus:border-primary-500'
                        >
                            {getFilteredFonts().map((font) => (
                                <option key={font.id} value={font.id}>
                                    {font.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    {/* Font Preview Grid */}
                    <section className='flex flex-col items-start gap-2 self-stretch'>
                        <h3 className='text-medium-14 text-neutral-500'>
                            Font Previews
                        </h3>
                        <div className='grid grid-cols-2 gap-2 w-full max-h-32 overflow-y-auto'>
                            {getFilteredFonts().map((font) => (
                                <button
                                    key={font.id}
                                    type="button"
                                    onClick={() => setSelectedFont(font.id)}
                                    className={`flex items-center justify-center p-2 rounded-lg border transition-all ${
                                        selectedFont === font.id
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-stroke-200 bg-white hover:bg-gray-50'
                                    }`}
                                    title={font.description}
                                >
                                    <span className={`${font.className} text-lg`}>
                                        {signatureText || font.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Main Signature Preview */}
                    <section className='flex flex-col items-start gap-2 self-stretch'>
                        <h3 className='text-medium-14 text-neutral-500'>
                            Preview
                        </h3>
                        <figure className='flex items-center justify-center w-full h-24 border border-stroke-200 rounded-lg bg-gray-50'>
                            {signatureText ? (
                                <output 
                                    className={`text-4xl ${getCurrentFont()?.className || ''}`}
                                    aria-live="polite"
                                >
                                    {signatureText}
                                </output>
                            ) : (
                                <figcaption className='text-regular-14 text-neutral-400'>Your signature will appear here</figcaption>
                            )}
                        </figure>
                        {getCurrentFont() && (
                            <aside className='text-regular-12 text-neutral-400 self-center'>
                                Font: {getCurrentFont().name} • Category: {getCurrentFont().category}
                            </aside>
                        )}
                    </section>
                </form>
            </main>
        </article>
    );
};

export default TypeContent;