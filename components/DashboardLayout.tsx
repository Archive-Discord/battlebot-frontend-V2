import type { Guild } from "@types";
import SideBar from "./Sidebar";

const Layout: React.FC<LayoutProps> = ({ guild, children }) => {
  return <>
    <SideBar guild={guild}/>
    <div className="min-h-[100vh] lg:pl-[300px] py-[58px] z-0" style={{ fontFamily: "Noto Sans KR" }}>
      <div className="px-6 pt-5 h-full w-full">
        {children}
      </div>
    </div>
  </>;
};

interface LayoutProps {
  guild: Guild;
  children?: React.ReactNode;
}


export default Layout;
