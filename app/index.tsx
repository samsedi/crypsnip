import { Redirect } from 'expo-router';

export default function Index() {
    // Redirect strictly to the Onboarding screen inside the (auth) group
    return <Redirect href="/(auth)/OnboardingScreen" />;
}