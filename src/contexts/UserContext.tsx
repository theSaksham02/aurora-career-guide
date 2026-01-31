import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type CareerStage = 'Student' | 'Intern' | 'Professional';
export type OnboardingStep = 1 | 2 | 3 | 4;

export interface Application {
    id: string;
    company: string;
    role: string;
    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
    appliedDate: string;
    nextStep: string;
    notes?: string;
}

export interface OnboardingProgress {
    currentStep: OnboardingStep;
    completedSteps: number[];
    answers: Record<number, 'A' | 'B'>;
    comments: Record<number, string>;
    preTasks: { id: string; label: string; completed: boolean }[];
    weekTasks: { id: string; label: string; completed: boolean }[];
}

export interface UserProfile {
    name: string;
    email: string;
    stage: CareerStage;
    avatar?: string;
    interests: string[];
}

interface UserContextType {
    // User Profile
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;

    // Applications
    applications: Application[];
    addApplication: (app: Omit<Application, 'id'>) => void;
    updateApplication: (id: string, updates: Partial<Application>) => void;
    deleteApplication: (id: string) => void;

    // Onboarding
    onboarding: OnboardingProgress;
    setOnboardingStep: (step: OnboardingStep) => void;
    completeOnboardingStep: (step: number) => void;
    setOnboardingAnswer: (questionIndex: number, answer: 'A' | 'B') => void;
    setOnboardingComment: (questionIndex: number, comment: string) => void;
    togglePreTask: (id: string) => void;
    toggleWeekTask: (id: string) => void;

    // General
    isLoading: boolean;
}

const defaultPreTasks = [
    { id: 'pre-1', label: 'Review company background', completed: false },
    { id: 'pre-2', label: 'Set up work equipment', completed: false },
    { id: 'pre-3', label: 'Complete required paperwork', completed: false },
    { id: 'pre-4', label: 'Connect with your manager', completed: false },
];

const defaultWeekTasks = [
    { id: 'week-1', label: 'Attend orientation session', completed: false },
    { id: 'week-2', label: 'Meet your team members', completed: false },
    { id: 'week-3', label: 'Review project documentation', completed: false },
    { id: 'week-4', label: 'Set up initial 1:1 meetings', completed: false },
    { id: 'week-5', label: 'Complete compliance training', completed: false },
];

const defaultApplications: Application[] = [
    { id: '1', company: 'Google', role: 'Software Engineer', status: 'pending', appliedDate: 'Jan 15, 2026', nextStep: 'Technical Interview' },
    { id: '2', company: 'Apple', role: 'Product Designer', status: 'accepted', appliedDate: 'Jan 10, 2026', nextStep: 'Offer Review' },
    { id: '3', company: 'Microsoft', role: 'Data Scientist', status: 'pending', appliedDate: 'Jan 18, 2026', nextStep: 'Phone Screen' },
    { id: '4', company: 'Meta', role: 'Frontend Developer', status: 'rejected', appliedDate: 'Jan 5, 2026', nextStep: 'N/A' },
    { id: '5', company: 'Amazon', role: 'ML Engineer', status: 'withdrawn', appliedDate: 'Dec 28, 2025', nextStep: 'N/A' },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    // Profile State
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        stage: 'Intern',
        interests: ['Software Engineering', 'Product Management'],
    });

    // Applications State
    const [applications, setApplications] = useState<Application[]>(defaultApplications);

    // Onboarding State
    const [onboarding, setOnboarding] = useState<OnboardingProgress>({
        currentStep: 1,
        completedSteps: [],
        answers: {},
        comments: {},
        preTasks: defaultPreTasks,
        weekTasks: defaultWeekTasks,
    });

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('aurora_profile');
            const savedApplications = localStorage.getItem('aurora_applications');
            const savedOnboarding = localStorage.getItem('aurora_onboarding');

            if (savedProfile) setProfile(JSON.parse(savedProfile));
            if (savedApplications) setApplications(JSON.parse(savedApplications));
            if (savedOnboarding) setOnboarding(JSON.parse(savedOnboarding));
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
        setIsLoading(false);
    }, []);

    // Save to localStorage on changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('aurora_profile', JSON.stringify(profile));
        }
    }, [profile, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('aurora_applications', JSON.stringify(applications));
        }
    }, [applications, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('aurora_onboarding', JSON.stringify(onboarding));
        }
    }, [onboarding, isLoading]);

    // Profile Functions
    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    // Application Functions
    const addApplication = (app: Omit<Application, 'id'>) => {
        const newApp: Application = {
            ...app,
            id: Date.now().toString(),
        };
        setApplications(prev => [newApp, ...prev]);
    };

    const updateApplication = (id: string, updates: Partial<Application>) => {
        setApplications(prev =>
            prev.map(app => app.id === id ? { ...app, ...updates } : app)
        );
    };

    const deleteApplication = (id: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
    };

    // Onboarding Functions
    const setOnboardingStep = (step: OnboardingStep) => {
        setOnboarding(prev => ({ ...prev, currentStep: step }));
    };

    const completeOnboardingStep = (step: number) => {
        setOnboarding(prev => ({
            ...prev,
            completedSteps: prev.completedSteps.includes(step)
                ? prev.completedSteps
                : [...prev.completedSteps, step],
        }));
    };

    const setOnboardingAnswer = (questionIndex: number, answer: 'A' | 'B') => {
        setOnboarding(prev => ({
            ...prev,
            answers: { ...prev.answers, [questionIndex]: answer },
        }));
    };

    const setOnboardingComment = (questionIndex: number, comment: string) => {
        setOnboarding(prev => ({
            ...prev,
            comments: { ...prev.comments, [questionIndex]: comment },
        }));
    };

    const togglePreTask = (id: string) => {
        setOnboarding(prev => ({
            ...prev,
            preTasks: prev.preTasks.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        }));
    };

    const toggleWeekTask = (id: string) => {
        setOnboarding(prev => ({
            ...prev,
            weekTasks: prev.weekTasks.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        }));
    };

    return (
        <UserContext.Provider value={{
            profile,
            updateProfile,
            applications,
            addApplication,
            updateApplication,
            deleteApplication,
            onboarding,
            setOnboardingStep,
            completeOnboardingStep,
            setOnboardingAnswer,
            setOnboardingComment,
            togglePreTask,
            toggleWeekTask,
            isLoading,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
