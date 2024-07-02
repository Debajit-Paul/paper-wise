import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
   <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
    <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
    <p className="text-sm font-semibold text-gray-700">PaperWise is now public !</p>
    </div>
    <h1 className="max-w-4xl font-bold text-5xl md:text-6xl lg:text-7xl">
      Chat with your <span className="text-[#16A34A]">documents</span> in seconds.
    </h1>
    <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
    PapweWise allow you to have conversations with your PDF document. Simply upload your file and start asking  question right away.
    </p>

    <Link href="/dashboard">
    <Button size="lg" className="mt-5">
      Get Started
      <ArrowRight className="ml-2 h-5 w-5"/>
      </Button>
    </Link>
   </MaxWidthWrapper>
  );
}
