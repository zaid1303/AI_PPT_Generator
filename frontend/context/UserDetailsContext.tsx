import { createContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { firebaseDb } from "../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

type UserDetail = {
  fullName: string;
  email: string;
  credits: number;
  createdAt: any;
};

type UserDetailsContextType = {
  userDetail: UserDetail | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
};

type UserDetailsProviderProps = {
  children: React.ReactNode;
};

export const UserDetailsContext = createContext<UserDetailsContextType | null>(
  null
);

export const UserDetailsProvider = ({ children }: UserDetailsProviderProps) => {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchOrCreateUser = async () => {
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const ref = doc(firebaseDb, "users", email);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserDetail(snap.data() as UserDetail); // FIXED
      } else {
        const data: UserDetail = {
          fullName: user.fullName ?? "", // FIXED
          email,
          credits: 3,
          createdAt: new Date(),
        };

        await setDoc(ref, data);
        setUserDetail(data);
      }
    };

    fetchOrCreateUser();
  }, [user, isLoaded]);

  return (
    <UserDetailsContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailsContext.Provider>
  );
};
