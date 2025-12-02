import { SeeInsightsIcon, SuggestedItemIcon } from '@/components/ui/icons';
import React from 'react';

// Individual card component for better organization
const AnalyticsCard = ({
  icon,
  description,
  buttonLabel,
  gradientClass,
  shadowClass,
  onClick
}) => (
  <article className="flex w-full sm:w-[300px] p-3 flex-col items-start gap-2 rounded-lg border border-stroke-300 bg-white dark:border-neutral-700 dark:bg-neutral-800">
    <div className={`rounded-lg ${buttonLabel === "See Insights"
      ? "bg-[rgba(24,188,43,0.10)]"
      : "bg-[rgba(217,170,27,0.10)]"
      } flex h-32 sm:h-40 py-4 px-7 flex-col justify-center items-center gap-2.5 self-stretch`}>
      <div className={`rounded-2xl border-2 border-white/20 ${gradientClass} ${shadowClass} flex w-14 h-14 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 shrink-0`}>
        {icon}
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-2 self-stretch">
      <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300">{description}</p>
      <button
        className="flex h-7 py-[13px] px-[14px] justify-center items-center gap-1.5 self-stretch rounded-lg border border-stroke-300 bg-white shadow-light text-sm font-medium text-center hover:bg-gray-50 transition-colors dark:border-dark-border dark:bg-dark-gradient dark:text-white dark:hover:bg-neutral-700"
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    </div>
  </article>
);
const StartWithAnalytics = () => {
  const handleUploadFile = () => {
    console.log('Upload file clicked');
    // Add your logic here
  };
  const handleGetInsights = () => {
    console.log('Get insights clicked');
    // Add your logic here
  };
  // Card data for better organization
  const cardData = [
    {
      id: 'upload',
      icon: <SuggestedItemIcon />,
      description: "Upload a file and manage access permissions",
      buttonLabel: "Try it out",
      gradientClass: "bg-[radial-gradient(332.62%_171.53%_at_50%_2.78%,#F3DB8F_0%,#D9A91B_32.78%)]",
      shadowClass: "shadow-[-3px_4px_8px_0_rgba(217,169,26,0.20)]",
      onClick: handleUploadFile
    },
    {
      id: 'insights',
      icon: <SeeInsightsIcon />,
      description: "Get page-by-page analytics sample",
      buttonLabel: "See Insights",
      gradientClass: "bg-[radial-gradient(358.2%_184.72%at_50%-10.42%,#9FFFAB_0%,#18BC2B_44.21%)]",
      shadowClass: "shadow-[-3px_4px_8px_0_rgba(23,188,42,0.20)]",
      onClick: handleGetInsights
    }
  ];
  return (
    <section className="flex flex-col items-start gap-3 self-stretch w-full">
      <header>
        <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Starting with analytics</h2>
      </header>
      <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
        {cardData.map((card) => (
          <AnalyticsCard
            key={card.id}
            icon={card.icon}
            description={card.description}
            buttonLabel={card.buttonLabel}
            gradientClass={card.gradientClass}
            shadowClass={card.shadowClass}
            onClick={card.onClick}
          />
        ))}
      </div>
    </section>
  );
};
export default StartWithAnalytics;