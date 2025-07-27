import SignaturesList from '@/components/templates/home/signatures/SignaturesList'
import StartFromSignature from '@/components/templates/home/signatures/StartFromSignature'
import React from 'react'

const SignaturesContent = () => {
    return (
        <div>
            <StartFromSignature />
            <SignaturesList />
        </div>
    )
}

export default SignaturesContent