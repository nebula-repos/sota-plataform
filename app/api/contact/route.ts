import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[contact] missing supabase env")
      return NextResponse.json({ error: "Missing server configuration" }, { status: 500 })
    }

    const payload = await request.json()
    const { name, email, company, phone, industry, help, message } = payload ?? {}

    if (!email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.functions.invoke("contact_leads", {
      body: {
        name,
        email,
        company,
        phone,
        industry,
        help,
        message,
      },
    })

    if (error) {
      console.error("[contact] function failed", error)
      return NextResponse.json({ error: "Unable to process request" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[contact] failed", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
