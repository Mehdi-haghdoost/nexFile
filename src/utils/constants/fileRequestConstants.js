// Status filters, matching the values the request route expects
export const FILE_REQUEST_FILTERS = [
    { label: 'All', value: 'All' },
    { label: 'Opened', value: 'Opened' },
    { label: 'Closed', value: 'Closed' },
];

export const FILE_REQUEST_COLUMNS = [
    { id: 'name', label: 'Name', sortable: true, width: 'flex-1' },
    { id: 'created', label: 'Created', sortable: true, width: 'w-[120px] lg:w-[150px]' },
    { id: 'expiration', label: 'Expiration', sortable: true, width: 'w-[120px] lg:w-[150px]' },
    { id: 'submitters', label: 'Submitters', sortable: true, width: 'w-[100px] lg:w-[120px]' },
    { id: 'uploads', label: 'Uploads', sortable: true, width: 'w-[100px] lg:w-[120px]' },
    { id: 'action', label: 'Action', sortable: false, width: 'w-[52px]' },
];