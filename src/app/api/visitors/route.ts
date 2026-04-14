import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const cookie = req.cookies.get('visitor_seen')?.value

    let row = await prisma.siteAnalytics.upsert({
        where: { id: 'main' },
        update: {},
        create: { id: 'main', visitors: 0 }
    })

    if (cookie === 'true') {
        return NextResponse.json({ count: row.visitors })
    }

    row = await prisma.siteAnalytics.update({
        where: { id: 'main' },
        data: { visitors: { increment: 1 } }
    })

    const res = NextResponse.json({ count: row.visitors })

    res.cookies.set('visitor_seen', 'true', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365
    })

    return res
}