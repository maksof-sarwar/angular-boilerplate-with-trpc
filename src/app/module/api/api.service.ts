import { fromFetch } from 'rxjs/fetch';
import { inject, InjectionToken, Provider } from '@angular/core';
import type { AppRouter } from '@server';
import { createTRPCProxyClient, httpBatchLink, httpLink } from '@trpc/client';
import { injectToken } from './token.service';
import { environment } from '@environmet';

const TRPC_PROVIDER = new InjectionToken<
  ReturnType<typeof createTRPCProxyClient<AppRouter>>
>('__TRPC_PROVIDER__');

export const injectClient = () => inject(TRPC_PROVIDER);
export const provideClient = (): Provider => ({
  provide: TRPC_PROVIDER,
  useFactory: () => {
    const token = injectToken();
    return createTRPCProxyClient<AppRouter>({
      links: [
        httpLink({
          url: environment.apiUrl,
          async fetch(url, options) {
            const response = await fetch(url, {
              ...options,
              credentials: 'include',
            });
            if (!response.ok) {
              try {
                const json = await response.json();
                const message = json[0].error.message;
                if (message === 'TOKEN_EXPIRED') {
                  const refreshUrl = `${environment.apiUrl}/auth.accessToken?batch=1&input={}`;
                  const refreshResponse = await fetch(refreshUrl, {
                    credentials: 'include',
                  });
                  const refreshJson = await refreshResponse.json();
                  const accessToken = refreshJson[0].result.data.token;
                  token.setAccessToken(accessToken);

                  return await fetch(url, {
                    ...options,
                    credentials: 'include',
                    headers: {
                      ...options?.headers,
                      Authorization: accessToken,
                    },
                  });
                }
              } catch (error) {
                throw error;
              }
            }
            return response;
          },
          headers() {
            return {
              Authorization: token.getAccessToken(),
            };
          },
        }),
      ],
    });
  },
});
