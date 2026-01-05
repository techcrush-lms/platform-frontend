'use client';

import React, { useState } from 'react';
import SidebarNav from './sidebar/SidebarNav';
import Topbar from './topbar/Topbar';

const Bar = () => {
  return (
    <div>
      <SidebarNav />
      <Topbar />
    </div>
  );
};

export default Bar;
