import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchProfile } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            fetchProfile().then(() => navigate('/'));
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-surface-on font-bold">Signing you in…</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
