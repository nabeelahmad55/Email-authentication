import {
  createCallerFactory,
  createTRPCRouter,
  baseProcedure,
} from "~/server/trpc/main";
import { submitCreatorApplication } from "~/server/trpc/procedures/submitCreatorApplication";
import { submitAmbassadorApplication } from "~/server/trpc/procedures/submitAmbassadorApplication";
import { subscribeEmail } from "~/server/trpc/procedures/subscribeEmail";
import { submitHostApplication } from "~/server/trpc/procedures/submitHostApplication";
import { initialSignup } from "~/server/trpc/procedures/initialSignup";
import { platformConnection } from "~/server/trpc/procedures/platformConnection";

export const appRouter = createTRPCRouter({
  submitCreatorApplication,
  submitAmbassadorApplication,
  subscribeEmail,
  submitHostApplication,
  initialSignup,
  platformConnection,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
