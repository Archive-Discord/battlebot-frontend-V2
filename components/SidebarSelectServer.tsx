import type { Guild, UserGulds } from "@types";
import { swrfetcher } from "@utils/client";
import { guildProfileLink } from "@utils/utils";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import useSWR from "swr";
import { SmallLoading } from "./Loading";

const SidebarSelectServer: React.FC<SideBarSelectServerProps> = ({
  selectGuild,
}) => {
  const [openServerList, setOpenServerList] = useState(false);
  const router = useRouter()
  const ref = useDetectClickOutside({
    onTriggered: () => setOpenServerList(false),
  });

  const { data: userGuild, error: userGuildError } = useSWR<UserGulds>(
    "/auth/me/guilds",
    swrfetcher,
    {
      refreshInterval: 20000,
    }
  );

  return (
    <>
      <div ref={ref} className="relative lg:block inline-block w-full h-full min-h-[50px] h-[50px]">
        <div
          className="h-full flex flex-row justify-between border px-3 py-1.5 rounded-xl"
          onClick={() => {
            if (!openServerList) setOpenServerList(true);
            else setOpenServerList(false);
          }}
        >
          <div className="flex flx-row items-center">
            <img
              className="w-8 h-8 mr-2 rounded-full"
              src={guildProfileLink(selectGuild)}
            />
            <span>{selectGuild.name}</span>
          </div>
          <div className="flex items-center">
            {openServerList ? (
              <i className="fas fa-caret-up mr-1" />
            ) : (
              <i className="fas fa-caret-down mr-1" />
            )}
          </div>
        </div>
        <div
          className={`overflow-y-auto absolute min-h-[40px] max-h-[200px] bg-white border w-full mt-1 rounded-xl lg:max-w-[260px] z-10 ${
            openServerList ? "visible" : "invisible"
          }`}
          style={{
            transition: "all 0.3s",
            transform: openServerList ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
          }}
        >
          {userGuild ? (
            <>
              {userGuild
                .filter(guild => {
                  return guild.bot;
                })
                .sort((a,b) => (a.id === b.id ? 0 : a.id === selectGuild.id ? -1 : 1))
                .map((guild, index, guilds) => (
                  <>
                    <button onClick={() => {
                        router.push(`/dashboard/${guild.id}`)
                        setOpenServerList(false)
                    }} key={index} className={`w-full px-3 py-1.5 hover:bg-gray-100 ${index === 0 && "rounded-t-xl"} ${index == (guilds.length - 1) && "rounded-b-xl" }`}>
                      <div className="w-full flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                          <img className="w-8 h-8 rounded-full mr-2" src={guildProfileLink(guild)}/>
                            {guild.name}
                        </div>
                        <div>
                            {selectGuild.id == guild.id && <i className="fas fa-check text-green-500 mr-1"/>}
                        </div>
                      </div>
                    </button>
                  </>
                ))}
            </>
          ) : (
            <>
              <SmallLoading />
            </>
          )}
        </div>
      </div>
    </>
  );
};

interface SideBarSelectServerProps {
  selectGuild: Guild;
}

export default SidebarSelectServer;
