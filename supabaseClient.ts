import { createClient } from "@supabase/supabase-js"

// Valores por defecto para desarrollo local
const defaultSupabaseUrl = "https://eqngpaogpxagisbpmhrp.supabase.co"
const defaultSupabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultSupabaseUrl
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultSupabaseKey

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase URL or Anon Key is missing. Using default values.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchSubmissions() {
  try {
    const { data, error } = await supabase
      .from("airdrop_submissions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching submissions:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Error in fetchSubmissions:", error)
    return []
  }
}

export async function addSubmission(submission: {
  name: string
  email: string
  network: string
  address: string
  tokens_sent: boolean
  amount_sent: number
}) {
  try {
    const { data, error } = await supabase.from("airdrop_submissions").insert([submission]).select()

    if (error) {
      console.error("Error adding submission:", error)
      throw error
    }
    return data[0]
  } catch (error) {
    console.error("Error in addSubmission:", error)
    throw error
  }
}

export async function updateSubmission(
  id: number,
  updates: {
    tokens_sent?: boolean
    amount_sent?: number
  },
) {
  try {
    const { data, error } = await supabase.from("airdrop_submissions").update(updates).eq("id", id).select()

    if (error) {
      console.error("Error updating submission:", error)
      throw error
    }
    return data[0]
  } catch (error) {
    console.error("Error in updateSubmission:", error)
    throw error
  }
}

export async function deleteSubmission(id: number) {
  try {
    const { error } = await supabase.from("airdrop_submissions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting submission:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in deleteSubmission:", error)
    throw error
  }
}

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("airdrop_submissions").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Error checking Supabase connection:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error in checkSupabaseConnection:", error)
    return false
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in signIn:", error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error("Error in signOut:", error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

