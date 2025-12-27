"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Login from "@/components/templates/login-register/Login";
import Register from "@/components/templates/login-register/Register";
import ForgetPassword from '@/components/templates/login-register/ForgetPassword';
import ResetPassword from '@/components/templates/login-register/ResetPassword';
import ResetSuccess from '@/components/templates/login-register/ResetSuccess';
import AuthLayout from '@/components/layouts/Auth/AuthLayout';

import { sharedCards } from '@/data/login-register/sharedCards';

const LoginRegister = () => {
    const searchParams = useSearchParams();
    const [step, setStep] = useState('login');

    useEffect(() => {
        const stepParam = searchParams.get('step');
        const tokenParam = searchParams.get('token');

        if (stepParam === 'reset' && tokenParam) {
            setStep('reset');
        } else if (stepParam && ['login', 'register', 'forget', 'reset', 'reset-success'].includes(stepParam)) {
            setStep(stepParam);
        }
    }, [searchParams]);

    const cardsForSteps = {
        login: [sharedCards.lineChart, sharedCards.testimonial, sharedCards.barChart],
        register: [sharedCards.testimonial, sharedCards.barChart, sharedCards.feature],
        forget: [sharedCards.barChart, sharedCards.feature, sharedCards.testimonial],
        reset: [sharedCards.feature, sharedCards.freeStorageUpTo, sharedCards.testimonial],
        'reset-success': [sharedCards.lineChart, sharedCards.testimonial, sharedCards.barChart],
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