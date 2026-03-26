import { MemberForm } from "@/components/members/MemberForm"
import { createClient } from "@/lib/supabase/server"

import { createAdminClient } from "@/lib/supabase/admin"

export default async function AddMemberPage(props: { searchParams?: Promise<{ inquiryId?: string }> }) {
  const searchParams = await props.searchParams;
  const inquiryId = searchParams?.inquiryId;
  const supabase = await createClient()

  // Fetch real membership plans from the DB
  const { data: plans } = await supabase
    .from('membership_plans')
    .select('id, name, price')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  let initialData = undefined;
  if (inquiryId) {
    const adminClient = createAdminClient();
    const { data: inquiry } = await adminClient
      .from('inquiries')
      .select('name, phone, email')
      .eq('id', inquiryId)
      .single();

    if (inquiry) {
      initialData = {
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email || '',
        inquiryId: inquiryId
      };
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Add New Member</h2>
          <p className="text-slate-300">
            {inquiryId ? "Complete registration for this new member" : "Register a new member to your gym"}
          </p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 w-full max-w-3xl">
        <MemberForm plans={plans || []} initialData={initialData} />
      </div>
    </div>
  )
}
