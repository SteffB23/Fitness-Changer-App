import React from 'react';
import { format } from 'date-fns';

export function Clock() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center text-gray-400 text-sm">
      <div>{format(time, 'EEEE, MMMM d, yyyy')}</div>
      <div>{format(time, 'h:mm:ss a')}</div>
    </div>
  );
}