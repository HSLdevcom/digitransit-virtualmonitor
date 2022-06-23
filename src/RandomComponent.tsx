import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';


const RandomComponent = () => {
  useEffect(() => {
    //fetch('/loginn').then(res => console.log(res));
  }, [])

  return (
    <> <Redirect
      to=
       'http://localhost:3001/loginn'
      
    >asdad</Redirect></>
   
  );
};

export default RandomComponent;
