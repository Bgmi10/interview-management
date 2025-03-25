import { prisma } from "db";
import { verifyToken } from "../auth/utils/authutils";
import { NextResponse } from "next/server";
import { User } from "../types/user";

export async function GET(req: Request) {
    try {
        //@ts-ignore
        const cookies = req.cookies || {};
        const user = verifyToken(cookies) as User;

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const fetchUserData = async () => {
            try {
                const commonFields = {
                    email: true,
                    firstName: true,
                    lastName: true,
                    profilePic: true,
                    linkedIn: true,
                    phoneNumber: true,
                    role: true,
                    id: true
                };

                let userData;
                let totalFields = 0;
                let filledFields = 0;

                if (user.role === "Candidate") {
                    userData = await prisma.user.findUnique({
                        where: { email: user.email },
                        select: {
                            ...commonFields,
                            resume: true,
                            portfolioUrl: true,
                            collageName: true,
                            skills: true,
                            experience: true,
                            specilization: true,
                            jobApplications: true,
                        },
                    });

                    const fieldsToCheck = [
                        userData?.firstName,
                        userData?.lastName,
                        userData?.phoneNumber,
                        userData?.profilePic,
                        userData?.linkedIn,
                        userData?.resume,
                        userData?.portfolioUrl,
                        userData?.collageName,
                        userData?.skills?.length ? "filled" : null,
                        userData?.experience,
                        userData?.specilization,
                    ];

                    totalFields = fieldsToCheck.length;
                    filledFields = fieldsToCheck.filter(field => field && field !== "").length;

                } else if (user.role === "Recruiter") {
                    userData = await prisma.user.findUnique({
                        where: { email: user.email },
                        select: {
                            ...commonFields,
                            companyLocation: true,
                            companyLogo: true,
                            companyName: true,
                            experience: true,
                            industry: true,
                            jobPosts: {
                                include: {
                                    applications: {
                                        include: {
                                            candidate: {
                                                select: {
                                                    lastName: true,
                                                    firstName: true,
                                                    email: true,
                                                    experience: true,
                                                    linkedIn: true,
                                                    phoneNumber: true,
                                                    portfolioUrl: true,
                                                    resume: true,
                                                    skills: true,
                                                    profilePic: true,
                                                    collageName: true,
                                                    specilization: true,
                                                    updatedAt: true,
                                                    createdAt: true,
                                                }
                                            },

                                        }
                                    },
                                }
                            },
                            companyWebsiteUrl: true,
                        },
                    });

                    const fieldsToCheck = [
                        userData?.firstName,
                        userData?.lastName,
                        userData?.phoneNumber,
                        userData?.profilePic,
                        userData?.linkedIn,
                        userData?.companyLocation,
                        userData?.companyLogo,
                        userData?.companyName,
                        userData?.experience,
                        userData?.industry,
                        userData?.companyWebsiteUrl,
                    ];

                    totalFields = fieldsToCheck.length;
                    filledFields = fieldsToCheck.filter(field => field && field !== "").length;
                } else {
                    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
                }

                const completionPercentage = Math.round((filledFields / totalFields) * 100);

                return NextResponse.json({ 
                    message: "success", 
                    data: userData, 
                    profileCompletion: completionPercentage 
                }, { status: 200 });

            } catch (error) {
                console.error("Error fetching user data:", error);
                return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
            }
        };

        return await fetchUserData();
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { 
      phoneNumber, profilePic, companyName, companyWebsiteUrl, 
      companyLocation, industry, linkedIn, resume, portfolioUrl, 
      skills, experience, collageName, lastName, firstName
    } = await req.json();
    
    //@ts-ignore
    const cookies = req.cookies;
    
    // Add error handling for token verification
    const user = verifyToken(cookies) as User | null;
    
    // Check if user is null before proceeding
    if (!user || !user.email) {
      return NextResponse.json(
        { message: "Unauthorized or invalid token" }, 
        { status: 401 }
      );
    }

    try {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          phoneNumber,
          profilePic,
          companyName,
          companyLocation,
          industry,
          linkedIn,
          resume,
          portfolioUrl,
          skills,
          collageName,
          experience,
          companyWebsiteUrl,
          firstName,
          lastName
        },
      });
      
      return NextResponse.json({ message: "User updated" }, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ message: "error while updating user" }, { status: 500 });
    }
  }