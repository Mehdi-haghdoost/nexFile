import { useEffect, useState } from 'react';

const SIZE_CLASSES = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-[11px]',
    md: 'w-8 h-8 sm:w-[38px] sm:h-[38px] text-xs',
};

// Up to two letters from the name, or from the email when there is no name
const getInitials = (name, email) => {
    const source = (name && name !== 'Unnamed' ? name : email || '?').trim();
    const words = source.split(/[\s@._-]+/).filter(Boolean);
    const letters = words.length > 1 ? words[0][0] + words[1][0] : source.slice(0, 2);

    return letters.toUpperCase();
};

// A person's photo, or their initials when there is none or it fails to load
const PersonAvatar = ({ name, email, avatar, size = 'md' }) => {
    const [hasFailed, setHasFailed] = useState(false);

    // A new photo gets a fresh chance to load
    useEffect(() => setHasFailed(false), [avatar]);

    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

    if (avatar && !hasFailed) {
        return (
            <img
                src={avatar}
                alt={name || email || ''}
                onError={() => setHasFailed(true)}
                className={`${sizeClass} rounded-full object-cover shrink-0`}
            />
        );
    }

    return (
        <span
            aria-hidden='true'
            className={`${sizeClass} flex items-center justify-center rounded-full shrink-0 bg-primary-500/10 text-primary-500 font-medium dark:bg-primary-500/20 dark:text-white`}
        >
            {getInitials(name, email)}
        </span>
    );
};

export default PersonAvatar;