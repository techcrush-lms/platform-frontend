"use client"

import Filter from '@/components/Filter'
import PageHeading from '@/components/PageHeading'
import Pagination from '@/components/Pagination'
import useInstantNotification from '@/hooks/page/useInstantNotification'
import React from 'react'
import moment from 'moment';
import { InstantNotification } from '@/types/notification'
import { Avatar } from 'flowbite-react'
import { cn } from '@/lib/utils'
import { markNotificationRead } from '@/redux/slices/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'

enum NotificationTab {
    ALL = 'all',
    READ = 'read',
    UNREAD = 'unread',
}

const NotificationPage = () => {

    const {
        instantNotifications,
        totalInstantNotifications,
        instantNotificationLoading,
        unReadCount,
        onClickNext,
        onClickPrev,
        handleSearchSubmit,
        handleFilterByDateSubmit,
        handleRefresh,
    } = useInstantNotification({ initialLimit: 30, initialType: 'push' });

    const dispatch = useDispatch<AppDispatch>();
    const { org } = useSelector((state: RootState) => state.org);
    const [notificationTab, setNotificationTab] = React.useState<NotificationTab>(NotificationTab.ALL)

    // Filter notifications based on active tab
    const filteredNotifications = React.useMemo(() => {
        switch (notificationTab) {
            case NotificationTab.READ:
                return instantNotifications.filter((n) => n.read === true)
            case NotificationTab.UNREAD:
                return instantNotifications.filter((n) => n.read === false)
            case NotificationTab.ALL:
            default:
                return instantNotifications
        }
    }, [notificationTab, instantNotifications])

    const readCount = instantNotifications.filter((n) => n.read === true).length

    const handleClickNotification = (id: string) => {
        dispatch(markNotificationRead({ id, business_id: org?.id }))
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="section-container">
                <PageHeading
                    title="Notifications"
                    brief="Manage and track all your notifications seamlessly"
                    enableBreadCrumb={true}
                    layer2="Notifications"
                />

                <Filter
                    searchPlaceholder="Search notifications"
                    showPeriod={false}
                    showSearch={true}
                    handleSearchSubmit={handleSearchSubmit}
                    handleFilterByDateSubmit={handleFilterByDateSubmit}
                    handleRefresh={handleRefresh}
                    showRefresh={false}
                    showFilterByDate={false}
                />

                <div className="max-w-4xl mt-12 space-y-12">

                    {/* Tabs */}
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
                        <button
                            className={cn(
                                'flex-1 text-sm font-medium py-2 rounded-lg',
                                notificationTab === NotificationTab.ALL
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 dark:text-gray-300'
                            )}
                            onClick={() => setNotificationTab(NotificationTab.ALL)}
                        >
                            All ({totalInstantNotifications})
                        </button>

                        <button
                            className={cn(
                                'flex-1 text-sm font-medium py-2 rounded-lg',
                                notificationTab === NotificationTab.READ
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 dark:text-gray-300'
                            )}
                            onClick={() => setNotificationTab(NotificationTab.READ)}
                        >
                            Read ({readCount})
                        </button>

                        <button
                            className={cn(
                                'flex-1 text-sm font-medium py-2 rounded-lg',
                                notificationTab === NotificationTab.UNREAD
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 dark:text-gray-300'
                            )}
                            onClick={() => setNotificationTab(NotificationTab.UNREAD)}
                        >
                            Unread ({unReadCount})
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-3">
                        {instantNotificationLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}
                                    className="flex items-start border-b dark:border-gray-600 p-2 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-3"></div>
                                    <div className="flex-1 pb-3">
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                                    <span className="text-gray-400 dark:text-gray-300 text-3xl">🔔</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    No Notifications
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    You don’t have any {notificationTab.toLowerCase()} notifications right now.
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification: InstantNotification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleClickNotification(notification.id)}
                                    className="cursor-pointer flex items-start border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 p-2">
                                    <Avatar
                                        img={notification.icon_url || '/favicon.ico'}
                                        alt="Notification"
                                        className="mr-3"
                                    />
                                    <div className="flex-1 pb-3">
                                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-1.5">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {notification.title}
                                            </span>{' '}
                                            – {notification.message}
                                        </div>

                                        <div className="flex items-center gap-2 justify-between">
                                            <div className="text-xs font-medium text-primary-600 dark:text-primary-500">
                                                {moment(notification.created_at).fromNow()}
                                            </div>
                                            {!notification.read && (
                                                <div className="size-2 rounded-full bg-[#27BE69]"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>


                    {/* Pagination */}
                    {!instantNotificationLoading && (
                        <Pagination
                            noMoreNextPage={filteredNotifications.length === 0}
                            total={totalInstantNotifications}
                            onClickNext={onClickNext}
                            onClickPrev={onClickPrev}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}

export default NotificationPage
