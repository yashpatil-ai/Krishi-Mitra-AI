import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  UserCircle,
} from "lucide-react"

import { useTranslation } from "react-i18next"

import { useAuth } from "@/context/AuthContext"

function Profile() {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          {t("loginToViewProfile")}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("profile")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("manageProfile")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <section className="rounded-xl border bg-card p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10">
              <UserCircle className="size-14 text-primary" />
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              {user.full_name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("farmer")}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
              <CheckCircle2 className="size-4 text-primary" />
              <span>
                {user.is_active ? t("activeAccount") : t("inactiveAccount")}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {t("accountInformation")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("registeredAccountDetails")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <UserCircle className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("fullName")}
                  </p>
                  <p className="mt-1 font-medium">
                    {user.full_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Mail className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("emailAddress")}
                  </p>
                  <p className="mt-1 break-all font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("accountStatus")}
                  </p>
                  <p className="mt-1 font-medium">
                    {user.is_active ? t("active") : t("inactive")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <UserCircle className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("userId")}
                  </p>
                  <p className="mt-1 font-medium">
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile