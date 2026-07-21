import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#1a1a1a' }}>
              Oops! Something went wrong
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#666' }}>
              We encountered an error while rendering the app. Please try restarting the application.
            </Text>
            {this.state.error && (
              <View style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                <Text style={{ fontSize: 12, fontFamily: 'monospace', color: '#c00' }}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => this.setState({ hasError: false, error: null })}
              style={{ backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}
