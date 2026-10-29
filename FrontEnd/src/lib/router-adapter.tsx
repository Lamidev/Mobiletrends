'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from 'next/navigation';

export function useNavigate() {
  const router = useNextRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') {
        window.history.go(to);
      }
    } else {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
}

export function useLocation() {
  const pathname = useNextPathname() || '/';
  const searchParams = useNextSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : '';
  return {
    pathname,
    search,
    hash: '',
    state: null,
    key: 'default',
  };
}

export function useSearchParams(): [URLSearchParams, (nextInit: any, navigateOptions?: { replace?: boolean }) => void] {
  const router = useNextRouter();
  const searchParams = useNextSearchParams();
  const pathname = useNextPathname();

  const currentParams = searchParams ? new URLSearchParams(searchParams.toString()) : new URLSearchParams();

  const setSearchParams = (
    nextInit: URLSearchParams | string | Record<string, string>,
    navigateOptions?: { replace?: boolean }
  ) => {
    const queryString =
      typeof nextInit === 'string'
        ? nextInit.startsWith('?')
          ? nextInit.slice(1)
          : nextInit
        : nextInit instanceof URLSearchParams
        ? nextInit.toString()
        : new URLSearchParams(nextInit).toString();

    const target = `${pathname}?${queryString}`;
    if (navigateOptions?.replace) {
      router.replace(target);
    } else {
      router.push(target);
    }
  };

  return [currentParams, setSearchParams];
}

export function useParams() {
  const params = useNextParams();
  return (params || {}) as Record<string, string>;
}

export function Link({
  to,
  href,
  children,
  className,
  ...props
}: any) {
  const dest = to || href || '#';
  return (
    <NextLink href={dest} className={className} {...props}>
      {children}
    </NextLink>
  );
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useNextRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
}

export function useMatch() {
  return null;
}

