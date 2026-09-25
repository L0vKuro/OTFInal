import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Public, read-only lookup for a single article's full body by news_id.
// Returns { article: null } (not an error) when no full article has been
// written yet for that news card, so the page can fall back gracefully.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const newsId = parseInt(params.id, 10)
  if (!newsId || Number.isNaN(newsId)) {
    return NextResponse.json({ article: null })
  }

  const { data } = await supabase
    .from('articles')
    .select('news_id, body, cover_image, author, published, updated_at')
    .eq('news_id', newsId)
    .eq('published', true)
    .maybeSingle()

  return NextResponse.json({ article: data || null })
}
