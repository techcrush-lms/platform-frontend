import React from 'react';
import Icon from '../ui/Icon';

const ClientMgtTable = () => {
  const subscriptions = [
    {
      id: '0001',
      name: 'Acme Corp',
      email: 'acmecorp@gmail.com',
      date: '2025-01-15',
      service: 'Event',
      status: 'Completed',
    },
    {
      id: '0002',
      name: 'Jane Smith',
      email: 'smithjane@gmail.com',
      date: '2025-01-20',
      service: 'Event',
      status: 'In Progress',
    },
    {
      id: '0003',
      name: 'Robert Johnson',
      email: 'robertjohnson@gmail.com',
      date: '2025-02-11',
      service: 'Course',
      status: 'Pending',
    },
    {
      id: '0004',
      name: 'Sarah Adams',
      email: 'adsarah6@gmail.com',
      date: '2025-02-25',
      service: 'Event',
      status: 'Completed',
    },
    {
      id: '0005',
      name: 'Thomas Garcia',
      email: 'gracia46@gmail.com',
      date: '2025-03-05',
      service: 'Event',
      status: 'In Progress',
    },
    {
      id: '0006',
      name: 'Zeta Group',
      email: 'zetgroup@yahoo.com',
      date: '2025-03-15',
      service: 'Event',
      status: 'Completed',
    },
    {
      id: '0007',
      name: 'Abubakar Lawal',
      email: 'abulaw43@gmail.com',
      date: '2025-03-25',
      service: 'Event',
      status: 'In Progress',
    },
    {
      id: '0008',
      name: 'Mary Aliu',
      email: 'alium76@gmail.com',
      date: '2025-04-10',
      service: 'Course',
      status: 'Completed',
    },
    {
      id: '0009',
      name: 'Adaramola Samuel',
      email: 'smithxm@gmail.com',
      date: '2025-04-20',
      service: 'Event',
      status: 'In Progress',
    },
    {
      id: '0010',
      name: 'Caleb John',
      email: 'johncale@gmail.com',
      date: '2025-04-30',
      service: 'Course',
      status: 'Pending',
    },
    {
      id: '0011',
      name: 'Ayirila Segun',
      email: 'segayirila@gmail.com',
      date: '2025-05-05',
      service: 'Course',
      status: 'Pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='mx-auto'>
      <div className='rounded-lg border border-gray-200 dark:border-black-2 overflow-x-auto dark:bg-gray-800'>
        <table className='w-full divide-y divide-gray-200 dark:divide-black-2 text-black-2 dark:text-white'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                S/N
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Client's Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Email Address
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Services
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-black-2'>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  {sub.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm '>
                  {sub.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm '>
                  {sub.email}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm '>
                  {sub.date}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm '>
                  {sub.service}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
        <div className='text-sm text-gray-500 dark:text-white'>
          Showing <span className='font-medium'>1</span> to{' '}
          <span className='font-medium'>11</span> of{' '}
          <span className='font-medium'>11</span> entries
        </div>
        <div className='flex space-x-2'>
          <button className='px-3 py-1 rounded-md bg-gray-100 border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-700 hover:bg-gray-200'>
            First
          </button>
          <button className='px-3 py-1 rounded-md bg-gray-100 border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-700 hover:bg-gray-200'>
            <Icon
              url='/icons/clients/angle-left.svg'
              className='dark:invert dark:brightness-0'
            />
          </button>
          <span className='px-3 py-1 text-gray-700 border dark:bg-gray-800 dark:border-gray-600 dark:text-white rounded-lg'>
            Page 10 of 100
          </span>
          <button className='px-3 py-1 rounded-md bg-gray-100 border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-700 hover:bg-gray-200'>
            <Icon url='/icons/clients/angle-right.svg' />
          </button>
          <button className='px-3 py-1 rounded-md bg-gray-100 border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-700 hover:bg-gray-200'>
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientMgtTable;
