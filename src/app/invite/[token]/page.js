'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import useAuthStore from '@/store/auth/authStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const InvitePage = () => {
    const { token } = useParams();
    const router = useRouter();

    useAuth({ requireAuth: true }); // Redirects to login if not authenticated
    const { isLoading: isAuthLoading } = useAuthStore();

    const [inviteInfo, setInviteInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        if (isAuthLoading || !token) return;

        const load = async () => {
            try {
                const res = await fetch(`/api/admin/invites/token/${token}`, { credentials: 'include' });
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || 'Invite not found');
                }
                setInviteInfo(data.invite);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [token, isAuthLoading]);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const res = await fetch(`/api/admin/invites/token/${token}`, {
                method: 'POST',
                credentials: 'include',
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to accept invite');
            }
            showSuccessToast(`You've joined ${result.organizationName}`);
            router.push('/home');
        } catch (err) {
            showErrorToast(err.message || 'Failed to accept invite');
        } finally {
            setIsAccepting(false);
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900'>
                <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
            </div>
        );
    }

    if (error || !inviteInfo) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen gap-2 bg-gray-50 dark:bg-neutral-900 px-4 text-center'>
                <h1 className='text-lg font-medium text-neutral-700 dark:text-white'>Invite not found</h1>
                <p className='text-sm text-neutral-400'>{error}</p>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900 px-4'>
            <div className='w-full max-w-sm bg-white dark:bg-neutral-800 rounded-xl border border-stroke-200 dark:border-neutral-700 shadow-lg p-6 sm:p-8 text-center'>
                <h1 className='text-lg font-semibold text-neutral-800 dark:text-white mb-1'>
                    Join {inviteInfo.organizationName}
                </h1>
                <p className='text-sm text-neutral-500 dark:text-neutral-300 mb-6'>
                    You&apos;ve been invited as <span className='font-medium'>{inviteInfo.role}</span>.
                </p>

                {inviteInfo.isUsed ? (
                    <p className='text-sm text-red-500'>This invite has already been used.</p>
                ) : inviteInfo.isExpired ? (
                    <p className='text-sm text-red-500'>This invite has expired.</p>
                ) : (
                    <button
                        onClick={handleAccept}
                        disabled={isAccepting}
                        className='w-full h-10 rounded-lg bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
                    >
                        {isAccepting ? 'Joining...' : 'Accept invite'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InvitePage;