// import React, { useRef, useState, useEffect } from 'react';
// import useDarkModeCanvas from '@/hooks/canvas/useDarkModeCanvas';

// const DrawContent = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [penSize, setPenSize] = useState(2);
//     const isDarkMode = useDarkModeCanvas();

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             ctx.lineCap = 'round';
//             ctx.lineJoin = 'round';
//             ctx.strokeStyle = isDarkMode ? '#FFFFFF' : '#000000';
//         }
//     }, [isDarkMode]);

//     const startDrawing = (e) => {
//         setIsDrawing(true);
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.lineWidth = penSize;
//         ctx.strokeStyle = isDarkMode ? '#FFFFFF' : '#000000';
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     };

//     const draw = (e) => {
//         if (!isDrawing) return;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//     };

//     return (
//         <article className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
//             <header className='flex flex-col items-center gap-3 sm:gap-4 self-stretch'>
//                 <figure className='flex w-16 h-16 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-6 sm:h-6">
//                         <path d="M3 20C7.333 17 10 14 10 11C10 7 8 7 6 7C4 7 2.354 8.758 2.4 11C2.45 13.548 4.658 14.477 5.5 16C7 18 8 19 10 17C11.167 15.5 11.917 14.167 12.5 13C14 17.318 16.333 19 19 19H22M22 19L18 15V2C18 0.897 18.897 0 20 0C21.103 0 22 0.897 22 2V15L22 19ZM18 5H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                 </figure>
//                 <section className='flex flex-col items-center gap-1'>
//                     <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>Draw Your Signature</h2>
//                     <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center px-4'>
//                         Use your mouse or touch to draw your signature in the area below
//                     </p>
//                 </section>
//             </header>

//             {/* Canvas Drawing Section */}
//             <section className='flex flex-col gap-2 sm:gap-3 self-stretch'>
//                 <figure className='w-full'>
//                     <canvas
//                         ref={canvasRef}
//                         width={580}
//                         height={200}
//                         onMouseDown={startDrawing}
//                         onMouseMove={draw}
//                         onMouseUp={stopDrawing}
//                         onMouseLeave={stopDrawing}
//                         className='w-full h-40 sm:h-48 border-2 border-stroke-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 cursor-crosshair touch-none'
//                         aria-label="Drawing canvas for signature"
//                     />
//                     <figcaption className='sr-only'>
//                         Canvas area for drawing your signature
//                     </figcaption>
//                 </figure>
                
//                 {/* Drawing Controls */}
//                 <section className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0'>
//                     <fieldset className='flex items-center gap-2 sm:gap-3 border-0 p-0 m-0'>
//                         <legend className='sr-only'>Drawing Tools</legend>
//                         <label htmlFor="penSize" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap'>
//                             Pen Size:
//                         </label>
//                         <input 
//                             id="penSize"
//                             type="range" 
//                             min="1" 
//                             max="10" 
//                             value={penSize}
//                             onChange={(e) => setPenSize(parseInt(e.target.value))}
//                             className='flex-1 sm:w-20'
//                             aria-describedby="penSizeValue"
//                         />
//                         <output id="penSizeValue" className='text-xs sm:text-sm text-neutral-400 dark:text-white min-w-[40px] text-right'>
//                             {penSize}px
//                         </output>
//                     </fieldset>
//                     <button
//                         onClick={clearCanvas}
//                         type="button"
//                         className='w-full sm:w-auto flex items-center justify-center gap-2 h-8 py-1 px-3 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs sm:text-sm text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
//                         aria-label="Clear canvas"
//                     >
//                         Clear
//                     </button>
//                 </section>
//             </section>
//         </article>
//     );
// };

// export default DrawContent;
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useDarkModeCanvas from '@/hooks/canvas/useDarkModeCanvas';

const DrawContent = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penSize, setPenSize] = useState(2);
    const [hasDrawn, setHasDrawn] = useState(false);
    const isDarkMode = useDarkModeCanvas();

    useImperativeHandle(ref, () => ({
        getCanvasData: () => {
            if (!hasDrawn) return null;
            const canvas = canvasRef.current;
            return canvas ? canvas.toDataURL('image/png') : null;
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = isDarkMode ? '#FFFFFF' : '#000000';
        }
    }, [isDarkMode]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        setHasDrawn(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = penSize;
        ctx.strokeStyle = isDarkMode ? '#FFFFFF' : '#000000';
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    return (
        <article className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
            <header className='flex flex-col items-center gap-3 sm:gap-4 self-stretch'>
                <figure className='flex w-16 h-16 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-6 sm:h-6">
                        <path d="M3 20C7.333 17 10 14 10 11C10 7 8 7 6 7C4 7 2.354 8.758 2.4 11C2.45 13.548 4.658 14.477 5.5 16C7 18 8 19 10 17C11.167 15.5 11.917 14.167 12.5 13C14 17.318 16.333 19 19 19H22M22 19L18 15V2C18 0.897 18.897 0 20 0C21.103 0 22 0.897 22 2V15L22 19ZM18 5H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <section className='flex flex-col items-center gap-1'>
                    <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>Draw Your Signature</h2>
                    <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center px-4'>
                        Use your mouse or touch to draw your signature in the area below
                    </p>
                </section>
            </header>

            <section className='flex flex-col gap-2 sm:gap-3 self-stretch'>
                <figure className='w-full'>
                    <canvas
                        ref={canvasRef}
                        width={580}
                        height={200}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className='w-full h-40 sm:h-48 border-2 border-stroke-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 cursor-crosshair touch-none'
                        aria-label="Drawing canvas for signature"
                    />
                    <figcaption className='sr-only'>
                        Canvas area for drawing your signature
                    </figcaption>
                </figure>
                
                <section className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0'>
                    <fieldset className='flex items-center gap-2 sm:gap-3 border-0 p-0 m-0'>
                        <legend className='sr-only'>Drawing Tools</legend>
                        <label htmlFor="penSize" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap'>
                            Pen Size:
                        </label>
                        <input 
                            id="penSize"
                            type="range" 
                            min="1" 
                            max="10" 
                            value={penSize}
                            onChange={(e) => setPenSize(parseInt(e.target.value))}
                            className='flex-1 sm:w-20'
                            aria-describedby="penSizeValue"
                        />
                        <output id="penSizeValue" className='text-xs sm:text-sm text-neutral-400 dark:text-white min-w-[40px] text-right'>
                            {penSize}px
                        </output>
                    </fieldset>
                    <button
                        onClick={clearCanvas}
                        type="button"
                        className='w-full sm:w-auto flex items-center justify-center gap-2 h-8 py-1 px-3 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs sm:text-sm text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                        aria-label="Clear canvas"
                    >
                        Clear
                    </button>
                </section>
            </section>
        </article>
    );
});

DrawContent.displayName = 'DrawContent';

export default DrawContent;