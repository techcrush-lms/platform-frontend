import React from 'react';

const Badge = ({ color, text }: { color: string; text: string }) => {
  return (
    <div>
      <span
        className={`bg-${color}-100 text-${color}-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300`}
      >
        {text}
      </span>
    </div>
  );
};

export default Badge;
