import SignaturesList from '@/components/templates/home/signatures/SignaturesList'
import StartFromSignature from '@/components/templates/home/signatures/StartFromSignature'
import React from 'react'
import ActionButtons from '../ActionButtons'

const SignaturesContent = () => {
    return (
        <div className='flex py-6 px-8 flex-col items-start gap-6  self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800'>
             <ActionButtons activeSection="signatures" />
             {/* Start from the signature */}
            <StartFromSignature />
            {/* File Section */}
            <SignaturesList />
        </div>
    )
}

export default SignaturesContent