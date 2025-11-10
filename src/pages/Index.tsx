import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Stethoscope, Brain, Sparkles, Shield } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: 'AI-Powered Support',
      description: 'Intelligent assistance tailored to neurodivergent needs',
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: 'Mood Tracking',
      description: 'Track emotions with easy emoji selection and voice input',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      title: 'Learning Games',
      description: 'Interactive activities for literacy and emotion recognition',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Safe & Secure',
      description: 'Privacy-first design with encrypted communication',
    },
  ];

  return (
    <div className="min-h-screen calm-background">
      {/* Hero Section */}
      <div className="neuronest-container py-12 sm:py-20">
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-3xl shadow-lg">
              <Brain className="h-16 w-16 text-blue-500" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
            Welcome to <span className="text-blue-600">NeuroNest</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
            Learn. Connect. Thrive.
          </p>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            An inclusive AI-powered platform supporting individuals with neurodivergent conditions like Autism and Dyslexia
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <Card 
            className="neuronest-card cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/user-dashboard')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">I'm a User</CardTitle>
              <CardDescription className="text-base">
                Access your daily routines, mood tracker, and learning games
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full neuronest-button bg-blue-500 hover:bg-blue-600 text-white" size="lg">
                Enter User Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="neuronest-card cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/caregiver-dashboard')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">I'm a Caregiver</CardTitle>
              <CardDescription className="text-base">
                Monitor patient progress, view behavior logs, and manage care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full neuronest-button bg-green-500 hover:bg-green-600 text-white" size="lg">
                Enter Caregiver Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="neuronest-card cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/caregiver-dashboard')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Stethoscope className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">I'm a Doctor</CardTitle>
              <CardDescription className="text-base">
                Access medical records, conduct consultations, and review health alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full neuronest-button bg-purple-500 hover:bg-purple-600 text-white" size="lg">
                Enter Doctor Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose NeuroNest?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="neuronest-card text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}