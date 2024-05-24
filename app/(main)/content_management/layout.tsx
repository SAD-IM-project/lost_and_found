import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-full h-screen'>
            {/* Header */}
            <header className='w-full h-[10%]'>
                {/* Your header content goes here */}
                <div className='w-[100%] h-full bg-sky-800'></div>
            </header>

            {/* Main content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer>
                {/* Your footer content goes here */}
            </footer>
        </div>
    );
};