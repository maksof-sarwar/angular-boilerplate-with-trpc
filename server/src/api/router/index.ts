import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const appRouter = router({
  health: publicProcedure.input(z.object({ i: z.string() })).query(() => {
    return {
      status: 'healthy',
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
