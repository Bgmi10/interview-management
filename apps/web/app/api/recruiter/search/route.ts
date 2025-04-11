import { prisma } from "db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { skills } = await req.json();

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json({ message: "Missing or invalid skills array" }, { status: 400 });
  }

  try {
    // Get all candidates
    const candidates = await prisma.user.findMany({
      where: {
        role: "Candidate" // Only get users with Candidate role
      },
      select: {
        id: true,
        skills: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        profilePic: true,
        experience: true,
        specilization: true,
        industry: true,
      }
    });

    // Normalize search skills to lowercase for consistent comparison
    const normalizedSearchSkills = skills.map(skill => skill.toLowerCase());

    // Calculate match scores for each candidate
    const candidatesWithScores = candidates.map(candidate => {
      // Ensure candidate.skills exists and is an array, and normalize to lowercase
      const candidateSkills = Array.isArray(candidate.skills) 
        ? candidate.skills.map(skill => skill.toLowerCase())
        : [];
      
      // Calculate exact matches (skills that appear in both arrays)
      const exactMatches = normalizedSearchSkills.filter(skill => 
        candidateSkills.includes(skill)
      );
      
      // Calculate related matches (partial matches or skills that might be related)
      const relatedMatches = normalizedSearchSkills.filter(skill => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.includes(skill) || skill.includes(candidateSkill)
        ) && !exactMatches.includes(skill) // Don't count exact matches twice
      );
      
      // Calculate score: exact matches are worth more than related matches
      const score = (exactMatches.length * 10) + (relatedMatches.length * 3);
      
      return {
        ...candidate,
        matchDetails: {
          exactMatches,
          relatedMatches,
          totalExactMatches: exactMatches.length,
          totalRelatedMatches: relatedMatches.length,
          score
        }
      };
    });

    // Sort candidates by score (highest first)
    const sortedCandidates = candidatesWithScores.sort(
      (a, b) => b.matchDetails.score - a.matchDetails.score
    );
    
    // Filter out candidates with no matches at all
    const matchedCandidates = sortedCandidates.filter(
      candidate => candidate.matchDetails.score > 0
    );

    return NextResponse.json({
      message: "Success",
      data: matchedCandidates,
      totalMatches: matchedCandidates.length,
      searchedSkills: skills
    }, { status: 200 });
  } catch (e) {
    console.error("Error in skill matching:", e);
    return NextResponse.json({ message: "Server error occurred" }, { status: 500 });
  }
}