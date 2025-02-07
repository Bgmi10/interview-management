import { prisma } from "db";
import { CronJob } from "cron";

const cleanupJob = new CronJob('*/1 * * * *', async () => {
    console.log("1 min")
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

