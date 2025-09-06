import React from 'react';

const DocumentSection = ({ 
    type = 'content', 
    title, 
    content = [], 
    images = [], 
    additionalContent = [],
    finalImage 
}) => {
    const isHeaderSection = type === 'header';
    
    const renderTitle = () => {
        if (!title) return null;
        
        if (isHeaderSection) {
            return (
                <header className='flex items-center gap-3 self-stretch'>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
                    <h1 className='text-semibold-20'>{title}</h1>
                    <div className="flex-1 h-px bg-gradient-to-l from-gray-600 to-transparent" />
                </header>
            );
        }
        
        return <h2 className='text-semibold-16'>{title}</h2>;
    };

    const renderContent = (contentArray, key = 'content') => {
        if (!contentArray || contentArray.length === 0) return null;
        
        return contentArray.map((text, index) => (
            <p key={`${key}-${index}`} className='text-regular-12-neutral-500 self-stretch'>
                {text}
                {isHeaderSection && index < contentArray.length - 1 && (
                    <>
                        <br />
                        <br />
                    </>
                )}
            </p>
        ));
    };

    const renderImages = () => {
        return images.map((image, index) => (
            <img 
                key={`image-${index}`}
                src={image.src}
                alt={image.alt}
                className={image.className}
                loading="lazy"
            />
        ));
    };

    return (
        <section className='flex flex-col items-start gap-3 self-stretch'>
            {renderTitle()}
            {renderContent(content)}
            {renderImages()}
            {renderContent(additionalContent, 'additional')}
            {finalImage && (
                <img 
                    src={finalImage.src}
                    alt={finalImage.alt}
                    className={finalImage.className}
                    loading="lazy"
                />
            )}
        </section>
    );
};

export default DocumentSection;