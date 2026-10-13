import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";

function BulletRow({ width }: { width: string }) {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full shrink-0" />
            <Skeleton className={`h-3.5 ${width}`} />
        </div>
    );
}

function Section({ titleWidth, bullets }: { titleWidth: string; bullets: string[] }) {
    return (
        <div className="space-y-3">
            <Skeleton className={`h-16 ${titleWidth}`} />
            <div className="space-y-2.5 pl-1">
                {bullets.map((w, i) => <BulletRow key={i} width={w} />)}
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <Layout>
            <div className="container commonPY space-y-6">
                {/* Page title + subtitle */}
                <div className="space-y-2.5">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-20 w-96 max-w-full" />
                </div>

                <Skeleton className="h-px w-full" />

                <Section titleWidth="w-44" bullets={["w-48", "w-72 max-w-full", "w-64"]} />
                <Skeleton className="h-px w-full" />

                <Section titleWidth="w-36" bullets={["w-80 max-w-full", "w-72 max-w-full", "w-56"]} />
                <Skeleton className="h-px w-full" />

                <Section titleWidth="w-40" bullets={["w-60", "w-64"]} />
                <Skeleton className="h-px w-full" />

                <Section titleWidth="w-52" bullets={["w-56", "w-48"]} />
            </div>
        </Layout>
    );
}
