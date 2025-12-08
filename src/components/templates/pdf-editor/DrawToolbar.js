'use client';
import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { 
    ChevronDownIcon, 
    EraserIcon, 
    LinearCloseCircle, 
    RedoIcon, 
    UndoIcon 
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const DrawToolbar = () => {
    const { setActiveEditingTool } = usePdfEditorStore();
    
    const [showOpacityDropdown, setShowOpacityDropdown] = useState(false);
    const [showStrokeDropdown, setShowStrokeDropdown] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [opacity, setOpacity] = useState(100);
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isEraserActive, setIsEraserActive] = useState(false);

    const colorPickerRef = useRef(null);
    const opacityRef = useRef(null);
    const strokeRef = useRef(null);

    const opacityOptions = [25, 50, 75, 100];
    const strokeOptions = [0.5, 1, 2, 3, 4, 5];

    const quickColors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
            if (opacityRef.current && !opacityRef.current.contains(event.target)) {
                setShowOpacityDropdown(false);
            }
            if (strokeRef.current && !strokeRef.current.contains(event.target)) {
                setShowStrokeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUndo = () => console.log('Undo action');
    const handleRedo = () => console.log('Redo action');
    const handleEraser = () => {
        setIsEraserActive(!isEraserActive);
        console.log('Eraser tool activated');
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        console.log('Color changed to:', color);
    };

    const handleQuickColorSelect = (color) => {
        setSelectedColor(color);
        setShowColorPicker(false);
        console.log('Quick color selected:', color);
    };

    const handleOpacitySelect = (value) => {
        setOpacity(value);
        setShowOpacityDropdown(false);
        console.log('Opacity changed to:', value);
    };

    const handleStrokeSelect = (value) => {
        setStrokeWidth(value);
        setShowStrokeDropdown(false);
        console.log('Stroke width changed to:', value);
    };

    const handleClose = () => {
        console.log('Closing draw toolbar');
        setActiveEditingTool(null); 
    };

    const ToolButton = ({ icon: Icon, label, onClick, className = "", isActive = false }) => (
        <button
            onClick={onClick}
            className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 ${
                isActive 
                    ? 'bg-gray-100 dark:bg-neutral-600' 
                    : 'hover:bg-gray-100 dark:hover:bg-transparent'
            } ${className}`}
            aria-label={label}
            title={label}
        >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
    );

    const DropdownButton = ({ 
        value, 
        options, 
        isOpen, 
        onToggle, 
        onSelect, 
        formatValue = (val) => val,
        dropdownRef
    }) => (
        <div className='relative' ref={dropdownRef}>
            <button 
                onClick={onToggle}
                className="flex h-7 sm:h-8 py-2 sm:py-[13px] pr-1.5 sm:pr-2 pl-2 sm:pl-[14px] justify-center items-center gap-1 rounded-lg border border-stroke-300 dark:border-neutral-800 bg-white dark:bg-dark-overlay shadow-light hover:bg-gray-50 transition-colors flex-shrink-0"
            >
                <span className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white text-center whitespace-nowrap'>{formatValue(value)}</span>
                <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            {isOpen && (
                <div className='absolute top-full mt-1 left-0 bg-white dark:bg-neutral-900 border border-stroke-300 dark:border-dark-border rounded-lg shadow-lg z-50 min-w-[80px]'>
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => onSelect(option)}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 first:rounded-t-lg last:rounded-b-lg transition-colors dark:hover:bg-neutral-600 ${
                                option === value ? 'bg-primary-500/10 dark:bg-transparent text-primary-500' : ''
                            }`}
                        >
                            {formatValue(option)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const ToolSection = ({ label, children, hasBorder = false }) => (
        <section className={`flex items-center justify-center gap-1.5 sm:gap-2 ${hasBorder ? 'pr-2 border-r border-stroke-500' : ''}`}>
            {label && <h3 className='hidden sm:block text-xs text-neutral-500 dark:text-white whitespace-nowrap'>{label}</h3>}
            {children}
        </section>
    );

    const ColorPickerComponent = () => (
        <div className='relative flex-shrink-0' ref={colorPickerRef}>
            <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className='flex w-7 h-7 sm:w-8 sm:h-8 p-1 justify-center items-center rounded-lg border border-stroke-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 hover:bg-gray-50 transition-colors'
                aria-label="Select color"
            >
                <div 
                    className='w-full h-full rounded border border-gray-200'
                    style={{ backgroundColor: selectedColor }}
                />
            </button>

            {showColorPicker && (
                <div className='absolute top-full mt-2 left-0 sm:left-auto sm:right-0 bg-white dark:bg-neutral-900 border border-stroke-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 p-3 sm:p-4'>
                    {/* Quick Colors */}
                    <div className='mb-3 sm:mb-4'>
                        <h4 className='text-xs text-gray-600 dark:text-gray-300 mb-2'>Quick Colors</h4>
                        <div className='grid grid-cols-5 gap-1'>
                            {quickColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleQuickColorSelect(color)}
                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 hover:scale-110 transition-transform ${
                                        selectedColor === color ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className='mb-3'>
                        <h4 className='text-xs text-gray-600 dark:text-gray-300 mb-2'>Custom Color</h4>
                        <HexColorPicker 
                            color={selectedColor} 
                            onChange={handleColorChange}
                            style={{ width: '180px', height: '130px' }}
                            className="sm:!w-[200px] sm:!h-[150px]"
                        />
                    </div>

                    {/* Color Value Display */}
                    <div className='flex items-center gap-2'>
                        <input
                            type="text"
                            value={selectedColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className='flex-1 px-2 py-1 text-xs border border-stroke-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white rounded text-center'
                            placeholder="#000000"
                        />
                        <div 
                            className='w-5 h-5 sm:w-6 sm:h-6 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0'
                            style={{ backgroundColor: selectedColor }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <nav className='flex flex-col sm:flex-row items-start sm:items-center justify-between self-stretch py-3 sm:py-4 px-3 sm:px-8 gap-3 sm:gap-0 border-t border-b border-l border-stroke-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 overflow-x-auto'>
            {/* Left Section - Drawing Tools */}
            <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0'>
                {/* Undo/Redo Section */}
                <ToolSection hasBorder>
                    <ToolButton 
                        icon={UndoIcon} 
                        label="Undo" 
                        onClick={handleUndo} 
                    />
                    <ToolButton 
                        icon={RedoIcon} 
                        label="Redo" 
                        onClick={handleRedo} 
                    />
                </ToolSection>

                {/* Color Section */}
                <ToolSection label="Color" hasBorder>
                    <ColorPickerComponent />
                </ToolSection>

                {/* Opacity Section */}
                <ToolSection label="Opacity">
                    <DropdownButton
                        value={opacity}
                        options={opacityOptions}
                        isOpen={showOpacityDropdown}
                        onToggle={() => setShowOpacityDropdown(!showOpacityDropdown)}
                        onSelect={handleOpacitySelect}
                        formatValue={(val) => `${val}%`}
                        dropdownRef={opacityRef}
                    />
                </ToolSection>

                {/* Stroke Section */}
                <ToolSection label="Stroke" hasBorder>
                    <DropdownButton
                        value={strokeWidth}
                        options={strokeOptions}
                        isOpen={showStrokeDropdown}
                        onToggle={() => setShowStrokeDropdown(!showStrokeDropdown)}
                        onSelect={handleStrokeSelect}
                        formatValue={(val) => `${val}pt`}
                        dropdownRef={strokeRef}
                    />
                </ToolSection>

                {/* Eraser Tool */}
                <ToolButton 
                    icon={EraserIcon} 
                    label="Eraser tool" 
                    onClick={handleEraser}
                    isActive={isEraserActive}
                />
            </div>

            {/* Right Section - Close Button */}
            <button 
                onClick={handleClose}
                className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors self-end sm:self-auto'
                aria-label="Close drawing toolbar"
            >
                <div className='flex items-center justify-center w-4 h-4'>
                    <LinearCloseCircle />
                </div>
                <span className='text-xs sm:text-sm text-neutral-500 dark:text-white'>Close</span>
            </button>
        </nav>
    );
};

export default DrawToolbar;