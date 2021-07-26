import React from "react";
import * as Realm from "realm-web";
import { useRealmApp } from "../RealmApp";
import styled from "styled-components";
import validator from "validator";
import Loading from "./Loading";
import { Action } from "./Action";
import { Colours } from "../globalstyles/Colours";

export default function LoginScreen() {
    const app = useRealmApp();
    // Toggle between logging users in and registering new users
    const [mode, setMode] = React.useState("login");
    const toggleMode = () => {
        setMode((oldMode) => (oldMode === "login" ? "register" : "login"));
    };
    // Keep track of form input state
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    // Keep track of input validation/errors
    const [error, setError] = React.useState({});
    // Whenever the mode changes, clear the form inputs
    React.useEffect(() => {
        setEmail("email@example.com");
        setPassword("password");
        setError({});
    }, [mode]);

    const [isLoggingIn, setIsLoggingIn] = React.useState(false);
    const handleLogin = async () => {
        setIsLoggingIn(true);
        setError((e) => ({ ...e, password: null }));
        try {
            await app.logIn(Realm.Credentials.emailPassword(email, password));
        } catch (err) {
            handleAuthenticationError(err, setError);
        }
    };

    const handleRegistrationAndLogin = async () => {
        const isValidEmailAddress = validator.isEmail(email);
        setError((e) => ({ ...e, password: null }));
        if (isValidEmailAddress) {
            try {
                // Register the user and, if successful, log them in
                await app.emailPasswordAuth.registerUser(email, password);
                return await handleLogin();
            } catch (err) {
                handleAuthenticationError(err, setError);
            }
        } else {
            setError((err) => ({ ...err, email: "Email is invalid." }));
        }
    };

    return (
        <Container>
            {isLoggingIn ? (
                <Loading stage={1} />
            ) : (
                <Action
                    hideEscape={true}
                    actionType="login"
                    actionText={mode === "login" ? "Login" : "Register an Account"}
                    onEnterClick={mode === "login" ? handleLogin : handleRegistrationAndLogin}
                >
                    <LoginForm>
                        <LoginFormRow>
                            <Email
                                type="email"
                                label="Email"
                                placeholder="your.email@example.com"
                                onChange={(e) => {
                                    setError((e) => ({ ...e, email: null }));
                                    setEmail(e.target.value);
                                }}
                                value={email}
                                state={
                                    error.email
                                        ? "error"
                                        : validator.isEmail(email)
                                            ? "valid"
                                            : "none"
                                }
                                errorMessage={error.email}
                            />
                        </LoginFormRow>
                        <LoginFormRow>
                            <Password
                                type="password"
                                label="Password"
                                placeholder="pa55w0rd"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                value={password}
                                state={
                                    error.password ? "error" : error.password ? "valid" : "none"
                                }
                                errorMessage={error.password}
                            />
                        </LoginFormRow>
                        <ToggleContainer>
                            <ToggleText>
                            {mode === "login"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                            </ToggleText>
                            <ToggleLink
                            onClick={(e) => {
                                e.preventDefault();
                                toggleMode();
                            }}
                            >
                            {mode === "login" ? "Register one now." : "Log in instead."}
                            </ToggleLink>
                        </ToggleContainer>
                    </LoginForm>
                </Action>
            )}
        </Container>
    );
}

function handleAuthenticationError(err, setError) {
    const { status, message } = parseAuthenticationError(err);
    const errorType = message || status;
    switch (errorType) {
        case "invalid username":
            setError((prevErr) => ({ ...prevErr, email: "Invalid email address." }));
            break;
        case "invalid username/password":
        case "invalid password":
        case "401":
            setError((err) => ({ ...err, password: "Incorrect password." }));
            break;
        case "name already in use":
        case "409":
            setError((err) => ({ ...err, email: "Email is already registered." }));
            break;
        case "password must be between 6 and 128 characters":
        case "400":
            setError((err) => ({
                ...err,
                password: "Password must be between 6 and 128 characters.",
            }));
            break;
        default:
            break;
    }
}

function parseAuthenticationError(err) {
    const parts = err.message.split(":");
    const reason = parts[parts.length - 1].trimStart();
    if (!reason) return { status: "", message: "" };
    const reasonRegex = /(?<message>.+)\s\(status (?<status>[0-9][0-9][0-9])/;
    const match = reason.match(reasonRegex);
    const { status, message } = match?.groups ?? {};
    return { status, message };
}

const ToggleContainer = styled.div`
  margin-top: 12px;
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
`;

const ToggleText = styled.span`
  line-height: 18px;
  color: ${Colours.font.light};
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: ${Colours.font.dark};
  :hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.div`
display: flex;
flex-direction: column;
width: 100%;
`;

const LoginFormRow = styled.div`
  margin-bottom: 16px;
  width: 100%;
`;

const Email = styled.input`
width:90%;
font-size: 1rem;
background: #313131;
margin-top: 48px;
margin-bottom: 14px;
border: none;
border-bottom: 1px solid #909090;
align-self: flex-start;
outline: none;
color: ${Colours.font.light};
`

const Password = styled.input`
width: 90%;
font-size: 1rem;
background: #313131;
margin-bottom: 0px;
border: none;
border-bottom: 1px solid #909090;
align-self: flex-start;
outline: none;
color: ${Colours.font.light};
`
