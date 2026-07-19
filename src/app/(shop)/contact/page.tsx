import { MessageCircle, Instagram, Twitter, Music2 } from "lucide-react";

const CHANNELS = [
  {
    name: "LINE Official",
    href: "https://lin.ee/xyteUTe",
    icon: MessageCircle,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/medmanwann?igsh=MXg4ODQ1bHJveTZlcQ==",
    icon: Instagram,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/medmanwann?s=11&t=ETiEyEnqH1AdGHn6TUt5DQ",
    icon: Twitter,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@medmanwann?_r=1&_t=ZS-98AcglXE2BZ",
    icon: Music2,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-brand-800">MEDMANWANN</h1>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          medmanwann - med mun waan, stay soft study smart
        </p>

        <div className="space-y-3">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
            <a  
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-brand-700 hover:bg-brand-800 text-white rounded-full py-3 px-5 font-medium transition"
              >
                <Icon size={20} />
                <span className="flex-1 text-left">{channel.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
