import React from 'react';
import ContentManagementTableHeader from './ContentManagementTableHeader';
import ContentManagementRow from './ContentManagementRow';

const ContentManagementList = ({ data, selectedIds, onSelectItem, onSelectAll }) => {
    const isAllSelected = data.length > 0 && selectedIds.length === data.length;

    return (
        <section
            className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 overflow-hidden'
            aria-label="Content management list"
        >
            <ContentManagementTableHeader 
                onSelectAll={onSelectAll}
                isAllSelected={isAllSelected}
            />
            <ul className="w-full overflow-x-auto">
                {data.map((member) => (
                    <ContentManagementRow 
                        key={member.id} 
                        member={member}
                        isSelected={selectedIds.includes(member.id)}
                        onSelect={onSelectItem}
                    />
                ))}
            </ul>
        </section>
    );
};

export default ContentManagementList;