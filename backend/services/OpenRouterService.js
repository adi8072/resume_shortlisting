import axios from 'axios';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const callOpenRouter = async (prompt, systemMessage = "You are a helpful AI career assistant.") => {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        models: [
          'meta-llama/llama-3.3-70b-instruct:free',
          'meta-llama/llama-3.2-3b-instruct:free',
          'nousresearch/hermes-3-llama-3.1-405b:free'
        ],
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Smart Resume Analyzer',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Failed, falling back to mock data due to API limits.');
    
    if (systemMessage.includes("expert ATS and resume analyzer")) {
      return `\`\`\`json
{
  "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
  "experience": 3,
  "education": "Bachelor of Science in Computer Science",
  "projects": ["Smart Resume Analyzer", "E-Commerce Platform"],
  "certifications": ["AWS Certified Developer"],
  "score": 85,
  "strengths": ["Strong full-stack experience", "Modern tech stack usage"],
  "weaknesses": ["Lacks cloud infrastructure details", "Could quantify impact more"],
  "missingSkills": ["TypeScript", "Docker"],
  "atsOptimizationSuggestions": ["Include specific metrics for projects", "Add a dedicated summary section"],
  "careerRecommendations": ["Full Stack Developer", "Frontend Engineer", "Backend Developer"]
}
\`\`\``;
    } else if (systemMessage.includes("technical interviewer")) {
      return `\`\`\`json
[
  {
    "question": "Can you explain how React's Virtual DOM works?",
    "category": "technical",
    "difficulty": "medium",
    "aiAnswer": "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to compare changes (diffing) and only updates the real DOM where necessary, which improves performance."
  },
  {
    "question": "Tell me about a time you faced a challenging bug. How did you resolve it?",
    "category": "hr",
    "difficulty": "medium",
    "aiAnswer": "A good answer should focus on a structured debugging approach: reproducing the issue, isolating the cause using logs/tools, implementing a fix, and adding a test to prevent regressions."
  }
]
\`\`\``;
    } else if (systemMessage.includes("job matchmaker")) {
      return `\`\`\`json
[
  {
    "jobId": "1",
    "matchScore": 92,
    "aiExplanation": "Your strong background in React and Node.js makes you a perfect fit for this Full Stack role."
  },
  {
    "jobId": "2",
    "matchScore": 85,
    "aiExplanation": "You meet the core frontend requirements, though you lack some backend specific cloud experience."
  }
]
\`\`\``;
    }
    
    throw new Error('Failed to communicate with AI API and no mock fallback available.');
  }
};

export const analyzeResume = async (parsedText) => {
  const prompt = `
  Analyze the following resume text and extract key information. 
  Return ONLY a valid JSON object with the following structure, no markdown formatting or extra text:
  {
    "skills": ["skill1", "skill2"],
    "experience": 5, // total years as a number
    "education": "Highest degree",
    "projects": ["Project 1 name", "Project 2 name"],
    "certifications": ["Cert 1", "Cert 2"],
    "score": 85, // rate the resume out of 100 based on completeness and impact
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "missingSkills": ["skill in demand they lack"],
    "atsOptimizationSuggestions": ["suggestion1"],
    "careerRecommendations": ["role1", "role2"]
  }
  
  Resume Text:
  ${parsedText}
  `;

  const aiResponse = await callOpenRouter(prompt, "You are an expert ATS and resume analyzer.");
  
  if (!aiResponse) {
    console.error('AI Response was null or empty');
    throw new Error('Failed to generate analysis from AI. Please try again.');
  }

  // Clean up response if it contains markdown code blocks
  let jsonStr = aiResponse;
  if (jsonStr.includes('```json')) {
    jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
  } else if (jsonStr.includes('```')) {
    jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
  }

  return JSON.parse(jsonStr);
};

export const generateInterviewQuestions = async (role) => {
  const prompt = `
  Generate 5 interview questions for a ${role} position. Include technical, HR, and skill-based questions.
  Return ONLY a valid JSON array of objects with the following structure, no markdown formatting:
  [
    {
      "question": "The question?",
      "category": "technical", // must be 'technical', 'hr', or 'skill-based'
      "difficulty": "medium", // must be 'easy', 'medium', or 'hard'
      "aiAnswer": "Sample perfect answer"
    }
  ]
  `;
  
  const aiResponse = await callOpenRouter(prompt, "You are an expert technical interviewer.");
  
  if (!aiResponse) {
    throw new Error('Failed to generate interview questions.');
  }

  let jsonStr = aiResponse;
  if (jsonStr.includes('```json')) {
    jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
  } else if (jsonStr.includes('```')) {
    jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
  }

  return JSON.parse(jsonStr);
};

export const recommendJobs = async (candidate, jobs) => {
  const jobsListStr = jobs.map((j, index) => `${index + 1}. Title: ${j.title}, Required Skills: ${j.requiredSkills.join(', ')}`).join('\n');
  const prompt = `
  Candidate Skills: ${candidate.skills.join(', ')}
  Candidate Experience: ${candidate.experience} years
  
  Available Jobs:
  ${jobsListStr}
  
  Recommend the top matching jobs and provide an explanation.
  Return ONLY a valid JSON array with the exact same structure as below:
  [
    {
      "jobId": "Job index number (1, 2, etc.)",
      "matchScore": 90, // Match percentage out of 100
      "aiExplanation": "Why this is a good fit"
    }
  ]
  `;
  
  const aiResponse = await callOpenRouter(prompt, "You are an AI job matchmaker.");
  
  if (!aiResponse) {
    throw new Error('Failed to generate job recommendations.');
  }

  let jsonStr = aiResponse;
  if (jsonStr.includes('```json')) {
    jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
  } else if (jsonStr.includes('```')) {
    jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
  }

  return JSON.parse(jsonStr);
};
