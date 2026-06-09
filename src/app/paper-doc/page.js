"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PaperDocIndexPage = () => {
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Try to find existing paper docs
                const response = await fetch('/api/files/paper', {
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.success && data.files?.length > 0) {
                    // Go to most recently updated doc
                    router.replace(`/paper-doc/${data.files[0].id}`);
                } else {
                    // No docs exist, create one
                    const createResponse = await fetch('/api/files/paper', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ name: 'Untitled Document' }),
                    });
                    const createData = await createResponse.json();

                    if (createData.success) {
                        router.replace(`/paper-doc/${createData.file.id}`);
                    } else {
                        setError('Failed to create document');
                    }
                }
            } catch (err) {
                console.error('Error initializing paper doc:', err);
                setError('Something went wrong');
            }
        };

        init();
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
};

export default PaperDocIndexPage;