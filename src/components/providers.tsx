"use client";

import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AppProvider } from '@/components/context/app-provider';

Amplify.configure(awsExports);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator>
      <AppProvider>
        {children}
      </AppProvider>
    </Authenticator>
  );
}
