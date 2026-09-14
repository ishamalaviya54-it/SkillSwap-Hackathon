import { useEffect, useState } from 'react';
import api from './services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
  college: '',
  bio: '',
};

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load the dashboard data after login.
  const fetchDashboard = async () => {
    if (!token) return;

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

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, form);

      const { token: newToken, user: currentUser } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(currentUser));
      setToken(newToken);
      setUser(currentUser);
      setForm(initialForm);
      setSuccess(authMode === 'login' ? 'Login successful!' : 'Account created!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/skills', skillForm);
      setSkills((prev) => [response.data, ...prev]);
      setSkillForm({ name: '', category: '', description: '' });
      setSuccess('Skill added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add skill.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = async (targetId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/requests', {
        targetId,
        message: 'Hi! I would like to swap skills with you.',
      });

      setRequests((prev) => [response.data, ...prev]);
      setSuccess('Swap request sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send swap request.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setUsers([]);
    setSkills([]);
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">Skill Swap</a>
          {token && user ? (
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </nav>

      {!token || !user ? (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="card shadow border-0 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="btn-group w-100" role="group">
                      <button
                        className={`btn ${authMode === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setAuthMode('login')}
                      >
                        Login
                      </button>
                      <button
                        className={`btn ${authMode === 'register' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setAuthMode('register')}
                      >
                        Register
                      </button>
                    </div>
                  </div>

                  <h3 className="text-center mb-4">{authMode === 'login' ? 'Welcome back' : 'Create account'}</h3>

                  {error ? <div className="alert alert-danger">{error}</div> : null}
                  {success ? <div className="alert alert-success">{success}</div> : null}

                  <form onSubmit={handleAuthSubmit}>
                    {authMode === 'register' ? (
                      <div className="mb-3">
                        <label className="form-label">Full name</label>
                        <input
                          className="form-control"
                          name="name"
                          value={form.name}
                          onChange={handleFieldChange}
                          required
                        />
                      </div>
                    ) : null}

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleFieldChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleFieldChange}
                        required
                      />
                    </div>

                    {authMode === 'register' ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">College</label>
                          <input
                            className="form-control"
                            name="college"
                            value={form.college}
                            onChange={handleFieldChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Bio</label>
                          <textarea
                            className="form-control"
                            name="bio"
                            rows="3"
                            value={form.bio}
                            onChange={handleFieldChange}
                          />
                        </div>
                      </>
                    ) : null}

                    <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                      {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container py-4">
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

                    <button className="btn btn-success w-100" type="submit" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Skill'}
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
                  <h4 className="mb-3">Community skills</h4>
                  <div className="row g-3">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <div key={skill.id} className="col-md-6">
                          <div className="border rounded-4 p-3 h-100 bg-light">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">{skill.name}</h6>
                              <span className="badge bg-primary">{skill.category}</span>
                            </div>
                            <p className="small text-muted mb-2">Offered by {skill.user_name}</p>
                            <p className="small mb-0">{skill.description || 'No extra description provided.'}</p>

                            {skill.user_id !== user.id ? (
                              <button
                                className="btn btn-outline-primary btn-sm mt-3"
                                onClick={() => handleRequestSwap(skill.user_id)}
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
                  <h4 className="mb-3">Swap requests</h4>
                  {requests.length > 0 ? (
                    <div className="list-group">
                      {requests.map((request) => (
                        <div key={request.id} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <strong>
                              {request.requester_id === user.id
                                ? `You requested ${request.target_name}`
                                : `${request.requester_name} requested you`}
                            </strong>
                            <span className="badge bg-warning text-dark">{request.status}</span>
                          </div>
                          <div className="small text-muted mt-1">{request.message}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted">No swap requests yet.</div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <h4 className="mb-3">Students</h4>
                  <div className="list-group">
                    {users.length > 0 ? (
                      users.map((member) => (
                        <div className="list-group-item" key={member.id}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{member.name}</h6>
                              <div className="text-muted small">{member.college || 'College not added'}</div>
                            </div>
                            <span className="badge bg-secondary">{member.skills?.length || 0} skills</span>
                          </div>

                          {member.skills && member.skills.length > 0 ? (
                            <div className="mt-2 d-flex flex-wrap gap-2">
                              {member.skills.map((skill) => (
                                <span key={skill.id} className="badge bg-light text-dark border">
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 small text-muted">No skills listed yet.</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted">No users yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
