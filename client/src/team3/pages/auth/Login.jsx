<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function Login() {
  const [email, setEmail] = useState('schoolteacher@must.edu.mn');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/token/email', {
        email: email,
        password: password
      });

      const token = response.data.token || response.data.access_token;
      localStorage.setItem('token', token);
      let userRole = '';
      let targetPath = '';

      if (email === 'admin@must.edu.mn') {
        userRole = 'admin';
        targetPath = '/team3/teacher';
      } else if (email === 'schooladmin@must.edu.mn') {
        userRole = 'school_admin';
        targetPath = '/team3/teacher';
      } else if (email === 'schoolteacher@must.edu.mn') {
        userRole = 'teacher';
        targetPath = '/team3/teacher';
      } else if (email === 'schoolstudent@must.edu.mn') {
        userRole = 'student';
        targetPath = '/team3/student';
      } else {
        userRole = email.includes('teacher') ? 'teacher' : 'student';
        targetPath = userRole === 'teacher' ? '/team3/teacher' : '/team3/student';
      }

      localStorage.setItem('userRole', userRole);
      navigate(targetPath);

    } catch (err) {
      console.error("Нэвтрэхэд алдаа гарлаа:", err);
      setError(err.response?.data?.message || 'И-мэйл эсвэл нууц үг буруу байна.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Системд нэвтрэх</h1>
          <p className="text-slate-500 mt-2 text-sm">Сургуулийн цахим сургалтын систем</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Нэвтрэх и-мэйл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Нууц үг</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              'Нэвтрэх'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
=======
import { Shell, PageTitle, EmptySettings } from '../../components/common';

export default function Login() {
  return (
    <Shell role="student">
      <PageTitle title="Login" subtitle="Энэ бүтэц нь Team4-тэй төстэй болгох зорилготой." />
      <EmptySettings />
    </Shell>
  );
}
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
