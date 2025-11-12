import { NextResponse } from 'next/server';
import { getPanelClient } from '@/lib/panel-client';
import { getAutomationSnapshot } from '@/lib/state';
import { listMockRequests } from '@/lib/mock-data';
import type { PanelRequest } from '@/lib/types';

export async function GET() {
  const client = getPanelClient();
  const requests = await client.fetchRequests();
  const snapshot = getAutomationSnapshot();

  return NextResponse.json({
    requests,
    snapshot,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PanelRequest> & {
    inject?: boolean;
  };

  const client = getPanelClient();

  if (body.inject ?? true) {
    const payload: PanelRequest = await client.injectRequest({
      id: body.id ?? '',
      subject: body.subject ?? 'Ticket sans sujet',
      description: body.description ?? '',
      category: body.category ?? 'Général',
      priority: body.priority ?? 'medium',
      status: body.status ?? 'open',
      requester: body.requester ?? {
        name: 'Système',
        role: 'Automate',
        channel: 'web',
      },
      metadata: body.metadata ?? {},
    });

    return NextResponse.json({
      request: payload,
      requests: listMockRequests(),
    });
  }

  return NextResponse.json(
    {
      message: 'Aucune action effectuée (mode injection désactivé)',
    },
    { status: 202 },
  );
}
