import { NextResponse } from "next/server";

const mockUsers = [
    {
        id: 1,
        name: 'Ruben Amorim',
        email: 'rubenamorim@gmail.com',
        avatar: '/images/nav_img.png',
    },
    {
        id: 2,
        name: 'Ruben Onsu',
        email: 'rubenonsu@gmail.com',
        avatar: '/images/nav_img.png'
    },
    {
        id: 3,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        avatar: '/images/nav_img.png'
    },
    {
        id: 4,
        name: 'Mike Wilson',
        email: 'mike.wilson@gmail.com',
        avatar: '/images/nav_img.png'
    }
];

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.toLowerCase() || '';

        // شبیه‌سازی تاخیر شبکه (برای تست حالت لودینگ)
        // await new Promise(resolve => setTimeout(resolve, 500));

        // فیلتر کردن کاربران
        const filteredUsers = query
            ? mockUsers.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            )
            : [];

        // برگرداندن نتیجه به صورت JSON
        return NextResponse.json(filteredUsers);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}