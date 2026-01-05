import React from 'react';

interface TableEndRecordSchema {
  colspan?: number;
  text?: string;
}
const TableEndRecord = ({
  colspan = 6,
  text = "You've reached the end. Click the previous button to go back.",
}: TableEndRecordSchema) => {
  return (
    <>
      <tr>
        <td
          colSpan={colspan}
          className='text-center py-4 text-gray-500 dark:text-gray-400'
        >
          {text}
        </td>
      </tr>
    </>
  );
};

export default TableEndRecord;
