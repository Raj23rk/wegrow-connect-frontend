import { API_BASE as GLOBAL_API_BASE } from './config';
import QRCode from 'qrcode';

// Primary endpoints
const LOCAL_API_BASE = 'http://localhost:4000/api/v1/diwali-challenge';
const RENDER_API_BASE = `${GLOBAL_API_BASE}/diwali-challenge`;

const STORAGE_KEY_SUBMISSIONS = 'wegrow_diwali_challenge_submissions';
const STORAGE_KEY_ENROLLMENTS = 'wegrow_diwali_challenge_enrollments';

// 20 Standard Challenge Questions Fallback
export const DEFAULT_CHALLENGE_QUESTIONS = [
  {
    id: 1,
    category: 'Logic & Problem Solving',
    question: 'If you have an unsorted list of 1,000 numbers, what is the best algorithm to find a specific number in the worst case if you sort it first?',
    options: [
      'Linear Search - O(N)',
      'Binary Search - O(log N)',
      'Bubble Search - O(N²)',
      'Exponential Search - O(N!)'
    ],
    correctOption: 1,
    marks: 5
  },
  {
    id: 2,
    category: 'Logic & Reasoning',
    question: 'Which number comes next in the mathematical pattern: 2, 6, 12, 20, 30, ___?',
    options: ['38', '40', '42', '46'],
    correctOption: 2,
    marks: 5
  },
  {
    id: 3,
    category: 'Web Fundamentals',
    question: 'What is the primary role of HTML in modern web development?',
    options: [
      'Styling and animations',
      'Providing structure and semantic markup for web content',
      'Querying database tables',
      'Compiling machine code'
    ],
    correctOption: 1,
    marks: 5
  },
  {
    id: 4,
    category: 'CSS Layouts',
    question: 'Which modern CSS layout module is designed specifically for 1-dimensional layouts (single row or column)?',
    options: ['Flexbox', 'CSS Grid', 'Table Layout', 'Absolute Float'],
    correctOption: 0,
    marks: 5
  },
  {
    id: 5,
    category: 'JavaScript Basics',
    question: 'Which keyword in modern JavaScript declares a variable whose reference cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    correctOption: 2,
    marks: 5
  },
  {
    id: 6,
    category: 'JavaScript Concepts',
    question: 'What is the output of the expression `console.log(2 + "2")` in JavaScript?',
    options: ['4', '"22"', 'NaN', 'TypeError'],
    correctOption: 1,
    marks: 5
  },
  {
    id: 7,
    category: 'Python Basics',
    question: 'Which data structure in Python is ordered, mutable, and initialized with square brackets `[]`?',
    options: ['Tuple', 'List', 'Set', 'Dictionary'],
    correctOption: 1,
    marks: 5
  },
  {
    id: 8,
    category: 'Data Structures',
    question: 'Which data structure operates strictly on the Last-In, First-Out (LIFO) principle?',
    options: ['Queue', 'Linked List', 'Stack', 'Graph'],
    correctOption: 2,
    marks: 5
  },
  {
    id: 9,
    category: 'Web APIs',
    question: 'What does the standard HTTP status code 200 signify in web communication?',
    options: [
      'Bad Request',
      'Unauthorized',
      'OK / Successful Request',
      'Internal Server Error'
    ],
    correctOption: 2,
    marks: 5
  },
  {
    id: 10,
    category: 'Algorithms',
    question: 'What is the worst-case time complexity of searching an element in a sorted array using Binary Search?',
    options: ['O(N)', 'O(log N)', 'O(N²)', 'O(1)'],
    correctOption: 1,
    marks: 5
  },
  {
    id: 11,
    category: 'Database & SQL',
    question: 'Which standard SQL statement is used to fetch and filter records from a database table?',
    options: ['FETCH', 'SELECT', 'GET', 'RETRIEVE'],
    correctOption: 1,
    marks: 5
  },
  {
    id: 12,
    category: 'Git & Version Control',
    question: 'Which Git command creates a new feature branch and immediately switches your workspace to it?',
    options: [
      'git checkout -b <branch-name>',
      'git branch -create <name>',
      'git merge <name>',
      'git commit -m'
    ],
    correctOption: 0,
    marks: 5
  },
  {
    id: 13,
    category: 'Artificial Intelligence',
    question: 'What is the fundamental difference between traditional programming and Machine Learning (ML)?',
    options: [
      'Traditional programming uses Python; ML only uses HTML',
      'ML algorithms learn patterns and rules directly from training data rather than explicit hand-coded rules',
      'Machine Learning does not use mathematical calculations',
      'Traditional programming only runs on supercomputers'
    ],
    correctOption: 1,
    marks: 5
  },
  {
    id: 14,
    category: 'Generative AI',
    question: 'In Generative AI systems (like ChatGPT, Gemini, or Claude), what is a "Prompt"?',
    options: [
      'The GPU fan cooling system',
      'A syntax error code',
      'The natural language instruction or query given by a user to direct the AI model',
      'The binary code of neural layers'
    ],
    correctOption: 2,
    marks: 5
  },
  {
    id: 15,
    category: 'Data Science & Python',
    question: 'Which popular open-source Python library is standard for tabular data manipulation and DataFrame analysis?',
    options: ['Pandas', 'Flask', 'Pygame', 'Bootstrap'],
    correctOption: 0,
    marks: 5
  },
  {
    id: 16,
    category: 'Computer Networks',
    question: 'What is the primary role of the Domain Name System (DNS) on the internet?',
    options: [
      'Compressing image files for faster downloads',
      'Translating human-friendly domain names (e.g. wegrowbschool.in) into machine IP addresses',
      'Preventing laptop batteries from draining',
      'Boosting Wi-Fi antenna speeds'
    ],
    correctOption: 1,
    marks: 5
  },
  {
    id: 17,
    category: 'Cloud Computing',
    question: 'Which of the following is a leading global Cloud Computing infrastructure provider?',
    options: [
      'AWS (Amazon Web Services)',
      'Adobe Acrobat Reader',
      'VLC Media Player',
      'Notepad++'
    ],
    correctOption: 0,
    marks: 5
  },
  {
    id: 18,
    category: 'Cybersecurity',
    question: 'Why is Two-Factor Authentication (2FA / OTP) strongly recommended for user accounts?',
    options: [
      'It adds an extra security barrier by requiring two separate forms of identity verification',
      'It doubles internet bandwidth speed',
      'It automatically formats the computer hard disk',
      'It silences incoming notifications'
    ],
    correctOption: 0,
    marks: 5
  },
  {
    id: 19,
    category: 'Modern Web Engineering',
    question: 'What is React.js primarily utilized for in contemporary software development?',
    options: [
      'Building dynamic, interactive, and modular user interfaces with reactive state',
      'Writing kernel device drivers for printer hardware',
      'Soldering electrical semiconductor circuits',
      'Configuring network fiber cables'
    ],
    correctOption: 0,
    marks: 5
  },
  {
    id: 20,
    category: 'Agile & Tech Leadership',
    question: 'What is the primary advantage of the Agile software development methodology?',
    options: [
      'Iterative delivery in sprints with frequent feedback and continuous improvement',
      'Building the entire project for years without getting user feedback',
      'Eliminating the need to write unit and integration tests',
      'Canceling team standups permanently'
    ],
    correctOption: 0,
    marks: 5
  }
];

// Helper to make fetch with localhost -> fallback to render -> fallback to offline mock
async function fetchWithFallback(endpoint, options = {}) {
  // Try localhost:4000 first if running locally
  const urlsToTry = [
    `${LOCAL_API_BASE}${endpoint}`,
    `${RENDER_API_BASE}${endpoint}`
  ];

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Continue to next URL
    }
  }
  return null;
}

export const diwaliChallengeApi = {
  // 1. Fetch 20 Quiz Questions
  getQuestions: async () => {
    const remoteData = await fetchWithFallback('/questions');
    if (remoteData && remoteData.success && remoteData.data) {
      return remoteData.data;
    }

    // Offline / Local Mock Fallback
    return {
      totalQuestions: DEFAULT_CHALLENGE_QUESTIONS.length,
      marksPerQuestion: 5,
      totalMarks: 100,
      passingCutoff: 80,
      questions: DEFAULT_CHALLENGE_QUESTIONS
    };
  },

  // 2. Student Enrollment Form (Scan Poster QR)
  enroll: async (studentData) => {
    const payload = {
      studentName: studentData.studentName?.trim() || studentData.name?.trim() || '',
      email: studentData.email?.trim().toLowerCase() || '',
      mobileNo: studentData.mobileNo?.trim() || '',
      collegeOrSchool: studentData.collegeOrSchool?.trim() || studentData.college?.trim() || '',
      courseInterested: studentData.courseInterested || 'Full Stack Web & Cloud Development',
      preferredCampus: studentData.preferredCampus || 'WeGrow Sivakasi Campus'
    };

    // Check if student already submitted in local storage
    try {
      const storedSubmissions = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
      const existing = storedSubmissions.find((s) => s.email === payload.email);
      if (existing) {
        return {
          success: true,
          alreadySubmitted: true,
          message: 'Welcome back! You have already completed this challenge.',
          data: existing
        };
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    const remoteData = await fetchWithFallback('/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (remoteData && remoteData.success) {
      return remoteData;
    }

    // Save student enrollment offline
    try {
      const enrollments = JSON.parse(localStorage.getItem(STORAGE_KEY_ENROLLMENTS) || '[]');
      enrollments.unshift({ ...payload, enrolledAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY_ENROLLMENTS, JSON.stringify(enrollments));
    } catch (e) {
      console.warn('LocalStorage enrollment save error:', e);
    }

    return {
      success: true,
      message: 'Student enrollment successful! Challenge unlocked.',
      data: {
        student: payload,
        totalQuestions: 20,
        marksPerQuestion: 5,
        totalMarks: 100,
        passingCutoff: 80,
        timeLimitMinutes: 20
      }
    };
  },

  // 3. Submit Answers (Array of { questionId: 1..20, selectedOption: 0..3 })
  submitAnswers: async (email, answers) => {
    const cleanEmail = email.trim().toLowerCase();

    const remoteData = await fetchWithFallback('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, answers })
    });

    if (remoteData && remoteData.success && remoteData.data) {
      // Also cache to local storage
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
        stored.unshift({ ...remoteData.data, email: cleanEmail });
        localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(stored));
      } catch {}
      return remoteData;
    }

    // Offline Evaluation Fallback:
    let correctCount = 0;
    DEFAULT_CHALLENGE_QUESTIONS.forEach((q) => {
      const ansObj = answers.find((a) => a.questionId === q.id);
      if (ansObj && ansObj.selectedOption === q.correctOption) {
        correctCount += 1;
      }
    });

    const score = correctCount * 5; // Total marks out of 100
    const isQualifiedForDemo = score >= 80;
    const demoTicketCode = `WGW-${isQualifiedForDemo ? 'DEMO' : 'SCHOLAR'}-${Math.floor(10000 + Math.random() * 90000)}`;

    let qrCodeDataUrl = '';
    try {
      const passUrl = `https://www.wegrowbschool.in/diwali-challenge?voucher=${encodeURIComponent(demoTicketCode)}&email=${encodeURIComponent(cleanEmail)}`;
      qrCodeDataUrl = await QRCode.toDataURL(passUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#1e1b4b', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      });
    } catch {}

    const result = {
      score,
      correctCount,
      totalQuestions: 20,
      maxScore: 100,
      isQualifiedForDemo,
      demoTicketCode,
      qrCodeDataUrl,
      rewardDetails: {
        title: isQualifiedForDemo
          ? '1-Week Free Live Demo Batch Access'
          : '10% Course Scholarship Pass',
        scholarship: isQualifiedForDemo
          ? '₹5,000 Direct Fee Waiver on Course Admission'
          : 'Flat 10% Fee Waiver on Course Admission',
        location: 'WeGrow B-School Sivakasi & Srivilliputtur Campus',
        schedule: 'Upcoming Batch: Starts Every Monday (9:30 AM & 6:00 PM)',
        instructions: 'Present this digital pass or QR code at reception to activate your batch access.'
      }
    };

    // Store in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
      stored.unshift({
        ...result,
        id: 'sub_' + Date.now(),
        email: cleanEmail,
        isRedeemed: false,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(stored));
    } catch {}

    return {
      success: true,
      message: isQualifiedForDemo
        ? `Outstanding! You scored ${score}/100 and unlocked a 1-Week Free Live Demo Batch!`
        : `Challenge completed! You scored ${score}/100 and unlocked a 10% Course Scholarship!`,
      data: result
    };
  },

  // 4. Campus Desk: Verify Demo Ticket Code or QR scan
  verifyTicket: async (ticketCode) => {
    const cleanCode = ticketCode.trim().toUpperCase();
    const remoteData = await fetchWithFallback(`/verify-ticket/${cleanCode}`);
    if (remoteData && remoteData.success) {
      return remoteData;
    }

    // Local check
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
      const found = stored.find(
        (s) => s.demoTicketCode === cleanCode || s.voucherCode === cleanCode
      );
      if (found) {
        return {
          success: true,
          data: {
            ticketCode: cleanCode,
            isRedeemed: found.isRedeemed || false,
            student: {
              name: found.studentName || found.name || 'Student',
              email: found.email || '',
              mobileNo: found.mobileNo || '',
              collegeOrSchool: found.collegeOrSchool || found.college || '',
              courseInterested: found.courseInterested || '',
              score: found.score || 0,
              correctCount: found.correctCount || 0
            },
            benefit: {
              title: found.rewardDetails?.title || (found.isQualifiedForDemo ? '1-Week Free Live Demo Batch' : '10% Course Scholarship'),
              isQualified: found.isQualifiedForDemo ?? (found.score >= 80)
            }
          }
        };
      }
    } catch {}

    return {
      success: false,
      message: `No active ticket found with code: ${cleanCode}`
    };
  },

  // 5. Campus Desk: Activate 1-Week Free Demo Pass
  redeemTicket: async (ticketCode, staffNote = '') => {
    const cleanCode = ticketCode.trim().toUpperCase();
    const remoteData = await fetchWithFallback('/redeem-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode: cleanCode, staffNote })
    });

    if (remoteData && remoteData.success) {
      return remoteData;
    }

    // Local check and update
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
      const found = stored.find(
        (s) => s.demoTicketCode === cleanCode || s.voucherCode === cleanCode
      );
      if (found) {
        found.isRedeemed = true;
        found.redeemedAt = new Date().toISOString();
        found.staffNote = staffNote;
        localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(stored));
        return {
          success: true,
          message: `Demo Ticket ${cleanCode} successfully redeemed for ${found.studentName || found.name || 'Student'}!`,
          data: {
            studentName: found.studentName || found.name || 'Student',
            redeemedAt: found.redeemedAt
          }
        };
      }
    } catch {}

    return {
      success: false,
      message: `Ticket ${cleanCode} not found for redemption.`
    };
  },

  // 6. Admin: View All Submissions & Scores
  getSubmissions: async ({
    search = '',
    course = '',
    isQualified = '',
    page = 1,
    limit = 20
  } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (course) params.append('course', course);
    if (isQualified !== '') params.append('isQualified', isQualified);
    params.append('page', page);
    params.append('limit', limit);

    const remoteData = await fetchWithFallback(`/admin/submissions?${params.toString()}`);
    if (remoteData && remoteData.success) {
      return remoteData;
    }

    // Local fallback
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
      let filtered = [...stored];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name?.toLowerCase().includes(q) ||
            s.studentName?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q) ||
            s.mobileNo?.includes(q) ||
            s.collegeOrSchool?.toLowerCase().includes(q) ||
            s.demoTicketCode?.toLowerCase().includes(q)
        );
      }
      if (isQualified !== '') {
        const boolVal = isQualified === 'true' || isQualified === true;
        filtered = filtered.filter((s) => (s.isQualifiedForDemo ?? s.score >= 80) === boolVal);
      }

      return {
        success: true,
        data: {
          submissions: filtered,
          total: filtered.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(filtered.length / limit))
        }
      };
    } catch {
      return { success: true, data: { submissions: [], total: 0, page: 1, totalPages: 1 } };
    }
  }
};
