import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error, ctx }) {
    const meta = {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
    return meta;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
const isAuth = middleware(async ({ ctx, next }) => {
  return next({
    ctx: {
      session: null,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuth);
