"use client";
import styles from '@/styles/login-register.module.css';
import { useEffect, useState } from "react";

import Login from "@/components/templates/login-register/Login";
import Register from "@/components/templates/login-register/Register";
import ForgetPassword from '@/components/templates/login-register/ForgetPassword';
import ResetPassword from '@/components/templates/login-register/ResetPassword ';
import ResetSuccess from '@/components/templates/login-register/ResetSuccess ';
import AuthLayout from '@/components/layouts/Auth/AuthLayout';

import { sharedCards } from '@/data/login-register/sharedCards';


const login_register = () => {
    const [step, setStep] = useState('login');

    // اینجا میخوام مشخص کنم هرکدام از مسیرها چه Card هایی داشته باشند 
    const cardsForSteps = {
        login: [sharedCards.lineChart, sharedCards.testimonial, sharedCards.barChart],
        register: [sharedCards.testimonial, sharedCards.barChart, sharedCards.feature],
        forget: [sharedCards.barChart, sharedCards.freeStorageUpTo, sharedCards.testimonial],
        reset: [sharedCards.feature, sharedCards.freeStorageUpTo, sharedCards.testimonial],
        success: [sharedCards.lineChart, sharedCards.testimonial, sharedCards.barChart],
    }

    // اینجا برای هر مسیر میام کارت هاشو بهش اختصاص میدم
    const currentCards = cardsForSteps[step]

    const renderStep = () => {
        switch (step) {
            case 'login':
                return <Login goto={setStep} />;

            case 'register':
                return <Register goto={setStep} />;

            case 'forget':
                return <ForgetPassword goto={setStep} />;

            case 'reset':
                return <ResetPassword goto={setStep} />;

            case 'success':
                return <ResetSuccess goto={setStep} />;
            default:
                return <Login goto={setStep} />;
        }
    };

    return (
        <AuthLayout cards={currentCards}>
            {renderStep()}
        </AuthLayout>
    )
}

export default login_register;

