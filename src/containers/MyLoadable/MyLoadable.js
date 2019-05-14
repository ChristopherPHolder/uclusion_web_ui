import React from 'react';
import Loadable from 'react-loadable';
import LoadingComponent from '../../components/LoadingComponent';

export default function makeLoadable(opts, preloadComponents) {
  return Loadable.Map({
    loader: {
      Component: opts.loader,
    },
    loading: LoadingComponent,
    render(loaded, props) {
      if (preloadComponents !== undefined && preloadComponents instanceof Array) {
        preloadComponents.map(component => component.preload());
      }

      const Component = loaded.Component.default;

      return <div><Component {...props} /></div>;
    },
  });
}
