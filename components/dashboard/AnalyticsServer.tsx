import type { Guild } from "@types";
import CountUp from "react-countup";

const AnalyticsServer: React.FC<AnalyticsServerProps> = ({ guild }) => {
  return (
    <>
      <div className="w-full" style={{ fontFamily: "Noto Sans KR" }}>
        <div className="flex flex-col mr-1.5 ml-1.5">
          <span className="text-2xl font-bold">대시보드</span>
          <span className="text-lg mt-1 text-gray-500">
            서버에 대한 간략한 정보를 확인하세요!
          </span>
        </div>
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
                  <span>명</span>
                </div>
                <span className="text-xl text-gray-500">유저 수</span>
              </div>
              <div>
                <i className="far fa-user text-4xl"/>
              </div>
            </div>
            <div className="h-14 bg-gradient-to-r from-purple-600 to-purple-400 rounded-md flex items-center text-white justify-between px-5 border-b">
              <span className="font-bold text-lg">자세히 보기</span>
              <i className="fas fa-chart-line" />
            </div>
          </div>
          <div className="mr-1.5 ml-1.5 mb-5 max-w-80 w-80 max-h-44 h-44 bg-white border rounded-md">
            <div className="px-5 h-[7.5rem] flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-sky-600">
                  <CountUp
                    end={guild.tickets}
                    enableScrollSpy
                    separator=","
                  />
                  <span>건</span>
                </div>
                <span className="text-xl text-gray-500">생성된 티켓</span>
              </div>
              <div>
                <i className="far fa-bell text-4xl"/>
              </div>
            </div>
            <div className="h-14 bg-gradient-to-r from-sky-600 to-sky-400 rounded-md flex items-center text-white justify-between px-5 border-b">
              <span className="font-bold text-lg">자세히 보기</span>
              <i className="fas fa-chart-line" />
            </div>
          </div>
          <div className="mr-1.5 ml-1.5 mb-5 max-w-80 w-80 max-h-44 h-44 bg-white border rounded-md">
            <div className="px-5 h-[7.5rem] flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-emerald-600">
                  <CountUp
                    end={guild.verifys}
                    enableScrollSpy
                    separator=","
                  />
                  <span>건</span>
                </div>
                <span className="text-xl text-gray-500">완료한 인증</span>
              </div>
              <div>
                <i className="far fa-check-circle text-4xl"/>
              </div>
            </div>
            <div className="h-14 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-md flex items-center text-white justify-between px-5 border-b">
              <span className="font-bold text-lg">자세히 보기</span>
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
