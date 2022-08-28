import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import JobCard from "../components/jobs/JobCard";
import { Field, getMainBase, MainBase, Record } from "airtable-api";
import { Job } from "airtable-api";
import Link from "next/link";

const Jobs: NextPage = () => {
  const [jobs, setJobs] = useState<Job>({
    records: [],
  });
  const [isFetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    setFetching(false);
    const fetchJobs = async () => {
      if (!isFetching) return;
      const jobs = (await MainBase("tbl5Pl1EGXVtDzYwC")
        .select()
        .firstPage()) as unknown;
      setJobs({
        records: jobs,
      } as Job);
    };
    fetchJobs();
    return () => {};
  }, []);

  return (
    <div className="w-screen h-screen max-w-screen overflow-x-hidden">
      <Head>
        <title>Gate Game 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full min-h-screen flex flex-col items-center  font-mono">
        <div className="flex flex-col items-center my-20 gap-y-6">
          <h1 className="text-5xl font-semibold">We're hiring</h1>
          <Link href={"https://airtable.com/shrTcHjR0CoITrFfc"} passHref>
            <a
              className="px-6 py-2 border-2 border-white rounded-lg inline-block bg-white text-black"
              target={"_blank"}
            >
              ยังไม่ได้สมัครเป็น Admin หรอ? สมัครเลย!
            </a>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-6">
            <h1>
              หากสนใจตำแหน่งไหน สามารถติดต่อ HR หรือถามลงในกลุ่มไลน์ได้เลย Agent
              + Staff ได้เลย!
            </h1>
            {jobs.records.map((record) => {
              let collabs: string[] = [];
              record.fields["Name (from Undermanagement Producer)"]?.forEach(
                (pos) => {
                  collabs.push(pos);
                }
              );
              record.fields["Name (from Undermanagement Di)"]?.forEach(
                (pos) => {
                  collabs.push(pos);
                }
              );
              record.fields["Name (from Undermanagement MC)"]?.forEach(
                (pos) => {
                  collabs.push(pos);
                }
              );
              return (
                <JobCard
                  status={record.fields["Status"]}
                  title={record.fields["Position Name"]}
                  collab={collabs}
                  key={record.id}
                  description={record.fields.Description}
                />
              );
            })}
          </div>
          {!jobs.records.length && <h1>Loading!</h1>}
        </div>
        <footer className="grid place-items-center my-12">
          <span>Join our family and become staff today!</span>
        </footer>
      </main>
    </div>
  );
};

export default Jobs;
