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
    <div>
      {children}
    </div>
  </>;
};

export default Layout;
