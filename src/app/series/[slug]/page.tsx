import { getSeriesBySlug } from "@/server/queries/series";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { getStandings } from "@/server/queries/standings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SeriesPageArgs = {
  params: Promise<{ slug: string }>;
};

export default async function SeriesPage({ params }: SeriesPageArgs) {
  const { slug } = await params;
  const [series, standings] = await Promise.all([
    getSeriesBySlug(slug),
    getStandings(slug),
  ]);

  if (!series) {
    return notFound();
  }

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">{series.title}</h1>

        <Image src="/images/lsc-landscape-website-2.png" alt="LSC Landscape Banner" width={1200} height={400} className="mt-8 rounded-lg" />

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">What is LSC?</h2>
          <p className="text-white/80 mt-4">
            The Lone Star Cup is meant as an introduction to the exciting, competitive world of Sim Racing. Designed as  a welcoming seed for aspiring racers, this league brings together members of all experience levels, from seasoned veterans to those taking their very first turn on a track. Participation in the league involves an entry fee of $20 with our primary goal being to foster a community built on sportsmanship and shared passion for the art of racing. You’ll find an environment where learning is encouraged and experienced drivers are willing to help newcomers grow. This is more than just a race; it’s a friendly, yet competitive, foundation for your sim racing journey.
          </p>
        </div>

        <Tabs defaultValue="season1" className="mt-8">
          <TabsList>
            <TabsTrigger value="season1">Season 1</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="season1">
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Last Race</h2>
                <div className="border rounded-lg mt-4 p-4">
                  <h3 className="font-bold">Placeholder Track Name</h3>
                  <p className="text-white/80">Date: YYYY-MM-DD</p>
                  <div className="mt-2">
                    <h4 className="font-bold">Podium</h4>
                    <ul className="list-disc list-inside">
                      <li>1st: Placeholder Driver 1</li>
                      <li>2nd: Placeholder Driver 2</li>
                      <li>3rd: Placeholder Driver 3</li>
                    </ul>
                  </div>
                  <p className="mt-2">Fastest Lap: Placeholder Driver 4</p>
                  <a href="#" className="text-lsr-orange hover:underline mt-2 inline-block">Watch Broadcast</a>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Next Race</h2>
                <div className="border rounded-lg mt-4 p-4">
                  <h3 className="font-bold">Placeholder Track Name</h3>
                  <p className="text-white/80">Date: YYYY-MM-DD</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Race Calendar</h2>
              <Carousel className="w-full mt-4">
                <CarouselContent>
                  {series.events.map((event) => (
                    <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                      <Link
                        href={`/events/${event.slug}`}
                        className="block p-1 transition-transform duration-200 hover:scale-105 hover:brightness-110"
                      >
                        <Card className="relative overflow-hidden">
                          {event.heroImageUrl && (
                            <>
                              <Image
                                src={event.heroImageUrl}
                                alt={event.title}
                                layout="fill"
                                objectFit="cover"
                                className="absolute inset-0 z-0 filter blur-[2px]"
                              />
                              <div className="absolute inset-0 bg-black/50 z-10" />
                            </>
                          )}
                          <CardContent className="relative z-20 flex flex-col items-center justify-center p-6">
                            <h3 className="font-bold">{event.title}</h3>
                            <p className="text-white/80 mt-2">
                              {new Date(event.startsAtUtc).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Standings</h2>
              <div className="overflow-x-auto border rounded-lg mt-4">
                <table className="w-full text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 md:p-4">Rank</th>
                      <th className="p-2 md:p-4">Driver</th>
                      <th className="p-2 md:p-4">Car</th>
                      <th className="p-2 md:p-4">Starts</th>
                      <th className="p-2 md:p-4">Wins</th>
                      <th className="p-2 md:p-4">Podiums</th>
                      <th className="p-2 md:p-4">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((standing: { driver: { id: string, name: string }, car: string | undefined, starts: number, wins: number, podiums: number, points: number }, index) => (
                      <tr key={standing.driver.id} className="border-b">
                        <td className="p-2 md:p-4">{index + 1}</td>
                        <td className="p-2 md:p-4">{standing.driver.name}</td>
                        <td className="p-2 md:p-4">{standing.car}</td>
                        <td className="p-2 md:p-4">{standing.starts}</td>
                        <td className="p-2 md:p-4">{standing.wins}</td>
                        <td className="p-2 md:p-4">{standing.podiums}</td>
                        <td className="p-2 md:p-4">{standing.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Previous Seasons</h2>
              <p className="text-white/80 mt-4">
                No previous seasons to display.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Hosted By</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="flex flex-col items-center">
              <Image src="/path/to/bryan.jpg" alt="Bryan" width={150} height={150} className="rounded-full" />
              <h3 className="font-bold mt-4">Bryan</h3>
              <p className="text-white/80 mt-2 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/path/to/armando.jpg" alt="Armando" width={150} height={150} className="rounded-full" />
              <h3 className="font-bold mt-4">Armando</h3>
              <p className="text-white/80 mt-2 text-center">
                My name is Armando Martinez and I am a Competitive Officer. I&apos;ve been playing racing games since the Cars Movie games on the PS3 and have spent most of my life racing on a controller and in all honesty am probably on the controller than on a wheel. Recently getting a wheel has been amazing since the immersion of sim-racing is important and its been a rewarding learning process. My goal is to teach people about racing and its tricky parts. That being said, reach out to us with any of your racing questions. Feel free to follow my instagram @mtz_mando.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
