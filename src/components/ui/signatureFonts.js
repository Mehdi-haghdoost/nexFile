export const signatureFonts = [
    {
        id: 'dancing-script',
        name: 'Dancing Script',
        className: 'font-dancing-script',
        category: 'Elegant Script',
        weight: '500',
        description: 'Beautiful flowing script font'
    },
    {
        id: 'caveat',
        name: 'Caveat',
        className: 'font-caveat',
        category: 'Handwritten',
        weight: '500',
        description: 'Casual handwritten style'
    },
    {
        id: 'pacifico',
        name: 'Pacifico',
        className: 'font-pacifico',
        category: 'Playful',
        weight: '400',
        description: 'Fun and playful signature'
    },
    {
        id: 'great-vibes',
        name: 'Great Vibes',
        className: 'font-great-vibes',
        category: 'Elegant Script',
        weight: '400',
        description: 'Sophisticated script font'
    },
    {
        id: 'satisfy',
        name: 'Satisfy',
        className: 'font-satisfy',
        category: 'Casual',
        weight: '400',
        description: 'Relaxed handwriting style'
    },
    {
        id: 'kalam',
        name: 'Kalam',
        className: 'font-kalam',
        category: 'Handwritten',
        weight: '400',
        description: 'Clean handwritten font'
    },
    {
        id: 'indie-flower',
        name: 'Indie Flower',
        className: 'font-indie-flower',
        category: 'Casual',
        weight: '400',
        description: 'Friendly casual writing'
    },
    {
        id: 'shadows-into-light',
        name: 'Shadows Into Light',
        className: 'font-shadows-into-light',
        category: 'Playful',
        weight: '400',
        description: 'Light and airy style'
    },
    {
        id: 'amatic-sc',
        name: 'Amatic SC',
        className: 'font-amatic-sc',
        category: 'Handwritten',
        weight: '400',
        description: 'Hand-drawn marker style'
    },
    {
        id: 'permanent-marker',
        name: 'Permanent Marker',
        className: 'font-permanent-marker',
        category: 'Bold',
        weight: '400',
        description: 'Bold marker pen style'
    }
];

export const getFontByCategory = (category) => {
    return signatureFonts.filter(font => font.category === category);
};

export const getFontById = (id) => {
    return signatureFonts.find(font => font.id === id);
};

export const getFontCategories = () => {
    return [...new Set(signatureFonts.map(font => font.category))];
};

export const getRandomFont = () => {
    return signatureFonts[Math.floor(Math.random() * signatureFonts.length)];
};

export const validateFontId = (id) => {
    return signatureFonts.some(font => font.id === id);
};