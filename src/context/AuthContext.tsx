import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase";
import type { Role } from "../types";

/* ── Firestore user profile ─────────────────────────── */
export interface UserProfile {
  uid: string;
  fullName: string;
  initials: string;
  email: string;
  role: Role;
  neighborhood: string;
  points: number;
  photoURL?: string;
  createdAt?: unknown;
}

function makeInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ── Context value ──────────────────────────────────── */
interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    fullName: string,
    neighborhood: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: {
    fullName?: string;
    neighborhood?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* ── Helper: ensure Firestore profile ───────────────── */
async function ensureProfile(user: User): Promise<UserProfile> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  // Create profile on first login (Google sign-in, for example)
  const profile: UserProfile = {
    uid: user.uid,
    fullName: user.displayName ?? "Usuário",
    initials: makeInitials(user.displayName ?? "U"),
    email: user.email ?? "",
    role: "citizen",
    neighborhood: "Centro",
    points: 0,
    photoURL: user.photoURL ?? undefined,
    createdAt: serverTimestamp(),
  };

  await setDoc(ref, profile);
  return profile;
}

/* ── Provider ───────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* Listen to auth state */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await ensureProfile(firebaseUser);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  /* Email / Password login */
  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  /* Email / Password register */
  const registerWithEmail = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      neighborhood: string,
    ) => {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(cred.user, { displayName: fullName });

      const profileData: UserProfile = {
        uid: cred.user.uid,
        fullName,
        initials: makeInitials(fullName),
        email,
        role: "citizen",
        neighborhood,
        points: 0,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", cred.user.uid), profileData);
      setProfile(profileData);
    },
    [],
  );

  /* Google Sign-in */
  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  /* Logout */
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  /* Atualiza nome e/ou bairro do perfil */
  const updateUserProfile = useCallback(
    async (updates: { fullName?: string; neighborhood?: string }) => {
      if (!auth.currentUser) return;

      const patch: Partial<UserProfile> = {};
      if (updates.fullName !== undefined) {
        patch.fullName = updates.fullName;
        patch.initials = makeInitials(updates.fullName);
      }
      if (updates.neighborhood !== undefined) {
        patch.neighborhood = updates.neighborhood;
      }

      // Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), patch);

      // Firebase Auth displayName (quando o nome muda)
      if (patch.fullName !== undefined) {
        await updateProfile(auth.currentUser, { displayName: patch.fullName });
      }

      // Estado local
      setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      updateUserProfile,
    }),
    [
      user,
      profile,
      loading,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      updateUserProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
