import { MainBase } from "airtable-api";
import Image from "next/image";
import { type } from "os";
import { useEffect, useState } from "react";

interface Image {
  filename: string;
  height: number;
  id: string;
  size: number;
  type: `${string}/${string}`;
  url: string;
  width: number;
}

export interface Event {
  Name: string;
  Description: string;
  Date: string;
  Time: number;
  Poster: Image[];
}

type CategoriedEvent = Record<string, Event[]>;

const Agenda = () => {
  const [events, setEvents] = useState<CategoriedEvent>({});
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setDate] = useState<string>("");
  const [isFetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    setFetching(false);
    const fetchJobs = async () => {
      if (!isFetching) return;
      let response = (await MainBase("tblCbQHQQjfsMxtqg")
        .select()
        .firstPage()) as unknown;
      //@ts-ignore
      const events: Event[] = response.map((record) => {
        return {
          ...record.fields,
        };
      }) as Event[];
      const unqiueDates: string[] = [];
      const categoriedEvent: CategoriedEvent = {};
      events.forEach((event) => {
        if (!unqiueDates.includes(event.Date)) {
          unqiueDates.push(event.Date);
        }
      });
      unqiueDates.forEach((date) => {
        categoriedEvent[date] = [];
        events.forEach((event) => {
          if (date === event.Date) {
            categoriedEvent[`${date}`].push(event);
          }
        });
      });
      console.log(unqiueDates);
      setDates(unqiueDates);
      setEvents(categoriedEvent);
    };

    fetchJobs();
    return () => {};
  }, []);

  return (
    <section className="py-20 flex flex-col items-center gap-y-4 md:grid xl:grid-cols-[0.4fr 0.6fr]">
      <div className="w-1/2 w-2/3 w-3/4 w-4/5"></div>
      <h1 className="xl:text-tertiary text-white text-6xl uppercase text-center font-bebas inline-block w-full">
        Agenda
      </h1>
      <p className="text-gray-300 font-kanit mx-12 text-base">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, sequi
        voluptatum dolor voluptas earum error accusamus consectetur itaque ipsa
        laboriosam cumque fuga dolorem asperiores molestias omnis velit delectus
        repellat possimus!
      </p>
      <nav className="flex justify-center gap-x-4">
        {dates?.map((date, index) => {
          if (!selectedDate && index === 0 && selectedDate !== date)
            setDate(date);
          return (
            <span
              key={`date-${index}`}
              onClick={() => {
                console.log(date);
                setDate(date);
              }}
              className={`font-bebas text-2xl text-white mt-12 inline-block cursor-pointer ${
                selectedDate === date ? "underline" : ""
              }`}
            >{`${date.split("-")[2]}/${date.split("-")[1]}`}</span>
          );
        })}
      </nav>
      <article className="w-full px-8 gap-x-4 gap-y-4 grid grid-cols-[0.45fr_0.55fr]">
        {Object.keys(events).map((iteratingDate) => {
          let formatEvents: any[] = [];
          if (iteratingDate === selectedDate) {
            formatEvents = events[iteratingDate].map((event) => {
              return (
                <>
                  {event?.Poster?.[0].url && (
                    <div className="w-full aspect-square relative">
                      <Image src={event.Poster[0].url} layout="fill" />
                    </div>
                  )}
                  <div
                    className={`${
                      event?.Poster?.[0].url
                        ? "col-start-2"
                        : "col-start-1 col-span-2"
                    }`}
                  >
                    <small className="font-kanit text-xs text-white">
                      {Math.floor(event.Time / 3600)}:
                      {Math.floor(event.Time % 3600) / 60 > 9
                        ? Math.floor(event.Time % 3600) / 60
                        : `0${Math.floor((event.Time % 3600) / 60)}`}
                    </small>
                    <h3
                      className={`text-white font-ranger ${
                        event?.Poster?.[0].url ? "text-2xl" : "text-4xl"
                      } `}
                    >
                      {event.Name}
                    </h3>
                    <p className="font-kanit text-white text-sm">
                      {event.Description}
                    </p>
                  </div>
                </>
              );
            });
          }
          return formatEvents;
        })}
      </article>
    </section>
  );
};

export default Agenda;
