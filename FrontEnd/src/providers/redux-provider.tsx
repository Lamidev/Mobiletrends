'use client';

import React, { Suspense, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '@/store/store';
import { checkAuth } from '@/store/auth-slice';
import AuthListener from '@/components/shopping-view/authListener';
import ScrollToTop from '@/components/common/scroll-to-top';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <AuthListener />
      <Suspense fallback={null}>
        <ScrollToTop />
        {children}
      </Suspense>
    </>
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}
