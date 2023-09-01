import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';

interface CreateContextOptions extends CreateExpressContextOptions {
  session?: null;
}

const createInnerTRPCContext = (opts: Partial<CreateContextOptions>) => {
  return {
    ...opts,
  };
};

export const createContext = async (opts: CreateExpressContextOptions) => {
  const { req, res } = opts;
  return createInnerTRPCContext({
    req,
    res,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
