import type { Guild } from "@types";
import { useRouter } from "next/router";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";

const AnalyticsServer: React.FC<AnalyticsServerProps> = ({ guild }) => {
  const router = useRouter();
  const { t } = useTranslation()
  return (
    <>
      <div className="w-full" style={{ fontFamily: "Noto Sans KR" }}>
        <div className="mt-4 flex flex-wrap flex-row">
          <div className="mr-1.5 ml-1.5 mb-5 max-w-80 w-80 max-h-44 h-44 bg-white border rounded-md">
            <div className="px-5 h-[7.5rem] flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-purple-600">
                  <CountUp
                    end={guild.memberCount}
                    enableScrollSpy
                    separator=","
                  />
                  <span>{t("dashboard.index.analytics.countOfUser")}</span>
                </div>
                <span className="text-xl text-gray-500">{t("dashboard.index.analytics.userCount")}</span>
              </div>
              <div>
                <i className="far fa-user text-4xl" />
              </div>
            </div>
            <div
              onClick={() => {
                router.push(`/dashboard/${guild.id}/analytics`);
              }}
              className="cursor-pointer h-14 bg-gradient-to-r from-purple-600 to-purple-400 rounded-b-md flex items-center text-white justify-between px-5 border-b"
            >
              <span className="font-bold text-lg">{t("dashboard.index.analytics.detail")}</span>
              <i className="fas fa-chart-line" />
            </div>
          </div>
          <div className="mr-1.5 ml-1.5 mb-5 max-w-80 w-80 max-h-44 h-44 bg-white border rounded-md">
            <div className="px-5 h-[7.5rem] flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-sky-600">
                  <CountUp end={guild.tickets} enableScrollSpy separator="," />
                  <span>건</span>
                </div>
                <span className="text-xl text-gray-500">{t("dashboard.index.analytics.tickets")}</span>
              </div>
              <div>
                <i className="far fa-bell text-4xl" />
              </div>
            </div>
            <div
              onClick={() => {
                router.push(`/dashboard/${guild.id}/analytics`);
              }}
              className="cursor-pointer h-14 bg-gradient-to-r from-sky-600 to-sky-400 rounded-b-md flex items-center text-white justify-between px-5 border-b"
            >
              <span className="font-bold text-lg">{t("dashboard.index.analytics.detail")}</span>
              <i className="fas fa-chart-line" />
            </div>
          </div>
          <div className="mr-1.5 ml-1.5 mb-5 max-w-80 w-80 max-h-44 h-44 bg-white border rounded-md">
            <div className="px-5 h-[7.5rem] flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-emerald-600">
                  <CountUp end={guild.verifys} enableScrollSpy separator="," />
                  <span>건</span>
                </div>
                <span className="text-xl text-gray-500">{t("dashboard.index.analytics.verifys")}</span>
              </div>
              <div>
                <i className="far fa-check-circle text-4xl" />
              </div>
            </div>
            <div
              onClick={() => {
                router.push(`/dashboard/${guild.id}/analytics`);
              }}
              className="cursor-pointer h-14 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-b-md flex items-center text-white justify-between px-5 border-b"
            >
              <span className="font-bold text-lg">{t("dashboard.index.analytics.detail")}</span>
              <i className="fas fa-chart-line" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface AnalyticsServerProps {
  guild: Guild;
}

export default AnalyticsServer;
