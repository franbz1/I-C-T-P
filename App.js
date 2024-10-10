import Login from "./src/frontend/Screens/Login";
import { AuthProvider } from "./src/Backend/auth/authContext";
import AppNavigator from "./src/Backend/navigation/appNavigator";
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  );
}
