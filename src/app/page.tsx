import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { Linkedin, Mail, Menu } from "lucide-react";
import TechStack from "@/components/tech-stack";
import { ModeToggle } from "@/components/mode-toggle";
import Project from "./project";
import getCurrentSession from "@/server/auth/sessions";
import LogoutButton from "@/components/logout-button";
import Experience from "./experience";

export default async function Home() {
  const { user } = await getCurrentSession();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link className="flex items-center space-x-2" href="/">
              <span className="font-bold text-lg">rizrmdhn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 font-medium text-sm md:flex">
            <Link
              href="#about"
              className="transition-colors hover:text-foreground/80"
            >
              About
            </Link>
            <Link
              href="#experience"
              className="transition-colors hover:text-foreground/80"
            >
              Experience
            </Link>
            <Link
              href="#projects"
              className="transition-colors hover:text-foreground/80"
            >
              Projects
            </Link>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <ModeToggle />

            {user ? (
              <LogoutButton variant="outline" />
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="w-full">
        <section id="about" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="font-bold text-2xl tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  Web Developer
                </h1>
                <p className="mx-auto max-w-[600px] px-4 text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl dark:text-gray-400">
                  I'm a freelance web developer, I'm passionate about technology
                  and I love to learn new things.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link href="https://github.com/rizrmdhn" target="_blank">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <FaGithub className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/rizrmdhn/"
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="https://x.com/rizrmdhn_" target="_blank">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <FaTwitter className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
                <Link href="mailto:rizrmdhn.work@gmail.com">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="bg-muted/50 py-12 md:py-24 lg:py-32"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-8 text-center font-bold text-2xl tracking-tighter sm:mb-12 sm:text-3xl md:text-4xl lg:text-5xl">
              Work Experience
            </h2>
            <Experience />
          </div>
        </section>

        <section id="projects" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-8 text-center font-bold text-2xl tracking-tighter sm:mb-12 sm:text-3xl md:text-4xl lg:text-5xl">
              Projects
            </h2>
            <Project />
          </div>
        </section>

        <section className="bg-muted/50 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-8 text-center font-bold text-2xl tracking-tighter sm:mb-12 sm:text-3xl md:text-4xl lg:text-5xl">
              Tech Stack
            </h2>
            <TechStack />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex w-full shrink-0 flex-col items-center gap-2 px-4 py-6 sm:flex-row md:px-6">
          <p className="text-center text-gray-500 text-xs sm:text-left dark:text-gray-400">
            © {format(new Date(), "yyyy")} rizrmdhn. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link
              className="text-xs underline-offset-4 hover:underline"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs underline-offset-4 hover:underline"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
