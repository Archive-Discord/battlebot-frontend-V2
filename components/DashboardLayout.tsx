import type { Guild } from "@types";
import Loading from "./Loading";
import SideBar from "./Sidebar";
interface LayoutProps {
  guild?: Guild;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ guild, children }) => {
  if(!guild) return <Loading/>
  return <>
    <SideBar guild={guild}/>
    <div className="min-h-[100vh] lg:pl-[300px] pt-[58px] z-0">
      <div className="p-5 h-full w-full">
        {children}
      </div>
    </div>
  </>;
};

export default Layout;
