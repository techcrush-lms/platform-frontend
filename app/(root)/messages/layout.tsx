'use client';

import ChatSidebar from '@/components/dashboard/chat/ChatSidebar';
import React from 'react';

const MessageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <main className='section-container'>
        <div className='flex flex-col md:flex-row gap-2 md:h-[85vh]'>
          <ChatSidebar />
          {children}
        </div>
      </main>
    </>
  );
};

export default MessageLayout;
