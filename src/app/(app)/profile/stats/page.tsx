"use client";
import Image from "next/image";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const MONTHS_DATA = [
  {
    month: "Jan",
    width: "40%", 
    images: ["/cover1.jpg", "/cover2.jpg"],
  },
  {
    month: "Feb",
    width: "20%",
    images: ["/cover3.jpg"],
  },
  {
    month: "Mar",
    width: "60%",
    images: ["/cover4.jpg"],
  },
  {
    month: "Apr",
    width: "45%",
    images: ["/cover5.jpg", "/cover6.jpg"],
  },
  {
    month: "May",
    width: "80%",
    images: ["/cover7.jpg"],
  },
  {
    month: "Jun",
    width: "55%",
    images: [],
  },
  {
    month: "Jul",
    width: "70%",
    images: [],
  },
  {
    month: "Aug",
    width: "30%",
    images: ["/cover8.jpg"],
  },
  {
    month: "Sep",
    width: "50%",
    images: [],
  },
  {
    month: "Oct",
    width: "0%",
    images: [],
  },
  {
    month: "Nov",
    width: "0%",
    images: [],
  },
  {
    month: "Dec",
    width: "0%",
    images: [],
  },
];

const GENRE_DATA = [
  { name: "Romance", value: 10 },
  { name: "Thriller", value: 6 },
  { name: "Fantasy", value: 4 },
  { name: "Autres", value: 2 },
];

const PIE_COLORS = ["#ec4899", "#dc2626", "#22c55e", "#ffffff"];

export default function AdvancedStatsPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <main className="mx-auto max-w-4xl py-10 px-4 my-14">
        <div
          className="rounded-lg p-6 mb-8 mx-auto"
          style={{
            background: "linear-gradient(to right, #6DA37F, #416E54)",
          }}
        >
          <div className="text-4xl font-bold mb-1">20</div>
          <div className="text-md mb-4">Livres lu depuis le début de l'année</div>

          <div className="space-y-3">
            {MONTHS_DATA.map(({ month, width, images }) => (
              <div key={month} className="flex items-center gap-3">
                <div className="w-10 text-sm font-medium">{month}</div>

                <div className="flex-1 bg-white/10 h-6 rounded-md relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-6 bg-white/40"
                    style={{ width }}
                  />

                  {images.map((src, i) => (
                    <div
                      key={src}
                      className="absolute h-8 w-8 rounded-full overflow-hidden -top-1"
                      style={{ left: `${10 + i * 30}px` }}
                    >
                      <Image
                        src={src}
                        alt={`cover${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg p-6 mb-8 mx-auto"
          style={{
            background: "linear-gradient(to right, #6DA37F, #416E54)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">
            Genre le plus lus depuis le début de l'année:{" "}
            <span className="font-bold">ROMANCE</span>
          </h2>
          <p className="text-sm mb-4 text-white/90">(Données factices)</p>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GENRE_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {GENRE_DATA.map((entry, index) => (
                    <Cell
                      key={`slice-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend
                  wrapperStyle={{
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-lg p-6 mx-auto"
          style={{
            background: "linear-gradient(to right, #6DA37F, #416E54)",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">
            Auteurs les plus lus depuis le début de l'année
          </h2>

          <div className="flex justify-between text-sm">
            <span>Stephen King</span>
            <span>6 livres</span>
          </div>
          <div className="relative w-full bg-white/20 h-2 rounded-full mb-4">
            <div
              className="bg-white absolute top-0 left-0 h-2 rounded-full"
              style={{ width: "60%" }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span>Patricia Briggs</span>
            <span>4 livres</span>
          </div>
          <div className="relative w-full bg-white/20 h-2 rounded-full mb-4">
            <div
              className="bg-white absolute top-0 left-0 h-2 rounded-full"
              style={{ width: "40%" }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span>Madeline Miller</span>
            <span>2 livres</span>
          </div>
          <div className="relative w-full bg-white/20 h-2 rounded-full">
            <div
              className="bg-white absolute top-0 left-0 h-2 rounded-full"
              style={{ width: "20%" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
