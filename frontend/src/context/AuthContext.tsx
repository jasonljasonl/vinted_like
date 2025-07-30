import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const API_BASE_URL = 'http://localhost:8000/users/'

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (token:string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children } : { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_BASE_URL}me/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setUser(data);
            })
            .catch(() => setUser(null));
        }
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        const res = await fetch(`${API_BASE_URL}me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Error');
    }
    return context;
}