'use client';

import React from 'react';
import { groups, sidebarLinks } from '@/constants';

import { Sidebar } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn, SystemRole } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const SidebarMenu = ({ handleClose }: { handleClose?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  let { profile, loading } = useSelector((state: RootState) => state.auth);

  const groupOneSidebarLinks = sidebarLinks.filter(
    (sidebarLink) =>
      sidebarLink.group === groups.ONE &&
      sidebarLink.roleOptions.includes(profile?.role?.role_id as SystemRole)
  );
  const groupTwoSidebarLinks = sidebarLinks.filter(
    (sidebarLink) =>
      sidebarLink.group === groups.TWO &&
      sidebarLink.roleOptions.includes(profile?.role?.role_id as SystemRole)
  );

  const handleNavigation = (route: string) => {
    router.push(route);
    if (typeof handleClose === 'function') handleClose();
  };

  return (
    <>
      <Sidebar
        className='mt-6 md:mt-0'
        aria-label='Sidebar menu for core features'
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <p className='text-xs uppercase'>Main menu</p>
            {groupOneSidebarLinks.map((sidebarLink) =>
              sidebarLink.items ? (
                <Sidebar.Collapse
                  key={sidebarLink.route}
                  icon={sidebarLink.icon}
                  label={sidebarLink.label}
                >
                  {sidebarLink.items.map((item) => (
                    <Sidebar.Item
                      key={item.route}
                      onClick={() => handleNavigation(item.route)}
                      className={cn(
                        'cursor-pointer',
                        pathname.includes(item.route) &&
                          'bg-gray-200 dark:bg-gray-700' // Active class
                      )}
                    >
                      {item.label}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>
              ) : (
                <Sidebar.Item
                  key={sidebarLink.route}
                  onClick={() => handleNavigation(sidebarLink.route)}
                  icon={sidebarLink.icon}
                  className={cn(
                    'cursor-pointer',
                    pathname.includes(sidebarLink.route) &&
                      'bg-gray-200 dark:bg-gray-700' // Active class
                  )}
                >
                  {sidebarLink.label}
                </Sidebar.Item>
              )
            )}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <p className='text-xs uppercase'>Supports</p>

            {groupTwoSidebarLinks.map((sidebarLink) =>
              sidebarLink.items ? (
                <Sidebar.Collapse
                  key={sidebarLink.route}
                  icon={sidebarLink.icon}
                  label={sidebarLink.label}
                >
                  {sidebarLink.items.map((item) => (
                    <Sidebar.Item
                      key={item.route}
                      onClick={() => handleNavigation(item.route)}
                      className={cn(
                        'cursor-pointer',
                        pathname.includes(item.route) &&
                          'bg-gray-200 dark:bg-gray-700' // Active class
                      )}
                    >
                      {item.label}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>
              ) : (
                <Sidebar.Item
                  key={sidebarLink.route}
                  onClick={() => handleNavigation(sidebarLink.route)}
                  icon={sidebarLink.icon}
                  className={cn(
                    'cursor-pointer',
                    pathname.includes(sidebarLink.route) &&
                      'bg-gray-200 dark:bg-gray-700' // Active class
                  )}
                >
                  {sidebarLink.label}
                </Sidebar.Item>
              )
            )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default SidebarMenu;
