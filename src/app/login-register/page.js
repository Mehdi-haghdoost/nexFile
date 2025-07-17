"use client";
import styles from '@/styles/login-register.module.css';
import { useState } from "react";

import Login from "@/components/templates/login-register/Login";
import Register from "@/components/templates/login-register/Register";
import ForgetPassword from '@/components/templates/login-register/ForgetPassword';
import ResetPassword from '@/components/templates/login-register/ResetPassword ';
import ResetSuccess from '@/components/templates/login-register/ResetSuccess ';
import AuthLayout from '@/components/layouts/Auth/AuthLayout';


const login_register = () => {
    const [step, setStep] = useState('login');

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
                return < Login goto={setStep} />;
        }
    };

    return (
        <AuthLayout>
            {renderStep()}
        </AuthLayout>
    )
}

export default login_register;

