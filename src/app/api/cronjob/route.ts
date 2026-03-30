import { supabase } from "../../../lib/supabase"

export async function GET(req: Request) {
    const { data, error } = await supabase
        .from("cronjob")
        .select("*")
    if (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json(data);
}
