import type { Guild } from "@types";
import Loading from "./Loading";
interface LayoutProps {
  guild?: Guild;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ guild, children }) => {
  if(!guild) return <Loading/>
  return <>
  </>;
};

export default Layout;
