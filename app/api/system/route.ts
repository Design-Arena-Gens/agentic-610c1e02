import { NextResponse } from 'next/server';
import { getAutomationSnapshot } from '@/lib/state';
import { getPanelClient } from '@/lib/panel-client';

export async function GET() {
  const [snapshot, requests] = await Promise.all([getAutomationSnapshot(), getPanelClient().fetchRequests()]);
  return NextResponse.json({
    snapshot,
    queueSize: requests.length,
  });
}
