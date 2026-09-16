import { useEffect, useState } from 'react';
import api from './services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  college: '',
  bio: '',
};

const demoStudents = [
  { id: 'maya', name: 'Maya Patel', college: 'Design Institute', department: 'Interaction Design', availability: 'Weekday evenings', skills: [{ id: 'maya-1', name: 'UI/UX', level: 'Advanced' }, { id: 'maya-2', name: 'Canva', level: 'Advanced' }] },
  { id: 'arjun', name: 'Arjun Mehta', college: 'Tech University', department: 'Computer Science', availability: 'Mon, Wed & Fri', skills: [{ id: 'arjun-1', name: 'React', level: 'Advanced' }, { id: 'arjun-2', name: 'JavaScript', level: 'Intermediate' }] },
  { id: 'zoe', name: 'Zoe Williams', college: 'Central College', department: 'English Literature', availability: 'Weekend mornings', skills: [{ id: 'zoe-1', name: 'English', level: 'Advanced' }, { id: 'zoe-2', name: 'Public Speaking', level: 'Intermediate' }] },
  { id: 'dev', name: 'Dev Sharma', college: 'Engineering College', department: 'Data Science', availability: 'Tue & Thu afternoons', skills: [{ id: 'dev-1', name: 'Python', level: 'Advanced' }, { id: 'dev-2', name: 'Data Analysis', level: 'Intermediate' }] },
  { id: 'sofia', name: 'Sofia Garcia', college: 'Creative Arts University', department: 'Visual Communication', availability: 'Weekday mornings', skills: [{ id: 'sofia-1', name: 'Canva', level: 'Advanced' }, { id: 'sofia-2', name: 'Branding', level: 'Intermediate' }] },
  { id: 'liam', name: 'Liam Chen', college: 'City University', department: 'Software Engineering', availability: 'Saturday afternoons', skills: [{ id: 'liam-1', name: 'Java', level: 'Advanced' }, { id: 'liam-2', name: 'Algorithms', level: 'Intermediate' }] },
];

const demoCommunitySkills = [
  { id: 'skill-react', user_id: 'arjun', user_name: 'Arjun Mehta', name: 'React', category: 'Development', description: 'Building clean, responsive web interfaces.' },
  { id: 'skill-python', user_id: 'dev', user_name: 'Dev Sharma', name: 'Python', category: 'Programming', description: 'From fundamentals to practical automation.' },
  { id: 'skill-canva', user_id: 'sofia', user_name: 'Sofia Garcia', name: 'Canva', category: 'Design', description: 'Creating polished social and presentation assets.' },
  { id: 'skill-java', user_id: 'liam', user_name: 'Liam Chen', name: 'Java', category: 'Programming', description: 'Object-oriented programming and problem solving.' },
  { id: 'skill-uiux', user_id: 'maya', user_name: 'Maya Patel', name: 'UI/UX', category: 'Design', description: 'Friendly interfaces, wireframes, and user flows.' },
  { id: 'skill-english', user_id: 'zoe', user_name: 'Zoe Williams', name: 'English', category: 'Language', description: 'Writing confidence and conversational practice.' },
];


const demoRequests = [];

const getStoredRequests = () => {
  try {
    const savedRequests = JSON.parse(localStorage.getItem('skillswap-swap-requests') || 'null');
    if (Array.isArray(savedRequests)) return savedRequests;
    localStorage.setItem('skillswap-swap-requests', JSON.stringify(demoRequests));
    return demoRequests;
  } catch {
    return demoRequests;
  }
};

const defaultProfile = {
  name: 'Alex Johnson',
  email: 'alex@college.edu',
  department: 'iMSC(IT)',
  skillsOffered: 'React, JavaScript',
  skillsWanted: 'UI/UX, Python',
  availability: 'Weekday evenings',
};
const translations = {
  English: {
    about: "About",
    settings: "Settings",
    dashboard: "Dashboard",
    logout: "Logout",
    addSkill: "Add Skill",
    mySkills: "My Skills",
    communitySkills: "Community Skills",
    swapRequests: "Swap Requests",
    students: "Students",
    notifications: "Notifications"
  },

  Gujarati: {
    about: "અમારા વિશે",
    settings: "સેટિંગ્સ",
    dashboard: "ડેશબોર્ડ",
    logout: "લોગઆઉટ",
    addSkill: "સ્કિલ ઉમેરો",
    mySkills: "મારી સ્કિલ્સ",
    communitySkills: "કોમ્યુનિટી સ્કિલ્સ",
    swapRequests: "સ્વેપ રિક્વેસ્ટ",
    students: "વિદ્યાર્થીઓ",
    notifications: "નોટિફિકેશન"
  },

  Hindi: {
    about: "हमारे बारे में",
    settings: "सेटिंग्स",
    dashboard: "डैशबोर्ड",
    logout: "लॉगआउट",
    addSkill: "स्किल जोड़ें",
    mySkills: "मेरी स्किल्स",
    communitySkills: "कम्युनिटी स्किल्स",
    swapRequests: "स्वैप रिक्वेस्ट",
    students: "स्टूडेंट्स",
    notifications: "नोटिफिकेशन"
  }
};

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [dashboardView, setDashboardView] = useState('dashboard');
  const [profile, setProfile] = useState(() => {
  try {
    const savedProfile = JSON.parse(localStorage.getItem("skillswap-profile") || "null");
    return savedProfile || {
      ...defaultProfile,
      name: user?.name || defaultProfile.name,
      email: user?.email || defaultProfile.email,
    };
  } catch {
    return defaultProfile;
  }
});


  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem("skillswap-settings")) || {
      notifications: true,
      language: "English",
      darkMode: false,
    };
  });
  const t = translations[settings.language];
  const [users, setUsers] = useState(demoStudents);
  const [skills, setSkills] = useState(demoCommunitySkills);
  const [requests, setRequests] = useState(getStoredRequests);
  const [form, setForm] = useState(initialForm);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', level: '', description: '' });
  const [mySkills, setMySkills] = useState(() => JSON.parse(localStorage.getItem('skillswap-my-skills') || '[]'));
  const [studentSearch, setStudentSearch] = useState('');
  const [communitySearch, setCommunitySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "🎉 Welcome to SkillSwap AI!", read: false },
    { id: 2, text: "📚 Arjun Mehta added a React skill.", read: false },
    { id: 3, text: "🔄 Maya Patel sent you a swap request.", read: false },
  ]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const isForgotPassword = authMode === 'forgot';

  // Load the dashboard data after login.
  const fetchDashboard = async () => {
    if (!token) return;
    if (token === 'skillswap-demo-token') {
      setUsers(demoStudents);
      setSkills(demoCommunitySkills);
      setRequests(getStoredRequests());
      return;
    }

    try {
      const [usersRes, skillsRes, requestsRes, profileRes] = await Promise.all([
        api.get('/users'),
        api.get('/skills'),
        api.get('/requests'),
        api.get('/auth/me'),
      ]);

      setUsers(usersRes.data || []);
      setSkills(skillsRes.data || []);
      setRequests(requestsRes.data || []);
      setUser(profileRes.data.user);
      localStorage.setItem('user', JSON.stringify(profileRes.data.user));
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
      setError('Could not load the dashboard. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [showToast]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillFieldChange = (event) => {
    const { name, value } = event.target;
    setSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (authMode === 'login') {
      const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

      if (!hasValidEmail || form.password.length < 6) {
        setError('Enter a valid email and a password with at least 6 characters.');
        setLoading(false);
        return;
      }

      const savedAccount = JSON.parse(localStorage.getItem('skillswap-demo-account') || 'null');
      const demoUser = savedAccount?.email === form.email ? {
        id: savedAccount.id,
        name: savedAccount.name,
        email: savedAccount.email,
        college: savedAccount.college,
        bio: savedAccount.bio,
      } : {
        id: 'demo-user',
        name: form.email.split('@')[0].replace(/[._-]/g, ' '),
        email: form.email,
        college: 'SkillSwap community',
        bio: 'Exploring new skills with SkillSwap AI.',
      };

      localStorage.setItem('token', 'skillswap-demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      setToken('skillswap-demo-token');
      setForm(initialForm);
      setLoading(false);
      return;
    }

    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!form.name.trim() || !hasValidEmail || form.password.length < 6) {
      setError('Enter your full name, a valid email, and a password with at least 6 characters.');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    const demoUser = {
      id: `demo-${Date.now()}`,
      name: form.name.trim(),
      email: form.email,
      college: form.college.trim() || 'SkillSwap community',
      bio: 'Ready to learn, teach, and trade skills.',
    };

    localStorage.setItem('skillswap-demo-account', JSON.stringify({ ...demoUser, password: form.password }));
    localStorage.setItem('token', 'skillswap-demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    setToken('skillswap-demo-token');
    setForm(initialForm);
    setLoading(false);
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSuccess('If an account exists for that email, a reset link is on its way.');
  };

  const changeAuthPage = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccess('');
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const newSkill = { id: `my-skill-${Date.now()}`, ...skillForm };
    const updatedSkills = [newSkill, ...mySkills];
    setMySkills(updatedSkills);
    localStorage.setItem('skillswap-my-skills', JSON.stringify(updatedSkills));
    setSkillForm({ name: '', category: '', level: '', description: '' });
    setSuccess('Skill added to your profile!');
  };

  const handleRequestSwap = async (selectedSkill) => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (token === 'skillswap-demo-token') {
      const newRequest = {
        id: `request-${Date.now()}`,
        requester_name: 'You',
        target_name: selectedSkill.user_name,
        skill_offered: selectedSkill.name,
        skill_wanted: 'Your skill',
        message: `You requested a skill swap with ${selectedSkill.user_name} for ${selectedSkill.name}.`,
        status: 'Pending',
      };
      setRequests((prev) => {
        const updatedRequests = [...prev, newRequest];
        localStorage.setItem('skillswap-swap-requests', JSON.stringify(updatedRequests));
        return updatedRequests;
      });
      setSuccess('Demo swap request sent!');
      setToastMessage(`Swap request sent to ${selectedSkill.user_name}! 🎉`);
setShowToast(true);

setTimeout(() => {
  setShowToast(false);
}, 3000);
      if (settings.notifications) {
  setNotifications((prev) => [
    {
      id: Date.now(),
      text: `🔄 Swap request sent to ${selectedSkill.user_name} for ${selectedSkill.name}.`,
      read: false,
    },
    ...prev,
  ]);
}
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/requests', {
        targetId: selectedSkill.user_id,
        message: 'Hi! I would like to swap skills with you.',
      });

      setRequests((prev) => {
        const updatedRequests = [...prev, response.data];
        localStorage.setItem('skillswap-swap-requests', JSON.stringify(updatedRequests));
        return updatedRequests;
      });
      setSuccess('Swap request sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send swap request.');
    } finally {
      setLoading(false);
    }
  };

 const handleRequestDecision = (requestId, status) => {
  const updatedRequests = requests.map((request) =>
    request.id === requestId
      ? { ...request, status }
      : request
  );

  setRequests(updatedRequests);
  localStorage.setItem(
    "skillswap-swap-requests",
    JSON.stringify(updatedRequests)
  );

  setToastMessage(`🎉 Swap request ${status}!`);
  setShowToast(true);

  if (settings.notifications) {
    setNotifications((prev) => [
      {
        id: Date.now(),
        text: `🎉 Swap request ${status}!`,
        read: false,
      },
      ...prev,
    ]);
  }

  setSuccess(`Swap request ${status}!`);
};

  const handleClearSwapRequests = () => {
    setRequests([]);
    localStorage.setItem('skillswap-swap-requests', JSON.stringify([]));
  };

  const handleClearMySkills = () => {
    setMySkills([]);
    localStorage.removeItem('skillswap-my-skills');
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((previousProfile) => ({ ...previousProfile, [name]: value }));
  };

  const handleSettingsChange = (e) => {
  const { name, value, checked, type } = e.target;

  setSettings((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleSettingsSave = () => {
  localStorage.setItem("skillswap-settings", JSON.stringify(settings));

  if (!settings.notifications) {
    setShowNotifications(false);
  }

  setSuccess("Settings saved successfully!");
};

const handleProfileSave = (event) => {
  event.preventDefault();

  localStorage.setItem("skillswap-profile", JSON.stringify(profile));

  const updatedUser = {
    ...user,
    name: profile.name,
    email: profile.email,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  setUser(updatedUser);
  setSuccess("Profile changes saved!");
};

  const filteredCommunitySkills = skills.filter((skill) => {
  const query = communitySearch.trim().toLowerCase();
  if (!query) return true;

  return (
    skill.name.toLowerCase().includes(query) ||
    skill.user_name.toLowerCase().includes(query)
  );
  });
  const aiMatches = mySkills.flatMap((mySkill) => {
  return skills
    .filter(
      (skill) =>
        skill.name.toLowerCase() !== mySkill.name.toLowerCase()
    )
    .slice(0, 3)
    .map((skill) => ({
      student: skill.user_name,
      skill: skill.name,
      reason: `Because you added ${mySkill.name}, this is a great skill to swap with.`,
    }));
  });
  const filteredStudents = users.filter((member) => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return true;
    return member.name.toLowerCase().includes(query)
      || member.skills?.some((skill) => skill.name.toLowerCase().includes(query));
  });
  const completedSwaps = requests.filter(
  (request) => request.status === "Accepted"
).length;

const profileCompletion =
  profile.name &&
  profile.email &&
  profile.skillsOffered &&
  profile.skillsWanted
    ? 100
    : 75;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setUsers([]);
    setSkills([]);
    setRequests([]);
    setForm(initialForm);
    setAuthMode('login');
    setError('');
    setSuccess('');
  };

  if (!token || !user) {
    return (
      <main className="auth-page">
        <div className="auth-orb auth-orb-one" aria-hidden="true" />
        <div className="auth-orb auth-orb-two" aria-hidden="true" />
        <div className="container auth-container">
          <div className="row align-items-center justify-content-center g-5">
            <section className="col-lg-6 d-none d-lg-block text-white auth-intro">
              <div className="brand-mark mb-4"><span>↗</span></div>
              <p className="eyebrow text-white-50">COLLEGE COMMUNITY, REIMAGINED</p>
              <h1>Learn what you love.<br /><span>Teach what you know.</span></h1>
              <p className="intro-copy">SkillSwap AI connects curious students to share skills, build projects, and grow together.</p>
              <div className="d-flex gap-4 mt-4">
                <div><strong>500+</strong><small>student creators</small></div>
                <div><strong>120+</strong><small>skills exchanged</small></div>
              </div>
            </section>
            <section className="col-lg-5 col-md-8 col-sm-10">
              <div className="auth-card">
                <div className="text-center mb-4">
                  <div className="brand-mark brand-mark-mobile d-lg-none mx-auto mb-3"><span>↗</span></div>
                  <p className="eyebrow mb-2">WELCOME TO SKILLSWAP AI</p>
                  <h2>{isForgotPassword ? 'Reset your password' : authMode === 'login' ? 'Welcome back!' : 'Create your account'}</h2>
                  <p className="auth-subtitle">{isForgotPassword ? 'Enter your email and we’ll send you a reset link.' : authMode === 'login' ? 'Sign in and keep your learning in motion.' : 'Join a community that learns together.'}</p>
                </div>

                {!isForgotPassword ? <div className="auth-tabs mb-4" role="tablist" aria-label="Authentication options">
                  {['login', 'register'].map((mode) => (
                    <button key={mode} type="button" role="tab" aria-selected={authMode === mode}
                      className={authMode === mode ? 'active' : ''}
                      onClick={() => changeAuthPage(mode)}>
                      {mode === 'login' ? 'Log in' : 'Register'}
                    </button>
                  ))}
                </div> : <button type="button" className="back-to-login mb-4" onClick={() => changeAuthPage('login')}>← Back to login</button>}

                {error ? <div className="alert alert-danger py-2 small">{error}</div> : null}
                {success ? <div className="alert alert-success py-2 small">{success}</div> : null}

                {isForgotPassword ? (
                  <form onSubmit={handleResetSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="resetEmail">Email address</label>
                      <input id="resetEmail" type="email" className="form-control" placeholder="you@college.edu" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} required />
                    </div>
                    <button className="btn auth-submit w-100 mt-4" type="submit">Reset Password <span aria-hidden="true">→</span></button>
                  </form>
                ) : <form onSubmit={handleAuthSubmit}>
                  {authMode === 'register' ? (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="fullName">Full name</label>
                      <input id="fullName" className="form-control" placeholder="Alex Johnson" name="name" value={form.name} onChange={handleFieldChange} required />
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input id="email" type="email" className="form-control" placeholder="you@college.edu" name="email" value={form.email} onChange={handleFieldChange} required />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label" htmlFor="password">Password</label>
                      {authMode === 'login' ? <button type="button" className="forgot-link" onClick={() => changeAuthPage('forgot')}>Forgot password?</button> : null}
                    </div>
                    <input id="password" type="password" className="form-control" placeholder="Enter your password" name="password" value={form.password} onChange={handleFieldChange} required />
                  </div>

                  {authMode === 'register' ? (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                      <input id="confirmPassword" type="password" className="form-control" placeholder="Re-enter your password" name="confirmPassword" value={form.confirmPassword} onChange={handleFieldChange} required />
                    </div>
                  ) : null}

                  {authMode === 'register' ? (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label" htmlFor="college">College <span>optional</span></label>
                        <input id="college" className="form-control" placeholder="Your university or college" name="college" value={form.college} onChange={handleFieldChange} />
                      </div>
                    </div>
                  ) : null}

                  <button className="btn auth-submit w-100 mt-4" type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : authMode === 'login' ? 'Log in to SkillSwap' : 'Create My Account'} <span aria-hidden="true">→</span>
                  </button>
                </form>}
                <p className="terms text-center mb-0 mt-4">{isForgotPassword ? 'Remembered your password? ' : authMode === 'register' ? <>Already a member? </> : 'New to SkillSwap? '}{isForgotPassword || authMode === 'register' ? <button type="button" className="inline-link" onClick={() => changeAuthPage('login')}>Log in</button> : <button type="button" className="inline-link" onClick={() => changeAuthPage('register')}>Register</button>}{authMode === 'register' && !isForgotPassword ? <><br /><span className="d-inline-block mt-2">By joining, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</span></> : null}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (dashboardView === 'profile') {
    return (
      <div className={`min-vh-100 ${settings.darkMode ? "dark-theme" : "bg-light"}`}>
       
        <nav className="navbar dashboard-navbar shadow-sm">
          <div className="container">
            <a className="navbar-brand fw-bold" href="#">SkillSwap AI</a>
            <div className="d-flex align-items-center gap-2">
              <button className="btn profile-nav-button" onClick={() => setDashboardView('dashboard')}>Dashboard</button>
              <button className="btn dashboard-logout" onClick={handleLogout}>Logout <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </nav>
        <main className="container py-4 py-md-5 profile-page">
          <div className="row justify-content-center">
            <div className="col-xl-9">
              <div className="profile-hero mb-4">
                <div className="profile-avatar">{profile.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="skill-category mb-1">STUDENT PROFILE</p>
                  <h1>{profile.name}</h1>
                  <p className="mb-0">Shape your SkillSwap experience.</p>
                </div>
              </div>
              <form onSubmit={handleProfileSave}>
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                      <div><h2 className="h4 mb-1">Profile details</h2><p className="text-muted small mb-0">Keep your student profile up to date.</p></div>
                      <div className="d-flex align-items-center gap-2">
                        {success ? <span className="profile-saved">Saved</span> : null}
                        <button className="btn clear-requests-button" type="button" onClick={() => document.getElementById('profileName')?.focus()}>Edit Profile</button>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6"><label className="form-label" htmlFor="profileName">Student name</label><input id="profileName" className="form-control" name="name" value={profile.name} onChange={handleProfileChange} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="profileEmail">Email</label><input id="profileEmail" type="email" className="form-control" name="email" value={profile.email} onChange={handleProfileChange} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="profileDepartment">Department</label><input id="profileDepartment" className="form-control" name="department" value={profile.department} onChange={handleProfileChange} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="profileAvailability">Availability</label><input id="profileAvailability" className="form-control" name="availability" value={profile.availability} onChange={handleProfileChange} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="profileOffered">Skills offered</label><textarea id="profileOffered" className="form-control" rows="3" name="skillsOffered" value={profile.skillsOffered} onChange={handleProfileChange} required /></div>
                      <div className="col-md-6"><label className="form-label" htmlFor="profileWanted">Skills wanted</label><textarea id="profileWanted" className="form-control" rows="3" name="skillsWanted" value={profile.skillsWanted} onChange={handleProfileChange} required /></div>
                    </div>
                    <div className="d-flex justify-content-end mt-4"><button className="btn auth-submit profile-save-button" type="submit">Save Changes <span aria-hidden="true">→</span></button></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
  if (dashboardView === 'about') {
    
  return (
    <div className={`min-vh-100 ${settings.darkMode ? "dark-theme" : "bg-light"}`}>
      <nav className="navbar dashboard-navbar shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold">SkillSwap AI</a>
          <button
            className="btn profile-nav-button"
            onClick={() => setDashboardView('dashboard')}
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      <main className="container py-5">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h2 className="text-center mb-3">💜 About SkillSwap AI</h2>
          <p className="text-center text-muted">
            SkillSwap AI is a student-to-student learning platform where students
            can exchange skills, connect with peers, and grow together.
          </p>

          <hr />

          <h4>📚 What can you do?</h4>
          <ul>
            <li>Add your skills.</li>
            <li>Request skill swaps with other students.</li>
            <li>Get AI-based skill recommendations.</li>
            <li>Track completed swaps and profile progress.</li>
          </ul>

          <hr />

          <h4>❓ Frequently Asked Questions</h4>

          <p><strong>1. What is SkillSwap AI?</strong></p>
          <p>A platform where college students teach and learn skills from each other.</p>

          <p><strong>2. Is SkillSwap AI free?</strong></p>
          <p>Yes. It is completely free for students.</p>

          <p><strong>3. How do I request a swap?</strong></p>
          <p>Click the Request Swap button in Community Skills.</p>

          <p><strong>4. How does AI Match work?</strong></p>
          <p>It recommends students based on the skills you add.</p>

          <hr />

          <h4>📧 Contact Us</h4>
          <p>Email: support@skillswap.ai</p>
          <p>College: JG University</p>

          <div className="text-center mt-4">
            <button
              className="btn add-skill-button"
              onClick={() => setDashboardView('dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
  if (dashboardView === 'settings') {
  return (
    <div className={`min-vh-100 ${settings.darkMode ? "dark-theme" : "bg-light"}`}>
      <nav className="navbar dashboard-navbar shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold">SkillSwap AI</a>

          <button
            className="btn profile-nav-button"
            onClick={() => setDashboardView('dashboard')}
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      <main className="container py-5">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h2 className="mb-4 text-center">⚙️ Settings</h2>

          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleSettingsChange}
            />
            <label className="form-check-label ms-2">
              Enable Notifications
            </label>
          </div>

          <div className="mb-4">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              name="language"
              value={settings.language}
              onChange={handleSettingsChange}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
            </select>
          </div>

          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleSettingsChange}
            />
            <label className="form-check-label ms-2">
              Dark Mode (Demo)
            </label>
          </div>

          <div className="text-center">
            <button
              className="btn add-skill-button"
              onClick={handleSettingsSave}
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
  return (
    <div className={`min-vh-100 ${settings.darkMode ? "dark-theme" : "bg-light"}`}>
      {showToast && (
      <div className="toast-popup">
        {toastMessage}
      </div>
      )}
      <nav className="navbar dashboard-navbar shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">SkillSwap AI</a>
          <div className="d-flex align-items-center gap-2 dashboard-header-actions">
            <div className="dashboard-user-summary">
  <strong>{user.name}</strong>
  <small>{user.email}</small>
</div>

<button
  className="btn profile-nav-button"
  onClick={() => setDashboardView("about")}
>
  {t.about}
</button>

<button
  className="btn profile-nav-button"
  onClick={() => setDashboardView("settings")}
>
  {t.settings}
</button>
<button className="btn dashboard-logout" onClick={handleLogout}>
  {t.logout} <span aria-hidden="true">→</span>
</button>

<div className="position-relative">
  <button
  className="btn profile-icon"
  onClick={() => {
    if (!settings.notifications) return;
    setShowNotifications(!showNotifications);
  }}
>
  🔔
</button>
  {showNotifications && settings.notifications && (
    <div className="notification-box">
      <h6>Notifications</h6>

      {notifications.length === 0 ? (
        <p className="small m-0">No notifications</p>
      ) : (
        notifications.map((item) => (
          <div key={item.id} className="notification-item">
            {item.text}
          </div>
        ))
      )}
    </div>
  )}
</div>

<button
  className="btn profile-icon"
  onClick={() => setDashboardView("profile")}
>
  {user.name?.charAt(0).toUpperCase()}
</button>

<button className="btn dashboard-logout" onClick={handleLogout}>
  Logout <span aria-hidden="true">→</span>
</button>
          </div>
        </div>
      </nav>

      
        <div className="container py-4">
          <div className="row g-3 mb-4">

  <div className="col-md-4">
    <div className="progress-card">
      <h6>📚 Skills Added</h6>
      <h2>{mySkills.length}</h2>
      <p>Total skills you have shared.</p>
    </div>
  </div>

  <div className="col-md-4">
    <div className="progress-card">
      <h6>🔄 Swaps Completed</h6>
      <h2>{completedSwaps}</h2>
      <p>Accepted swap requests.</p>
    </div>
  </div>

  <div className="col-md-4">
    <div className="progress-card">
      <h6>⭐ Profile Completion</h6>
      <h2>{profileCompletion}%</h2>
      <p>Your SkillSwap profile status.</p>
    </div>
  </div>

</div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="mb-0">{user.name}</h5>
                      <small className="text-muted">{user.college || 'Student'}</small>
                    </div>
                  </div>

                  <p className="text-muted">{user.bio || 'No bio yet. Add one in your profile.'}</p>

                  <div className="small text-secondary">
                    <div>Email: {user.email}</div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mt-4">
                <div className="card-body">
                  <h5 className="mb-3">Add a skill</h5>
                  <form onSubmit={handleSkillSubmit}>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Skill name"
                        name="name"
                        value={skillForm.name}
                        onChange={handleSkillFieldChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <select
                        className="form-select"
                        name="level"
                        value={skillForm.level}
                        onChange={handleSkillFieldChange}
                        required
                      >
                        <option value="" disabled>Skill level</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Category"
                        name="category"
                        value={skillForm.category}
                        onChange={handleSkillFieldChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        placeholder="Short description"
                        name="description"
                        rows="3"
                        value={skillForm.description}
                        onChange={handleSkillFieldChange}
                      />
                    </div>

                    <button className="btn add-skill-button w-100" type="submit">
                      {t.addSkill} <span aria-hidden="true">+</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {success ? <div className="alert alert-success">{success}</div> : null}

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div>
                      
                    
<div className="card shadow-sm border-0 rounded-4 mb-4">
  <div className="card-body">
    <h4 className="mb-3">🤖 AI Skill Match</h4>

    {mySkills.length === 0 ? (
      <p className="text-muted">
        Add a skill to see AI recommendations.
      </p>
    ) : (
      mySkills.map((skill, index) => (
        <div key={index} className="community-skill-card mb-3">
          <h6>{skill.name}</h6>
          <p><strong>Recommended Skill:</strong> UI/UX</p>
          <small>AI suggests students who can help you improve this skill.</small>
        </div>
      ))
    )}
  </div>
</div>
    
                    <h4 className="mb-1">{t.mySkills}</h4>

<p className="text-muted small mb-0">
  {t.skillsReady}
</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="my-skills-count">{mySkills.length}</span>
                      <button className="btn clear-requests-button" onClick={handleClearMySkills} disabled={mySkills.length === 0}>
                        {t.clearSkills}
                      </button>
                    </div>
                  </div>
                  {mySkills.length > 0 ? (
                    <div className="row g-3">
                      {mySkills.map((skill) => (
                        <div key={skill.id} className="col-md-6">
                          <article className="my-skill-card h-100">
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                              <div>
                                <p className="skill-category mb-1">{skill.category}</p>
                                <h5 className="mb-0">{skill.name}</h5>
                              </div>
                              <span className="skill-level">{skill.level}</span>
                            </div>
                            <p className="mb-0">{skill.description || 'Ready to share this skill with the community.'}</p>
                          </article>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-skills-empty">Your added skills will appear here.</div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <h4 className="mb-3">{t.communitySkills}</h4>
                  <input
  type="search"
  className="form-control mb-3"
  placeholder="Search skills or student..."
  value={communitySearch}
  onChange={(e) => setCommunitySearch(e.target.value)}
/>
                  <div className="row g-3">
                    {skills.length > 0 ? (
                      filteredCommunitySkills.map((skill) => (
                        <div key={skill.id} className="col-md-6">
                          <div className="community-skill-card h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">{skill.name}</h6>
                              <span className="skill-level">{skill.category}</span>
                            </div>
                            <p className="small text-muted mb-2">Offered by {skill.user_name}</p>
                            <p className="small mb-0">{skill.description || 'No extra description provided.'}</p>

                            {skill.user_id !== user.id ? (
                              <button
                                className="btn btn-outline-primary btn-sm mt-3"
                                onClick={() => handleRequestSwap(skill)}
                                disabled={loading}
                              >
                                Request Swap
                              </button>
                            ) : (
                              <span className="small text-success mt-3 d-inline-block">Your skill</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-muted">No skills posted yet.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <h4 className="mb-0">{t.swapRequests}</h4>
                    <button className="btn clear-requests-button" onClick={handleClearSwapRequests} disabled={requests.length === 0}>
                      {t.clearRequests}
                    </button>
                  </div>
                  {requests.length > 0 ? (
                    <div className="row g-3">
                      {requests.map((request) => (
                        <div key={request.id} className="col-md-6">
                          <article className="swap-request-card h-100">
                            <div className="d-flex justify-content-between align-items-start gap-2">
                              <div>
                                <p className="skill-category mb-1">{request.requester_name === 'You' ? `TO ${request.target_name}` : `FROM ${request.requester_name}`}</p>
                                <h6 className="mb-0">{request.requester_name === 'You' ? `Requesting ${request.skill_offered}` : <>{request.skill_offered} <span>↔</span> {request.skill_wanted}</>}</h6>
                              </div>
                              <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                            </div>
                            <p className="small mb-3 mt-3">{request.message}</p>
                            {request.status === 'Pending' ? (
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm request-accept flex-grow-1" onClick={() => handleRequestDecision(request.id, 'Accepted')}>Accept</button>
                                <button className="btn btn-sm request-decline flex-grow-1" onClick={() => handleRequestDecision(request.id, 'Declined')}>Decline</button>
                              </div>
                            ) : null}
                          </article>
                          </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-skills-empty">No swap requests yet.</div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                    <h4 className="mb-0">{t.students}</h4>
                    <div className="student-search">
                      <span aria-hidden="true">⌕</span>
                      <input
                        type="search"
                        aria-label="Search students by name or skill"
                        placeholder="Search students or skills"
                        value={studentSearch}
                        onChange={(event) => setStudentSearch(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((member) => (
                        <div className="col-md-6" key={member.id}>
                        <article className="student-card h-100">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                            <div>
                              <p className="skill-category mb-1">{member.department}</p>
                              <h6 className="mb-1">{member.name}</h6>
                              <div className="student-college">{member.college || 'College not added'}</div>
                            </div>
                            <span className="my-skills-count">{member.skills?.length || 0}</span>
                          </div>

                          <p className="student-detail-label mb-2">Offered skills</p>
                          {member.skills && member.skills.length > 0 ? (
                            <div className="d-flex flex-column gap-2">
                              {member.skills.map((skill) => (
                                <div key={skill.id} className="student-skill-row">
                                  <span>{skill.name}</span>
                                  <span>{skill.level}</span>
                                </div>
                              ))}
                            </div>
                          ) : <div className="small">No skills listed yet.</div>}
                          <div className="student-availability mt-3"><span aria-hidden="true">◷</span> {member.availability}</div>
                        </article>
                        </div>
                      ))
                    ) : (
                      <div className="col-12"><div className="my-skills-empty">No students found</div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

export default App;
