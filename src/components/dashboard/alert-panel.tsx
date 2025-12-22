'use client';

import { useApp } from '@/components/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AlertPanel() {
  const { alerts } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground">No new alerts.</p>
        )}
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
            {alert.type === 'warning' ? (
                <AlertTriangle className="h-4 w-4" />
            ) : (
                <Bell className="h-4 w-4" />
            )}
            <AlertTitle className="flex justify-between items-center">
              <span>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {formatDistanceToNow(alert.date, { addSuffix: true })}
              </span>
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
