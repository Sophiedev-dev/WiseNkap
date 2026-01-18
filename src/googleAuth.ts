import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "436264783009-mg58ln4g3f4c7m130n7s8abcckvsrr88.apps.googleusercontent.com",
  });

  const signInWithGoogle = async () => {
    const result = await promptAsync();

    if (result.type === "success") {
      const { id_token } = result.params;

      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    }
  };

  return {
    request,
    signInWithGoogle,
  };
}
