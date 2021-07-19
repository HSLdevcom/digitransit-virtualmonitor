import React, { FC, useEffect, useState } from 'react';
import { IView } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import monitorAPI from '../api';

interface IProps {
  views: Array<IView>;
}

const TranslationContainer : FC<IProps> = ({views}) => {
  useEffect(() => {
    monitorAPI.getTranslations(['1010']).then(x => console.log(x))
  });
  return <CarouselDataContainer views={views} />
}

export default TranslationContainer;