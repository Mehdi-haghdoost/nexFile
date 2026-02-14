// import React, { useState } from 'react';
// import { signatureFonts, getFontById, getFontCategories } from '@/components/ui/signatureFonts';

// const TypeContent = () => {
//     const [signatureText, setSignatureText] = useState('');
//     const [selectedFont, setSelectedFont] = useState('dancing-script');
//     const [selectedCategory, setSelectedCategory] = useState('All');

//     const categories = ['All', ...getFontCategories()];
    
//     const getFilteredFonts = () => {
//         if (selectedCategory === 'All') {
//             return signatureFonts;
//         }
//         return signatureFonts.filter(font => font.category === selectedCategory);
//     };

//     const getCurrentFont = () => {
//         return getFontById(selectedFont);
//     };

//     return (
//         <article className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
//             <header className='flex flex-col items-center gap-3 sm:gap-4 self-stretch'>
//                 <figure className='flex w-16 h-16 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-6 sm:h-6">
//                         <path d="M4 7V4C4 3.45 4.45 3 5 3H19C19.55 3 20 3.45 20 4V7M9 20H15M12 3V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                 </figure>
//                 <section className='flex flex-col items-center gap-1'>
//                     <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>Type Your Signature</h2>
//                     <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center px-4'>
//                         Enter your signature text and choose a font style
//                     </p>
//                 </section>
//             </header>

//             <main className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
//                 <form className='contents' onSubmit={(e) => e.preventDefault()}>
//                     {/* Signature Text Input */}
//                     <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
//                         <legend className='sr-only'>Signature Text Configuration</legend>
//                         <label htmlFor="signatureText" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
//                             Signature Text
//                         </label>
//                         <input
//                             id="signatureText"
//                             type="text"
//                             value={signatureText}
//                             onChange={(e) => setSignatureText(e.target.value)}
//                             placeholder="Enter your signature text"
//                             className='flex h-10 sm:h-12 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm sm:text-base text-neutral-500 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 transition-colors'
//                         />
//                     </fieldset>

//                     {/* Font Category Filter */}
//                     <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
//                         <legend className='sr-only'>Font Category Selection</legend>
//                         <label htmlFor="fontCategory" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
//                             Font Category
//                         </label>
//                         <select 
//                             id="fontCategory"
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                             className='flex h-9 sm:h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-500 dark:text-white focus:outline-none focus:border-primary-500 transition-colors'
//                         >
//                             {categories.map((category) => (
//                                 <option key={category} value={category}>
//                                     {category}
//                                 </option>
//                             ))}
//                         </select>
//                     </fieldset>

//                     {/* Font Style Selection */}
//                     <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
//                         <legend className='sr-only'>Font Style Selection</legend>
//                         <label htmlFor="fontStyle" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
//                             Font Style
//                         </label>
//                         <select 
//                             id="fontStyle"
//                             value={selectedFont}
//                             onChange={(e) => setSelectedFont(e.target.value)}
//                             className='flex h-9 sm:h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-500 dark:text-white focus:outline-none focus:border-primary-500 transition-colors'
//                         >
//                             {getFilteredFonts().map((font) => (
//                                 <option key={font.id} value={font.id}>
//                                     {font.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </fieldset>

//                     {/* Font Preview Grid */}
//                     <section className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch'>
//                         <h3 className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
//                             Font Previews
//                         </h3>
//                         <div className='grid grid-cols-2 gap-2 w-full max-h-28 sm:max-h-32 overflow-y-auto custom-scrollbar'>
//                             {getFilteredFonts().map((font) => (
//                                 <button
//                                     key={font.id}
//                                     type="button"
//                                     onClick={() => setSelectedFont(font.id)}
//                                     className={`flex items-center justify-center p-2 sm:p-3 rounded-lg border transition-all ${
//                                         selectedFont === font.id
//                                             ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700 dark:border-primary-500' 
//                                             : 'border-stroke-200 bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800'
//                                     }`}
//                                     title={font.description}
//                                 >
//                                     <span className={`${font.className} text-base sm:text-lg dark:text-white truncate`}>
//                                         {signatureText || font.name}
//                                     </span>
//                                 </button>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Main Signature Preview */}
//                     <section className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch'>
//                         <h3 className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
//                             Preview
//                         </h3>
//                         <figure className='flex items-center justify-center w-full h-20 sm:h-24 border border-stroke-200 rounded-lg bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700'>
//                             {signatureText ? (
//                                 <output 
//                                     className={`text-2xl sm:text-3xl md:text-4xl dark:text-white truncate px-4 ${getCurrentFont()?.className || ''}`}
//                                     aria-live="polite"
//                                 >
//                                     {signatureText}
//                                 </output>
//                             ) : (
//                                 <figcaption className='text-xs sm:text-sm text-neutral-400 dark:text-white'>
//                                     Your signature will appear here
//                                 </figcaption>
//                             )}
//                         </figure>
//                         {getCurrentFont() && (
//                             <aside className='text-xs text-neutral-400 dark:text-neutral-300 self-center text-center'>
//                                 Font: {getCurrentFont().name} • Category: {getCurrentFont().category}
//                             </aside>
//                         )}
//                     </section>
//                 </form>
//             </main>
//         </article>
//     );
// };

// export default TypeContent;

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { signatureFonts, getFontById, getFontCategories } from '@/components/ui/signatureFonts';

const TypeContent = forwardRef((props, ref) => {
    const [signatureText, setSignatureText] = useState('');
    const [selectedFont, setSelectedFont] = useState('dancing-script');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useImperativeHandle(ref, () => ({
        getTypeData: () => {
            if (!signatureText.trim()) return null;
            return {
                text: signatureText,
                fontId: selectedFont,
            };
        }
    }));

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
        <article className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
            <header className='flex flex-col items-center gap-3 sm:gap-4 self-stretch'>
                <figure className='flex w-16 h-16 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-6 sm:h-6">
                        <path d="M4 7V4C4 3.45 4.45 3 5 3H19C19.55 3 20 3.45 20 4V7M9 20H15M12 3V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <section className='flex flex-col items-center gap-1'>
                    <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>Type Your Signature</h2>
                    <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center px-4'>
                        Enter your signature text and choose a font style
                    </p>
                </section>
            </header>

            <main className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
                <form className='contents' onSubmit={(e) => e.preventDefault()}>
                    <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
                        <legend className='sr-only'>Signature Text Configuration</legend>
                        <label htmlFor="signatureText" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                            Signature Text
                        </label>
                        <input
                            id="signatureText"
                            type="text"
                            value={signatureText}
                            onChange={(e) => setSignatureText(e.target.value)}
                            placeholder="Enter your signature text"
                            className='flex h-10 sm:h-12 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm sm:text-base text-neutral-500 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 transition-colors'
                        />
                    </fieldset>

                    <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
                        <legend className='sr-only'>Font Category Selection</legend>
                        <label htmlFor="fontCategory" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                            Font Category
                        </label>
                        <select 
                            id="fontCategory"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className='flex h-9 sm:h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-500 dark:text-white focus:outline-none focus:border-primary-500 transition-colors'
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
                        <legend className='sr-only'>Font Style Selection</legend>
                        <label htmlFor="fontStyle" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                            Font Style
                        </label>
                        <select 
                            id="fontStyle"
                            value={selectedFont}
                            onChange={(e) => setSelectedFont(e.target.value)}
                            className='flex h-9 sm:h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-500 dark:text-white focus:outline-none focus:border-primary-500 transition-colors'
                        >
                            {getFilteredFonts().map((font) => (
                                <option key={font.id} value={font.id}>
                                    {font.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <section className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch'>
                        <h3 className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                            Font Previews
                        </h3>
                        <div className='grid grid-cols-2 gap-2 w-full max-h-28 sm:max-h-32 overflow-y-auto custom-scrollbar'>
                            {getFilteredFonts().map((font) => (
                                <button
                                    key={font.id}
                                    type="button"
                                    onClick={() => setSelectedFont(font.id)}
                                    className={`flex items-center justify-center p-2 sm:p-3 rounded-lg border transition-all ${
                                        selectedFont === font.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700 dark:border-primary-500' 
                                            : 'border-stroke-200 bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800'
                                    }`}
                                    title={font.description}
                                >
                                    <span className={`${font.className} text-base sm:text-lg dark:text-white truncate`}>
                                        {signatureText || font.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch'>
                        <h3 className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                            Preview
                        </h3>
                        <figure className='flex items-center justify-center w-full h-20 sm:h-24 border border-stroke-200 rounded-lg bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700'>
                            {signatureText ? (
                                <output 
                                    className={`text-2xl sm:text-3xl md:text-4xl dark:text-white truncate px-4 ${getCurrentFont()?.className || ''}`}
                                    aria-live="polite"
                                >
                                    {signatureText}
                                </output>
                            ) : (
                                <figcaption className='text-xs sm:text-sm text-neutral-400 dark:text-white'>
                                    Your signature will appear here
                                </figcaption>
                            )}
                        </figure>
                        {getCurrentFont() && (
                            <aside className='text-xs text-neutral-400 dark:text-neutral-300 self-center text-center'>
                                Font: {getCurrentFont().name} • Category: {getCurrentFont().category}
                            </aside>
                        )}
                    </section>
                </form>
            </main>
        </article>
    );
});

TypeContent.displayName = 'TypeContent';

export default TypeContent;