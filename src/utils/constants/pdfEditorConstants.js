// Quick-pick swatches shared by every color picker in the PDF editor.
// swatchClass must stay a literal string (not built with a template
// literal) so Tailwind's static scanner can find it in this file and
// generate the matching bg-[...] utility at build time. A computed class
// name would never be generated and the swatch would render unstyled.
export const QUICK_COLORS = [
    { hex: '#000000', swatchClass: 'bg-[#000000]' },
    { hex: '#FFFFFF', swatchClass: 'bg-[#FFFFFF]' },
    { hex: '#FF0000', swatchClass: 'bg-[#FF0000]' },
    { hex: '#00FF00', swatchClass: 'bg-[#00FF00]' },
    { hex: '#0000FF', swatchClass: 'bg-[#0000FF]' },
    { hex: '#FFFF00', swatchClass: 'bg-[#FFFF00]' },
    { hex: '#FF00FF', swatchClass: 'bg-[#FF00FF]' },
    { hex: '#00FFFF', swatchClass: 'bg-[#00FFFF]' },
    { hex: '#FFA500', swatchClass: 'bg-[#FFA500]' },
    { hex: '#800080', swatchClass: 'bg-[#800080]' },
];

export const OPACITY_OPTIONS = [25, 50, 75, 100];
export const STROKE_OPTIONS = [0.5, 1, 2, 3, 4, 5];
export const FONT_SIZE_OPTIONS = [10, 12, 14, 16, 20, 24, 32];
export const ZOOM_OPTIONS = [25, 50, 75, 100, 125, 150, 200];