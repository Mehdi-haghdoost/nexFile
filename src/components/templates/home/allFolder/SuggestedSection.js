import SuggestedCard from './SuggestedCard';

const SuggestedSection = () => {
  const suggestedItems = [
    {
      id: 1,
      image: '/images/folder.png',
      title: 'DOCX',
      time: '1h ago'
    },
    {
      id: 2,
      image: '/images/folder.png',
      title: 'DOCX',
      time: '1h ago'
    },
    {
      id: 3,
      image: '/images/folder.png',
      title: 'DOCX',
      time: '1h ago'
    },
    {
      id: 4,
      image: '/images/folder.png',
      title: 'DOCX',
      time: '1h ago'
    }
  ];

  return (
    <div className='flex flex-col items-start gap-3 self-stretch'>
      <h3 className='text-medium-18 dark:text-medium-18-white'>Suggested from your activity</h3>
      <ul className='flex flex-wrap items-start gap-3 self-stretch'>
        {suggestedItems.map((item) => (
          <SuggestedCard
            key={item.id}
            image={item.image}
            title={item.title}
            time={item.time}
          />
        ))}
      </ul>
    </div>
  );
};

export default SuggestedSection;