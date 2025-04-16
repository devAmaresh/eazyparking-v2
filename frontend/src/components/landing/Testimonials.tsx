"use client";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function Testimonials() {
  return (
    <div
      id="testimonials"
      className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"
    >
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "EazyParking has completely streamlined our parking operations. We used to deal with manual logs and frustrated customers—now everything is automated, efficient, and seamless.",
    name: "Anita Verma",
    title: "Facility Manager, Urban Mall",
  },
  {
    quote:
      "I love how easy it is to find and book a parking spot now. The real-time availability and quick payments save me so much time during my daily commute.",
    name: "Rohan Desai",
    title: "Daily Commuter, Pune",
  },
  {
    quote:
      "Our team was able to onboard in minutes. The admin dashboard gives us total control over every spot, and the reporting tools are a game changer.",
    name: "Sandeep Mehra",
    title: "Operations Head, SmartPark Pvt. Ltd.",
  },
  {
    quote:
      "I used to circle for 20+ minutes looking for parking. With EazyParking, I find, reserve, and park in under five. It's a must-have for every driver in the city.",
    name: "Mehak Kapoor",
    title: "App User & Freelancer",
  },
  {
    quote:
      "EazyParking has helped us reduce congestion and improve traffic flow near our commercial complex. It's a smart solution with a real impact.",
    name: "Rajeev Iyer",
    title: "City Planner, Navi Mumbai",
  },
];
