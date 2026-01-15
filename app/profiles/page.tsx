import { profileService } from "@/lib/services/profile.service";
import { getAvatarUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = 24;
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    profileService.getPublishedProfiles(limit, offset),
    profileService.getPublishedProfileCount(),
  ]);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 selection:bg-primary selection:text-primary-foreground">
      <LandingNav />
      <main className="flex-1 font-mono text-sm py-8">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">OneURL Profiles</h1>
            <p className="text-muted-foreground mt-1">
              Discover all published profiles on OneURL
            </p>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No profiles found.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                {total} profile{total !== 1 ? "s" : ""} found
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((user) => {
                  const avatarUrl = getAvatarUrl(user);
                  if (!user.username) return null;

                  return (
                    <Link key={user.username} href={`/${user.username}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center space-y-3">
                            {avatarUrl ? (
                              <div className="size-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                <Image
                                  src={avatarUrl}
                                  alt={user.username}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="size-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-400">
                                {user.username[0].toUpperCase()}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">@{user.username}</span>
                              <BadgeCheck className="size-4 text-white [&>path:first-child]:fill-amber-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link href={`/profiles?page=${page - 1}`}>
                      <button className="px-4 py-2 rounded-lg border hover:bg-accent/50 transition-colors">
                        Previous
                      </button>
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link href={`/profiles?page=${page + 1}`}>
                      <button className="px-4 py-2 rounded-lg border hover:bg-accent/50 transition-colors">
                        Next
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

