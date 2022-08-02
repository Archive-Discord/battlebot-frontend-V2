import type { Guild } from "@types";
import SideBar from "./Sidebar";

const Layout: React.FC<LayoutProps> = ({ guild, children }) => {
  return <>
    <SideBar guild={guild}/>
    <div className="min-h-[100vh] lg:pl-[300px] pt-[58px] z-0">
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
