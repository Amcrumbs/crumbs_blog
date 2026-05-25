import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { PageHeading } from "@/components/page-heading";
import { verifyAdminSession } from "@/lib/admin-access";

export default async function AdminLoginPage() {
  if (await verifyAdminSession()) {
    redirect("/admin");
  }

  return (
    <>
      <PageHeading
        eyebrow="admin://login"
        title="管理员登录"
        description="未登录访客只能浏览公开内容。登录后，你可以直接管理日志、笔记、导航和留言板。"
      />
      <AdminLoginForm />
    </>
  );
}
