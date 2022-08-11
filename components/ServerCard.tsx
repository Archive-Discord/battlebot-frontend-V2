import type { UserGuld } from "@types";
import { battlebot } from "@utils/Constants";
import { guildProfileLink } from "@utils/utils";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const ServerCard: React.FC<ServerCardProps> = ({ server }) => {
  const router = useRouter();
  const { t } = useTranslation()
  const onInviteClick = (guildId: string) => {
    window.open(
      battlebot.invite + `&guild_id=${guildId}&disable_guild_select=true`,
      "봇 초대하기",
      "width=450, height=850"
    );
  };
  return (
    <>
      <div
        className={`flex w-96 h-52 mx-auto mx-5 my-5 items-center flex flex-col`}
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="relative mx-auto w-full h-full flex items-center justify-center overflow-hidden rounded-3xl border-2">
          <div
            className="absolute bg-no-repeat bg-cover w-full h-full bg-center blur-lg"
            style={{
              backgroundImage: `url('${guildProfileLink(server)}')`,
              transform: "scale(1.5)",
            }}
          />
          <img
            className="w-28 z-20 rounded-full border-2"
            src={guildProfileLink(server)}
          />
        </div>
        <div className="w-full mt-5 px-1">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg truncate">{server.name}</span>
            {server.bot ? (
              <button
                className="max-w-[77px] px-2 py-1 border text-black rounded-lg text-bold hover:-translate-y-1 transform transition duration-100 ease-in"
                onClick={() => {
                    router.push(`/dashboard/${server.id}`)
                }}
              >
                {t("dashboard.manage")}
              </button>
            ) : (
              <button
                className="max-w-[77px] bg-purple-500 text-white px-2 py-1 border rounded-lg text-bold hover:-translate-y-1 transform transition duration-100 ease-in"
                onClick={() => onInviteClick(server.id)}
              >
                {t("dashboard.invite")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface ServerCardProps {
  server: UserGuld;
}

export default ServerCard;
