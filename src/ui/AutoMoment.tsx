import React, { FC, useState, useEffect } from 'react';
import { DateTime } from 'luxon';

const AutoMoment: FC = () => {
  const [time, setTime] = useState(new Date().getTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const dt = DateTime.fromMillis(time);
  const hours = dt.toFormat('HH');
  const minutes = dt.toFormat('mm');
  return (
    <time>
      {hours}
      <span>:</span>
      {minutes}
    </time>
  );
};

export default AutoMoment;
