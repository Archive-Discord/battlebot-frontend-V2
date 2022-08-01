import { Guild } from "@types";
import { guildProfileLink } from "@utils/utils";
import React from "react";
import SidebarSelectServer from "@components/SidebarSelectServer";

const SideBar:React.FC<SideBarProps> = ({guild}) => {
    return (
        <>  
            <aside className="fixed left-0 p-5 border-r h-full overflow-y-auto w-full lg:w-[300px] lg:min-w-[300px]" style={{marginTop: "58px", fontFamily: "Noto Sans KR"}}>
                <SidebarSelectServer selectGuild={guild}/>
                <ul>
                    <li></li>
                </ul>
            </aside>
        </>
    )
}

interface SideBarProps {
    guild: Guild
}

export default SideBar;