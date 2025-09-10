import React from 'react';

// Icons as separate components for reusability
const CreateSignatureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M2.50006 18.7695L4.95908 21.2285" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.50006 21.2285L4.95908 18.7695" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.25422 16.3635C17.1497 13.5764 19.231 6.33558 18.0688 4.6126C15.8407 1.30894 12.41 12.5722 11.655 17.451C10.6694 23.8196 9.91717 33.7022 3.49186 35.9828C-1.36715 30.6615 12.9262 20.0186 18.286 15.7068C18.1149 16.3962 18.8259 17.1326 19.511 17.2938C20.1961 17.455 20.9144 17.1932 21.5124 16.8188C22.7027 16.0738 23.5945 14.856 23.9517 13.4879C23.8139 14.6188 23.581 18.1584 24.652 18.5205C25.8243 18.9171 27.1021 16.2162 27.1624 14.4553C27.4674 14.8835 28.0941 17.9619 29.4095 16.9273C29.8656 16.5685 29.7445 16.0037 30.6122 16.0966C31.6845 16.2113 32.1653 16.326 33.2377 16.4407" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30.7788 11.9747C32.0018 9.33646 34.0215 6.62296 36.4735 8.14407C39.1137 9.78187 39.0699 19.951 33.2551 21.2297" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 26C15 26 20.8537 24.4375 26.7073 25.2188C32.561 26 39 26 39 26" stroke="white" strokeLinecap="round" />
  </svg>
);

const GetSignaturesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M25 11.6668L14.1667 22.5001C13.5036 23.1631 13.1311 24.0624 13.1311 25.0001C13.1311 25.9378 13.5036 26.8371 14.1667 27.5001C14.8297 28.1631 15.729 28.5356 16.6667 28.5356C17.6043 28.5356 18.5036 28.1631 19.1667 27.5001L30 16.6668C31.3261 15.3407 32.0711 13.5421 32.0711 11.6668C32.0711 9.79141 31.3261 7.99285 30 6.66677C28.6739 5.34069 26.8754 4.5957 25 4.5957C23.1246 4.5957 21.3261 5.34069 20 6.66677L9.16666 17.5001C7.17754 19.4892 6.06006 22.1871 6.06006 25.0001C6.06006 27.8132 7.17754 30.511 9.16666 32.5001C11.1558 34.4892 13.8536 35.6067 16.6667 35.6067C19.4797 35.6067 22.1775 34.4892 24.1667 32.5001L35 21.6668" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SignatureCard = ({ 
  icon, 
  description, 
  buttonLabel, 
  gradientClass, 
  shadowClass,
  onClick
}) => (
  <article className="flex w-[300px] p-3 flex-col items-start gap-2 rounded-lg border border-stroke-300 bg-white">
    <div className="rounded-lg bg-[rgba(2,87,221,0.05)] flex h-40 py-4 px-7 flex-col justify-center items-center gap-2.5 self-stretch">
      <div className={`rounded-2xl border-2 border-white/20 ${gradientClass} ${shadowClass} flex w-18 h-18 p-1 flex-col justify-center items-center gap-2 shrink-0`}>
        {icon}
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-2 self-stretch">
      <p className="text-regular-12">{description}</p>
      <button 
        className="flex h-7 py-[13px] px-[14px] justify-center items-center gap-1.5 self-stretch rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 text-center hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    </div>
  </article>
);

const StartFromSignature = () => {
  const handleCreateSignature = () => {
    console.log('Create signature clicked');
    // Add your logic here
  };

  const handleGetSignatures = () => {
    console.log('Get signatures clicked');
    // Add your logic here
  };

  return (
    <section className="flex flex-col items-start gap-3 self-stretch">
      <h3 className="text-medium-18">Start from the signature</h3>
      <div className="flex items-start gap-3">
        <SignatureCard
          icon={<CreateSignatureIcon />}
          description="Prepare your signature for signing."
          buttonLabel="Create signature"
          gradientClass="bg-[radial-gradient(358.2%_184.72%_at_50%_-10.42%,#55DAFF_0%,#0358DD_44.21%)]"
          shadowClass="shadow-[rgba(3,88,221,0.20)_-3px_4px_8px_0px]"
          onClick={handleCreateSignature}
        />
        <SignatureCard
          icon={<GetSignaturesIcon />}
          description="Sign your first document in just a few steps."
          buttonLabel="Get signatures"
          gradientClass="bg-[radial-gradient(328.58%_169.44%_at_50%_4.86%,#FB5_0%,#DD8603_53.92%)]"
          shadowClass="shadow-[rgba(41,27,5,0.20)_-3px_4px_8px_0px] shadow-[rgba(3,88,221,0.20)_-3px_4px_8px_0px]"
          onClick={handleGetSignatures}
        />
      </div>
    </section>
  );
};

export default StartFromSignature;