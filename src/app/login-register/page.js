"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Login from "@/components/templates/login-register/Login.jsx";
import Register from "@/components/templates/login-register/Register.jsx";
import ForgetPassword from '@/components/templates/login-register/ForgetPassword.jsx';
import ResetPassword from '@/components/templates/login-register/ResetPassword.jsx';
import ResetSuccess from '@/components/templates/login-register/ResetSuccess.jsx';
import TwoFactorChallenge from '@/components/templates/login-register/TwoFactorChallenge.jsx';
import TwoFactorRecovery from '@/components/templates/login-register/TwoFactorRecovery.jsx';
import AuthLayout from '@/components/layouts/Auth/AuthLayout';
import TwoFactorEnrolment from '@/components/templates/login-register/TwoFactorEnrolment.jsx';

import { sharedCards } from '@/data/login-register/sharedCards';

const VALID_STEPS = ['login', 'register', 'forget', 'reset', 'reset-success', 'two-factor', 'two-factor-setup', 'recovery'];

const LoginRegister = () => {
    const searchParams = useSearchParams();
    const [step, setStep] = useState('login');
    const [recoveryToken, setRecoveryToken] = useState(null);

    useEffect(() => {
        const stepParam = searchParams.get('step');
        const tokenParam = searchParams.get('token');

        if (stepParam === 'reset' && tokenParam) {
            setStep('reset');
        } else if (stepParam === 'recovery' && tokenParam) {
            setRecoveryToken(tokenParam);
            setStep('recovery');
        } else if (stepParam && VALID_STEPS.includes(stepParam)) {
            setStep(stepParam);
        }
    }, [searchParams]);

    const cardsForSteps = {
        login: [sharedCards.lineChart, sharedCards.testimonial, sharedCards.barChart],
        register: [sharedCards.testimonial, sharedCards.barChart, sharedCards.feature],
        forget: [sharedCards.barChart, sharedCards.feature, sharedCards.testimonial],
        reset: [sharedCards.feature, sharedCards.freeStorageUpTo, sharedCards.testimonial],
        'reset-success': [sharedCards.lineChart, sharedCards.testimonial, sharedCards.barChart],
        'two-factor': [sharedCards.feature, sharedCards.testimonial, sharedCards.barChart],
        'two-factor-setup': [sharedCards.feature, sharedCards.testimonial, sharedCards.barChart],
        recovery: [sharedCards.feature, sharedCards.testimonial, sharedCards.barChart],
    };

    const currentCards = cardsForSteps[step] || cardsForSteps.login;

    const goto = (targetStep, token = null) => {
        if (typeof window === 'undefined') return;

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('step', targetStep);

        if (token) {
            newUrl.searchParams.set('token', token);
        } else {
            newUrl.searchParams.delete('token');
        }

        window.history.pushState({}, '', newUrl);
        setStep(targetStep);
    };

    const renderStep = () => {
        switch (step) {
            case 'login':
                return <Login goto={goto} />;
            case 'register':
                return <Register goto={goto} />;
            case 'forget':
                return <ForgetPassword goto={goto} />;
            case 'reset':
                return <ResetPassword goto={goto} />;
            case 'reset-success':
                return <ResetSuccess goto={goto} />;
            case 'two-factor':
                return <TwoFactorChallenge goto={goto} />;
            case 'two-factor-setup':
                return <TwoFactorEnrolment goto={goto} />;
            case 'recovery':
                return <TwoFactorRecovery goto={goto} token={recoveryToken} />;
            default:
                return <Login goto={goto} />;
        }
    };

    return (
        <AuthLayout cards={currentCards}>
            {renderStep()}
        </AuthLayout>
    );
};

export default LoginRegister;