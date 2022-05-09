import Layout from "components/Layout";
import { useState } from "react";
import firebase from "firebase/app";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";

const LogInForm = () => {
  const router = useRouter();

  const [botField, setBotField] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const isFormValid = () => {
    return true;
  };

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setError("");
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    resetErrors();
    if (!isFormValid()) {
      return;
    }
    try {
      const userCredentials = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          throw Error(`Failed to sign into firebase: ${error}`);
        });
      console.log({ userCredentials });
      router.push("/account");
    } catch (error: any) {
      console.error(error.message);
      setError("Failed to log in, please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <input
        name="name"
        aria-label="Humans need not fill out"
        type="text"
        tabIndex={-1}
        value={botField}
        onChange={(event: any) => setBotField(event.target.value)}
        style={{ display: "none" }}
      />
      <input
        placeholder="Email"
        value={email}
        type="email"
        onChange={(event) => setEmail(event.target.value)}
      />
      {emailError && <span>{emailError}</span>}
      <input
        placeholder="Password"
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      {passwordError && <span>{passwordError}</span>}
      <input type="submit" value="Log in" />
      <span>{error}</span>
    </form>
  );
};

const LoginPage = () => {
  return (
    <Layout>
      <main>
        <LogInForm />
      </main>
    </Layout>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  appPageURL: "/account",
})(LoginPage);
