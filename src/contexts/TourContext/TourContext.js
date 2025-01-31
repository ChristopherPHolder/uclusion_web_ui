import React, { useEffect, useReducer } from 'react';
import {
  getUclusionLocalStorageItem,
  setUclusionLocalStorageItem,
} from '../../components/localStorageUtils';
import { reducer } from './tourContextReducer';
import beginListening from './tourContextMessages'

const EMPTY_CONTEXT = {
  steps: [],
  isVisible: false,
};

const TOUR_CONTEXT_KEY = 'tour_context';

const TourContext = React.createContext(EMPTY_CONTEXT);

function TourProvider(props) {
  const { children } = props;
  const defaultValue = getUclusionLocalStorageItem(TOUR_CONTEXT_KEY) || EMPTY_CONTEXT;
  const [state, dispatch] = useReducer(reducer, defaultValue, undefined);

  useEffect(() => {
    beginListening(dispatch);
    return () => {};
  }, []);

  useEffect(() => {
    setUclusionLocalStorageItem(TOUR_CONTEXT_KEY, state);
  }, [state]);

  return (
    <TourContext.Provider value={[state, dispatch]}>
      {children}
    </TourContext.Provider>
  );
}

export { TourContext, TourProvider };
