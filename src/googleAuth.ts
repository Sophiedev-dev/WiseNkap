import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

// 🔹 Configuration Google native
GoogleSignin.configure({
  webClientId:
    "436264783009-mg58ln4g3f4c7m130n7s8abcckvsrr88.apps.googleusercontent.com",
  offlineAccess: true,
});

export function useGoogleAuth() {
  const signInWithGoogle = async () => {
    try {
      // 🔹 Vérifie Google Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 🔹 Google Sign-In NATIF
      const userInfo = await GoogleSignin.signIn();

      // ✅ ICI EST LA CORRECTION
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("Google ID Token manquant");
      }

      // 🔹 Firebase credential
      const credential = GoogleAuthProvider.credential(idToken);
      

      await signInWithCredential(auth, credential);
    } catch (error) {
      console.log("Google Sign-In error:", error);
      throw error;
    }
  };

  return { signInWithGoogle };
}
