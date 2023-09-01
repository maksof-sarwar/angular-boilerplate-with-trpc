import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from './src/api/router';
import Server from './src/server';

new Server();

export { createContext } from './src/api/context';
export { appRouter, type AppRouter } from './src/api/router';
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
