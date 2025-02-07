import { prisma } from "db";
import { CronJob } from "cron";

export const cleanupJob = new CronJob('*/5 * * * *', async () => {
    const now = new Date();
    await prisma.otp.deleteMany({ 
        where: { 
            expTime: {
                lt: now
            }
        }
    })
});

cleanupJob.start();

