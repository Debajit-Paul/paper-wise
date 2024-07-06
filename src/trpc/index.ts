import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { AWS } from "@/lib/aws";

const s3 = new AWS.S3();

const BUCKET_NAME =
  process.env.IMAGE_STORAGE_S3_BUCKET ?? "paper-wise-pdf-bucket";
const UPLOADING_TIME_LIMIT = 30;
const UPLOAD_MAX_FILE_SIZE = 1000000;

export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    // data base check for existing user
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // create new user
      await db.user.create({
        data: {
          id: user.id,
          email: user.email as string,
        },
      });
    }
    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file || !file.id) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });

      return file;
    }),
  getPDF: privateProcedure.query(async () => {
    // const { userId } = ctx;
    const pdf = await s3.getSignedUrlPromise("getObject", {
      Bucket: BUCKET_NAME,
      Key: `pdf`,
    });

    return pdf;
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
