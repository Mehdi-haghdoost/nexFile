
export const sharedCards = {

    lineChart: {
        type: 'chart',
        title: 'satisfaction',
        percentage: '+23,92%',
        timeframe: 'last month',
        description: 'User satisfaction has increased with seamless file management, enhanced security, and fast access, making storage and sharing effortless',
        image: './images/chart.svg',
        className: 'items-start w-[300px]  p-[21.818px] pt-12 gap-[18.182px] blur-card',

    },

    testimonial: {
        type: 'testimonial',
        quote: '"The search and folder organization features are incredibly efficient. My productivity has improved since using this dashboard!"',
        user: {
            name: 'David Villa',
            email: 'davill@gmail.com',
        },
        className: 'items-start   w-[300px]  p-[21.818px] pt-12 gap-[18.182px] blur-card',
    },

    barChart: {
        type: 'bar',
        title: 'total user',
        percentage: '+44,21%',
        timeframe: 'last month',
        description: "Our dashboard's growing reliability and efficiency have led to a significant increase in total users, reflecting trust and satisfaction in our service",
        image: './images/Graph.png',
        className: 'items-start w-[300px] h-[345px]  p-[21.818px]  blur-card',
    },
    feature: {
        type: 'feature',
        title: 'Feature',
        percentage: '20%',
        timeframe: 'more feature',
        image: './images/Container.png',
        description: 'Packed with powerful features like secure storage, real-time sync, advanced search, and seamless sharing for effortless file management',
        className: 'items-start w-[330px] h-[400px] p-[24px] gap-[20px] blur-card',
    },
    freeStorageUpTo: {
        type: 'freeStorage',
        title: 'free storage up to',
        storage: '100',
        timeframe: 'GB',
        image: './images/folder.png',
        description: 'Enjoy up to 100GB of free storage, giving you ample space to store, manage, and share your files with ease',
        className: 'items-start w-[330px] p-[24px] gap-[12px] rounded-[28px] border border-[#E1E0E5] border bg-white',
    }

}