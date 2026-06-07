"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// این صفحه کاربر رو redirect میکنه
// اگه paper doc داره → آخرین doc
// اگه نداره → یک doc جدید میسازه
const PaperDocIndexPage = () => {
    const router = useRouter();

    useEffect(() => {
        const initPaperDoc = async () => {
            try {
                // سعی کن آخرین paper doc رو پیدا کن
                const response = await fetch('/api/files/paper', {
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.success && data.files?.length > 0) {
                    // برو به آخرین paper doc
                    router.replace(`/paper-doc/${data.files[0].id}`);
                } else {
                    // paper doc نداره، یکی بساز
                    const createResponse = await fetch('/api/files/paper', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ name: 'Untitled Document' }),
                    });
                    const createData = await createResponse.json();
                    if (createData.success) {
                        router.replace(`/paper-doc/${createData.file.id}`);
                    }
                }
            } catch (error) {
                console.error('Error initializing paper doc:', error);
            }
        };

        initPaperDoc();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
};

export default PaperDocIndexPage;