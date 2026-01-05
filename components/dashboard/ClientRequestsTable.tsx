import { Dropdown } from 'flowbite-react';
import { HiDotsVertical } from 'react-icons/hi';

interface ClientRequest {
  id: string;
  name: string;
  date: string;
  content: string;
  status: string;
}

interface ClientRequestsTableProps {
  requests: ClientRequest[];
}

export function ClientRequestsTable({ requests }: ClientRequestsTableProps) {
  return (
    <div className='overflow-x-auto'>
      <div className='rounded-lg border border-gray-200 dark:border-black-2 overflow-x-auto dark:bg-gray-800'>
        <table className='w-full divide-y divide-gray-200 dark:divide-black-2'>
          <thead>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider rounded-tl-lg'>
                S/N
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Client's Name
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Date
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Content
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider rounded-tr-lg'>
                Status
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider rounded-tr-lg'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {requests?.map((request, index) => (
              <tr
                key={request.id}
                className={
                  index === requests.length - 1 ? 'last:rounded-b-lg' : ''
                }
              >
                <td
                  className={`px-4 py-3 whitespace-nowrap text-sm font-medium  ${
                    index === requests.length - 1 ? 'rounded-bl-lg' : ''
                  }`}
                >
                  {request.id}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-sm '>
                  {request.name}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-sm '>
                  {request.date}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-sm '>
                  {request.content}
                </td>
                <td
                  className={`px-4 py-3 whitespace-nowrap ${
                    index === requests.length - 1 ? 'rounded-br-lg' : ''
                  }`}
                >
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      request.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  <Dropdown
                    label=''
                    dismissOnClick={false}
                    placement='left-start'
                    renderTrigger={() => (
                      <span className='cursor-pointer'>
                        <HiDotsVertical />
                      </span>
                    )}
                  ></Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
