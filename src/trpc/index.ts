import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
 
export const appRouter = router({
  authCallBack: publicProcedure.query(async ()=>{
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user || !user.id)
        throw new TRPCError({code:'UNAUTHORIZED'})

    // data base check for existing user
    const dbUser = await db.user.findFirst({
        where:{
            id: user.id
        }
    })

    if(!dbUser){
        // create new user
        await db.user.create({
            data:{
                id: user.id,
                email: user.email as string
            }
        })
    }
    return {success: true}
  })
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;